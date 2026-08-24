import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateAndCleanItinerary } from '@/lib/schemaValidator';
import { getMockItinerary } from '@/lib/mockItinerary';

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama-3.1-8b-instant',
  'llama3-70b-8192',
  'mixtral-8x7b-32768'
];

async function callGroqWithFallback(apiKey, systemInstructions, userPrompt) {
  let lastError = null;

  for (const modelId of GROQ_MODELS) {
    // Attempt 1: json_object mode
    try {
      console.log(`Attempting Groq API refinement with model: ${modelId} (json_object mode)...`);
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: systemInstructions },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const groqData = await response.json();
        const content = groqData.choices?.[0]?.message?.content;
        if (content) return content;
      } else {
        const errText = await response.text();
        console.warn(`Groq refine model ${modelId} json_object mode failed (${response.status}): ${errText}`);
        lastError = new Error(`Groq Refine API Error (${response.status}): ${errText}`);
      }
    } catch (err) {
      console.warn(`Error calling Groq refine model ${modelId}:`, err.message);
      lastError = err;
    }

    // Attempt 2: Standard mode
    try {
      console.log(`Attempting Groq API refinement with model: ${modelId} (standard prompt mode)...`);
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: systemInstructions },
            { role: 'user', content: `${userPrompt}\n\nRespond strictly in valid JSON format.` }
          ]
        })
      });

      if (response.ok) {
        const groqData = await response.json();
        const content = groqData.choices?.[0]?.message?.content;
        if (content) return content;
      } else {
        const errText = await response.text();
        console.warn(`Groq refine model ${modelId} standard mode failed (${response.status}): ${errText}`);
        lastError = new Error(`Groq Refine API Error (${response.status}): ${errText}`);
      }
    } catch (err) {
      console.warn(`Error calling Groq refine model ${modelId} standard mode:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Groq refine models failed to return a response.');
}

export async function POST(req) {
  let userInstruction = '';
  let existingItinerary = null;

  try {
    const body = await req.json();
    userInstruction = body.instruction || '';
    existingItinerary = body.currentItinerary || null;

    if (!userInstruction || typeof userInstruction !== 'string' || userInstruction.trim() === '') {
      return Response.json(
        { success: false, error: 'Refinement instruction is required.' },
        { status: 400 }
      );
    }

    if (!existingItinerary || typeof existingItinerary !== 'object') {
      return Response.json(
        { success: false, error: 'Current itinerary data is required for refinement.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.includes('your_gemini_api_key') || apiKey.includes('your_groq_api_key')) {
      console.warn('API Key is missing. Returning modified fallback mock data.');
      const mockData = getMockItinerary(
        `${existingItinerary.destination || 'Trip'} (${userInstruction})`,
        null,
        existingItinerary.companionType || 'Solo Traveler'
      );
      return Response.json({ success: true, data: mockData });
    }

    const systemInstructions = `
You are an expert travel planner assistant.
The user wants to REFINE an existing travel itinerary based on a specific instruction. Respond in valid JSON format.

EXISTING ITINERARY JSON:
${JSON.stringify(existingItinerary, null, 2)}

USER REFINEMENT INSTRUCTION:
"${userInstruction}"

CRITICAL INSTRUCTIONS:
1. Update the itinerary based on the refinement instruction.
2. Preserve or update "packingChecklist" (documents, clothing, electronics, essentials).
3. Preserve or update "weatherAdvisor", "estimatedBudgetPerPax", and "budgetBreakdown".

Schema MUST match:
{
  "tripTitle": "Title",
  "destination": "City, Country",
  "duration": "X Days",
  "summary": "Updated summary",
  "companionType": "Companion type",
  "estimatedBudgetPerPax": "$XXX / person",
  "budgetBreakdown": {
    "stay": "$XXX",
    "food": "$XXX",
    "activities": "$XXX"
  },
  "weatherAdvisor": {
    "bestSeason": "Best season",
    "averageTemp": "Avg temp",
    "packingTip": "Packing tip"
  },
  "packingChecklist": {
    "documents": ["Item 1"],
    "clothing": ["Item 1"],
    "electronics": ["Item 1"],
    "essentials": ["Item 1"]
  },
  "isBudgetTooLow": false,
  "budgetWarning": null,
  "days": [
    {
      "dayNumber": 1,
      "title": "Theme",
      "stops": [
        {
          "id": "stop-id",
          "title": "Activity Name",
          "time": "Time",
          "description": "Description",
          "category": "Category",
          "location": "Location",
          "estimatedCost": "$15"
        }
      ]
    }
  ]
}

Return ONLY raw JSON object.
`;

    let responseText = null;

    if (apiKey.startsWith('gsk_')) {
      responseText = await callGroqWithFallback(
        apiKey, 
        systemInstructions, 
        `Please update the itinerary following this instruction: "${userInstruction}"`
      );
    } else {
      console.log('Refining via Google Gemini API engine...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });

      const result = await model.generateContent(systemInstructions);
      responseText = result.response.text();
    }

    if (!responseText) {
      throw new Error('Received empty response from AI model during refinement.');
    }

    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedJSON = JSON.parse(cleanedText);
    const validatedItinerary = validateAndCleanItinerary(parsedJSON);
    validatedItinerary.isMock = false;

    return Response.json({
      success: true,
      data: validatedItinerary
    });

  } catch (error) {
    console.error('Refinement API Error:', error.message);
    const mockData = getMockItinerary(
      userInstruction || 'Refined Trip',
      null,
      existingItinerary?.companionType || 'Solo Traveler'
    );
    return Response.json({
      success: true,
      data: mockData,
      warning: `Refinement notice: ${error.message}`
    });
  }
}
