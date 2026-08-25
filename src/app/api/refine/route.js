import { validateAndCleanItinerary } from '@/lib/schemaValidator';
import { getMockItinerary } from '@/lib/mockItinerary';

const GEMINI_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-3.6-flash'
];

async function callGeminiWithFallback(apiKey, systemInstructions, userPrompt) {
  let lastError = null;

  for (const modelId of GEMINI_MODELS) {
    try {
      console.log(`Calling Official Gemini API refine with model: ${modelId}`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemInstructions}\n\nRefinement Request: "${userPrompt}"` }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) return content;
      } else {
        const errText = await response.text();
        console.warn(`Gemini refine model ${modelId} failed (${response.status}): ${errText}`);
        lastError = new Error(`Gemini API Error (${response.status}): ${errText}`);
      }
    } catch (err) {
      console.warn(`Error calling Gemini refine model ${modelId}:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini refine models failed to return a response.');
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

    const geminiKey = process.env.GEMINI_API_KEY;

    const systemInstructions = `
You are an expert travel planner assistant.
The user wants to REFINE an existing travel itinerary based on a specific instruction. Respond in valid JSON format.

EXISTING ITINERARY JSON:
${JSON.stringify(existingItinerary, null, 2)}

USER REFINEMENT INSTRUCTION:
"${userInstruction}"

CRITICAL INSTRUCTIONS:
1. Update the itinerary based on the refinement instruction.
2. Preserve or update "packingChecklist" (documents, clothing, essentials).
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

    // Call Official Google Gemini API
    if (geminiKey && geminiKey.trim().length > 10 && !geminiKey.includes('your_gemini_api_key')) {
      try {
        responseText = await callGeminiWithFallback(
          geminiKey, 
          systemInstructions, 
          `Please update the itinerary following this instruction: "${userInstruction}"`
        );
      } catch (err) {
        console.warn('Gemini refine API call failed, using zero-crash fallback engine:', err.message);
      }
    }

    if (!responseText) {
      console.warn('Gemini API key missing or API call failed. Returning zero-crash fallback mock data.');
      const mockData = getMockItinerary(
        userInstruction || 'Refined Trip',
        null,
        existingItinerary?.companionType || 'Solo Traveler'
      );
      return Response.json({ success: true, data: mockData });
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
