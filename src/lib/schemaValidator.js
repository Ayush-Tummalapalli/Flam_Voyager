/**
 * Schema Validator & Normalizer for Travel Planner Itineraries.
 * Protects the UI against unexpected LLM output formats, missing fields, or malformed JSON.
 */

export function validateAndCleanItinerary(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid AI response: Expected a JSON object.');
  }

  // Ensure top-level fields exist with sensible fallbacks
  const cleanData = {
    tripTitle: typeof data.tripTitle === 'string' && data.tripTitle.trim() !== '' 
      ? data.tripTitle 
      : 'Custom Travel Itinerary',
    destination: typeof data.destination === 'string' ? data.destination : 'Destination',
    duration: typeof data.duration === 'string' ? data.duration : 'Multi-day Trip',
    summary: typeof data.summary === 'string' ? data.summary : 'An itinerary tailored to your preferences.',
    days: []
  };

  // Validate days array
  const rawDays = Array.isArray(data.days) ? data.days : [];
  
  if (rawDays.length === 0) {
    throw new Error('Invalid AI response: No daily schedule found in the generated output.');
  }

  cleanData.days = rawDays.map((day, dIdx) => {
    const dayNumber = typeof day.dayNumber === 'number' ? day.dayNumber : dIdx + 1;
    const title = typeof day.title === 'string' && day.title.trim() !== '' 
      ? day.title 
      : `Day ${dayNumber}`;
      
    const rawStops = Array.isArray(day.stops) ? day.stops : [];
    
    const stops = rawStops.map((stop, sIdx) => {
      return {
        id: stop.id || `day-${dayNumber}-stop-${sIdx + 1}-${Math.random().toString(36).substr(2, 5)}`,
        title: typeof stop.title === 'string' && stop.title.trim() !== '' 
          ? stop.title 
          : `Activity ${sIdx + 1}`,
        time: typeof stop.time === 'string' && stop.time.trim() !== '' 
          ? stop.time 
          : 'Flexible Time',
        description: typeof stop.description === 'string' 
          ? stop.description 
          : 'Enjoy exploring this spot.',
        category: typeof stop.category === 'string' ? stop.category : 'General',
        location: typeof stop.location === 'string' ? stop.location : ''
      };
    });

    return {
      dayNumber,
      title,
      stops
    };
  });

  return cleanData;
}
