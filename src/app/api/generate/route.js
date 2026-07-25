import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateAndCleanItinerary } from '@/lib/schemaValidator';
import { getMockItinerary } from '@/lib/mockItinerary';

export async function POST(req) {
  let userPrompt = '';

  try {
    const body = await req.json();
    userPrompt = body.prompt || '';

    if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim() === '') {
      return Response.json(
        { success: false, error: 'Prompt is required. Please describe your travel plans.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

    // Fallback to mock itinerary if API key is missing or default
    if (!apiKey || apiKey.includes('your_gemini_api_key') || apiKey.includes('your_groq_api_key')) {
      console.warn('API Key is missing or default. Returning fallback mock data.');
      const mockData = getMockItinerary(userPrompt);
      return Response.json({ success: true, data: mockData });
    }

    const systemInstructions = `
You are an expert travel planner assistant.
Generate a realistic, day-by-day travel itinerary based on the user request.

You MUST return ONLY a valid JSON object with NO markdown formatting, NO backticks, and NO extra commentary.
Required JSON Schema:
{
  "tripTitle": "Catchy title for the trip",
  "destination": "City, Country",
  "duration": "X Days",
  "summary": "Short 2-sentence summary of what this itinerary highlights",
  "days": [
    {
      "dayNumber": 1,
      "title": "Theme for Day 1",
      "stops": [
        {
          "id": "stop-1-1",
          "title": "Place / Activity Name",
          "time": "09:00 AM - 11:30 AM",
          "description": "2-3 sentences explaining what to do here and insider tips",
          "category": "Sightseeing | Food | Culture | Relaxation | Shopping | Adventure",
          "location": "Neighborhood or Landmark area"
        }
      ]
    }
  ]
}
`;

    let responseText = null;

    // Detect if key is a Groq API Key (starts with gsk_)
    if (apiKey.startsWith('gsk_')) {
      console.log('Calling Groq API...');
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
      // Default to Google Gemini API
      console.log('Calling Google Gemini API...');
      const genAI = new GoogleGenerativeAI(apiKey);
      
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        }
      });

      const fullPrompt = `${systemInstructions}\n\nUser request: "${userPrompt.replace(/"/g, '\\"')}"`;
      const result = await model.generateContent(fullPrompt);
      responseText = result.response.text();
    }

    if (!responseText) {
      throw new Error('Received empty response from AI service.');
    }

    // Clean JSON response (strip markdown wrappers if present)
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedJSON = JSON.parse(cleanedText);
    const validatedItinerary = validateAndCleanItinerary(parsedJSON);

    // Explicitly set isMock: false so the UI knows this is fresh live AI output!
    validatedItinerary.isMock = false;

    return Response.json({
      success: true,
      data: validatedItinerary
    });

  } catch (error) {
    console.error('API Generation Error:', error.message);
    
    // Return mock itinerary fallback marked with warning, so frontend receives clean JSON
    const mockData = getMockItinerary(userPrompt || 'Custom Trip');
    return Response.json({
      success: true,
      data: mockData,
      warning: `AI generation notice: ${error.message}`
    });
  }
}
