/**
 * Schema Validator & Normalizer for Travel Planner Itineraries.
 * Includes Companion Type, Weather & Season Advisor, Per-Pax Budget Estimation, and Budget Warning handling.
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
    companionType: typeof data.companionType === 'string' && data.companionType.trim() !== ''
      ? data.companionType
      : 'General',
    estimatedBudgetPerPax: typeof data.estimatedBudgetPerPax === 'string' && data.estimatedBudgetPerPax.trim() !== ''
      ? data.estimatedBudgetPerPax
      : '$350 / person',
    budgetBreakdown: typeof data.budgetBreakdown === 'object' && data.budgetBreakdown !== null
      ? {
          stay: data.budgetBreakdown.stay || '$150',
          food: data.budgetBreakdown.food || '$120',
          activities: data.budgetBreakdown.activities || '$80'
        }
      : { stay: '$150', food: '$120', activities: '$80' },
    weatherAdvisor: typeof data.weatherAdvisor === 'object' && data.weatherAdvisor !== null
      ? {
          bestSeason: data.weatherAdvisor.bestSeason || 'Spring & Autumn',
          averageTemp: data.weatherAdvisor.averageTemp || '22°C / 72°F',
          packingTip: data.weatherAdvisor.packingTip || 'Comfortable walking shoes & light layers'
        }
      : {
          bestSeason: 'Spring & Autumn',
          averageTemp: '22°C / 72°F',
          packingTip: 'Comfortable walking shoes & light layers'
        },
    isBudgetTooLow: Boolean(data.isBudgetTooLow),
    budgetWarning: typeof data.budgetWarning === 'string' ? data.budgetWarning : null,
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
        location: typeof stop.location === 'string' ? stop.location : '',
        estimatedCost: typeof stop.estimatedCost === 'string' ? stop.estimatedCost : 'Free'
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
