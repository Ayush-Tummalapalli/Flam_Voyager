import { validateAndCleanItinerary } from '@/lib/schemaValidator';
import { getMockItinerary } from '@/lib/mockItinerary';

const GEMINI_MODELS = [
  'gemini-3.6-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

const OPENROUTER_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen-2.5-coder-32b-instruct:free',
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-4-31b-it:free',
  'mistralai/mistral-7b-instruct:free',
  'nvidia/nemotron-3.5-lightning:free'
];

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama-3.1-8b-instant',
  'llama3-70b-8192',
  'mixtral-8x7b-32768'
];

async function callGeminiWithFallback(apiKey, systemInstructions, userPrompt) {
  let lastError = null;

  for (const modelId of GEMINI_MODELS) {
    try {
      console.log(`Calling Official Gemini REST API with model: ${modelId}`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemInstructions}\n\nUser Request: "${userPrompt}"` }
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
        console.warn(`Gemini model ${modelId} failed (${response.status}): ${errText}`);
        lastError = new Error(`Gemini API Error (${response.status}): ${errText}`);
      }
    } catch (err) {
      console.warn(`Error calling Gemini model ${modelId}:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed to return a response.');
}

async function callOpenRouterWithFallback(apiKey, systemInstructions, userPrompt) {
  let lastError = null;

  for (const modelId of OPENROUTER_MODELS) {
    try {
      console.log(`Calling OpenRouter API with model: ${modelId}`);
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'HTTP-Referer': 'https://itinera-ai-planner.vercel.app',
          'X-Title': 'Itinera AI Travel Planner',
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
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      } else {
        const errText = await response.text();
        console.warn(`OpenRouter model ${modelId} failed (${response.status}): ${errText}`);
        lastError = new Error(`OpenRouter Error (${response.status}): ${errText}`);
      }
    } catch (err) {
      console.warn(`Error calling OpenRouter model ${modelId}:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All OpenRouter models failed to return a response.');
}

async function callGroqWithFallback(apiKey, systemInstructions, userPrompt) {
  let lastError = null;

  for (const modelId of GROQ_MODELS) {
    try {
      console.log(`Attempting Groq API with model ${modelId}...`);
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
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
        console.warn(`Groq model ${modelId} failed (${response.status}): ${errText}`);
        lastError = new Error(`Groq API Error (${response.status}): ${errText}`);
      }
    } catch (err) {
      console.warn(`Error calling Groq model ${modelId}:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Groq models failed to return a response.');
}

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

    const geminiKey = process.env.GEMINI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    const systemInstructions = `
You are an expert travel planner assistant.
Generate a realistic, day-by-day travel itinerary based on the user request in JSON format.

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

Return ONLY raw JSON object.
`;

    let responseText = null;

    // 1. Try Official Google Gemini FIRST if provided
    if (geminiKey && geminiKey.trim().length > 10 && !geminiKey.includes('your_gemini_api_key')) {
      try {
        responseText = await callGeminiWithFallback(geminiKey, systemInstructions, userPrompt);
      } catch (err) {
        console.warn('Official Gemini API call failed, falling back to other providers:', err.message);
      }
    }

    // 2. Try OpenRouter as fallback
    if (!responseText && openRouterKey && openRouterKey.trim().length > 10 && !openRouterKey.includes('your_api_key')) {
      try {
        responseText = await callOpenRouterWithFallback(openRouterKey, systemInstructions, userPrompt);
      } catch (err) {
        console.warn('OpenRouter cascade failed, trying Groq:', err.message);
      }
    }

    // 3. Try Groq as fallback
    if (!responseText && groqKey && groqKey.trim().length > 10 && !groqKey.includes('your_groq_api_key')) {
      try {
        responseText = await callGroqWithFallback(groqKey, systemInstructions, userPrompt);
      } catch (err) {
        console.warn('Groq cascade failed:', err.message);
      }
    }

    if (!responseText) {
      console.warn('All AI services failed or API key missing. Returning fallback mock data.');
      const mockData = getMockItinerary(userPrompt || 'Custom Trip', null, companionType);
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
    console.error('API Generation Error:', error.message);
    const mockData = getMockItinerary(userPrompt || 'Custom Trip', null, companionType);
    return Response.json({
      success: true,
      data: mockData,
      warning: `AI generation notice: ${error.message}`
    });
  }
}
