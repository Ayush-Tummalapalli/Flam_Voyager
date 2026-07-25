import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateAndCleanItinerary } from '@/lib/schemaValidator';
import { getMockItinerary } from '@/lib/mockItinerary';

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
The user wants to REFINE an existing travel itinerary based on a specific instruction.

EXISTING ITINERARY JSON:
${JSON.stringify(existingItinerary, null, 2)}

USER REFINEMENT INSTRUCTION:
"${userInstruction}"

CRITICAL INSTRUCTIONS:
1. Update the itinerary based on the refinement instruction.
2. If user requests changing companion vibe (e.g. to Family, Couple, Friends, Solo), update "companionType" and tailor activities accordingly.
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

Return ONLY raw JSON.
`;

    let responseText = null;

    if (apiKey.startsWith('gsk_')) {
      console.log('Refining via Groq API engine with companion support...');
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemInstructions },
            { role: 'user', content: `Please update the itinerary following this instruction: "${userInstruction}"` }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!groqRes.ok) {
        const errText = await groqRes.text();
        throw new Error(`Groq Refine API Error (${groqRes.status}): ${errText}`);
      }

      const groqData = await groqRes.json();
      responseText = groqData.choices?.[0]?.message?.content;

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
