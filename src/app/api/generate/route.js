import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateAndCleanItinerary } from '@/lib/schemaValidator';
import { getMockItinerary } from '@/lib/mockItinerary';

export async function POST(req) {
  let userPrompt = '';
  let companionType = 'Solo Traveler';

  try {
    const body = await req.json();
    userPrompt = body.prompt || '';
    companionType = body.companionType || 'Solo Traveler';

    if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim() === '') {
      return Response.json(
        { success: false, error: 'Prompt is required. Please describe your travel plans.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.includes('your_gemini_api_key') || apiKey.includes('your_groq_api_key')) {
      console.warn('API Key is missing or default. Returning fallback mock data.');
      const mockData = getMockItinerary(userPrompt, null, companionType);
      return Response.json({ success: true, data: mockData });
    }

    const systemInstructions = `
You are an expert travel planner assistant.
Generate a realistic, day-by-day travel itinerary based on the user request.

REQUIRED SCHEMAS & FEATURES:
1. Include "companionType": "${companionType}".
2. Estimate total budget per person in USD (estimatedBudgetPerPax, budgetBreakdown: stay, food, activities).
3. If user requests an unrealistically low budget (under $30/day), set isBudgetTooLow: true and budgetWarning string.
4. Provide a "weatherAdvisor" object (bestSeason, averageTemp, packingTip).
5. Provide a destination & weather tailored "packingChecklist" object:
   - "documents": Array of strings (e.g., ["Passport & Visas", "Travel Insurance Policy"])
   - "clothing": Array of strings (e.g., ["Linen shirts", "Walking sneakers", "Swimwear"])
   - "electronics": Array of strings (e.g., ["Universal Adapter", "Power Bank", "Camera Charger"])
   - "essentials": Array of strings (e.g., ["High SPF Sunscreen", "Bug Spray", "Refillable Bottle"])

Required JSON Schema:
{
  "tripTitle": "Catchy title for the trip",
  "destination": "City, Country",
  "duration": "X Days",
  "summary": "Short 2-sentence summary",
  "companionType": "${companionType}",
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
    "documents": ["Item 1", "Item 2"],
    "clothing": ["Item 1", "Item 2"],
    "electronics": ["Item 1", "Item 2"],
    "essentials": ["Item 1", "Item 2"]
  },
  "isBudgetTooLow": false,
  "budgetWarning": null,
  "days": [
    {
      "dayNumber": 1,
      "title": "Theme for Day 1",
      "stops": [
        {
          "id": "stop-1-1",
          "title": "Place / Activity Name",
          "time": "09:00 AM - 11:30 AM",
          "description": "2-3 sentences explaining what to do here",
          "category": "Sightseeing | Food | Culture | Relaxation | Shopping | Adventure",
          "location": "Landmark / Area",
          "estimatedCost": "$15 - $25"
        }
      ]
    }
  ]
}

Return ONLY raw JSON.
`;

    let responseText = null;

    if (apiKey.startsWith('gsk_')) {
      console.log(`Calling Groq API for generation with Packing Checklist...`);
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
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!groqRes.ok) {
        const errText = await groqRes.text();
        throw new Error(`Groq API Error (${groqRes.status}): ${errText}`);
      }

      const groqData = await groqRes.json();
      responseText = groqData.choices?.[0]?.message?.content;

    } else {
      console.log(`Calling Google Gemini API...`);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });

      const fullPrompt = `${systemInstructions}\n\nUser request: "${userPrompt.replace(/"/g, '\\"')}"`;
      const result = await model.generateContent(fullPrompt);
      responseText = result.response.text();
    }

    if (!responseText) {
      throw new Error('Received empty response from AI service.');
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
    console.error('API Generation Error:', error.message);
    const mockData = getMockItinerary(userPrompt || 'Custom Trip', null, companionType);
    return Response.json({
      success: true,
      data: mockData,
      warning: `AI generation notice: ${error.message}`
    });
  }
}
