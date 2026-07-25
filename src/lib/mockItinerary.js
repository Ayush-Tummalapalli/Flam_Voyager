/**
 * Dynamic Smart Itinerary Generator (Offline & Resilience Fallback).
 * Dynamically parses the user's prompt (destination, duration, vibe) to construct 
 * a tailored multi-day itinerary when network access or LLM quotas are restricted.
 */

export function getMockItinerary(userPrompt) {
  const prompt = userPrompt || 'Travel trip';
  const promptLower = prompt.toLowerCase();
  
  // Extract potential destination from prompt
  let destination = 'Custom Destination';
  if (promptLower.includes('spain')) destination = 'Spain';
  else if (promptLower.includes('netherlands') || promptLower.includes('amsterdam')) destination = 'Netherlands';
  else if (promptLower.includes('phuket') || promptLower.includes('thailand')) destination = 'Phuket, Thailand';
  else if (promptLower.includes('paris') || promptLower.includes('france')) destination = 'Paris, France';
  else if (promptLower.includes('tokyo') || promptLower.includes('japan')) destination = 'Tokyo, Japan';
  else if (promptLower.includes('goa') || promptLower.includes('india')) destination = 'Goa, India';
  else if (promptLower.includes('york') || promptLower.includes('nyc')) destination = 'New York City, USA';
  else if (promptLower.includes('kyoto')) destination = 'Kyoto, Japan';
  else {
    // Extract first capitalized word or first subject
    const words = prompt.split(' ');
    const possibleCity = words.find(w => w.length > 3 && /^[A-Z]/.test(w));
    if (possibleCity) destination = possibleCity;
  }

  // Extract duration (default 3 days)
  let daysCount = 3;
  const dayMatch = promptLower.match(/(\d+)\s*day/);
  if (dayMatch && dayMatch[1]) {
    daysCount = Math.min(Math.max(parseInt(dayMatch[1], 10), 1), 7);
  }

  const days = [];
  
  const activityTemplates = [
    { title: 'Historic City Center & Landmarks', category: 'Sightseeing', time: '09:30 AM - 12:30 PM' },
    { title: 'Authentic Local Culinary Tasting', category: 'Food', time: '01:00 PM - 02:30 PM' },
    { title: 'Museum & Cultural Immersion', category: 'Culture', time: '03:30 PM - 06:00 PM' },
    { title: 'Scenic Sunset Walk & Waterfront', category: 'Relaxation', time: '06:30 PM - 08:00 PM' },
    { title: 'Evening Street Food & Nightlife', category: 'Food', time: '08:30 PM - 10:30 PM' }
  ];

  for (let i = 1; i <= daysCount; i++) {
    const dayStops = [];
    
    // Customize based on day number
    if (i === 1) {
      dayStops.push({
        id: `stop-${i}-1`,
        title: `Arrival & Old Town Exploration in ${destination}`,
        time: '10:00 AM - 01:00 PM',
        description: `Arrive in ${destination}, check into accommodation, and take a guided walk through the iconic central district.`,
        category: 'Sightseeing',
        location: `Central ${destination}`
      });
      dayStops.push({
        id: `stop-${i}-2`,
        title: 'Traditional Local Lunch',
        time: '01:30 PM - 03:00 PM',
        description: `Sample regional specialties, local tapas, or authentic street delicacies.`,
        category: 'Food',
        location: 'Culinary Quarter'
      });
      dayStops.push({
        id: `stop-${i}-3`,
        title: 'Sunset Viewpoint & Welcome Evening',
        time: '06:00 PM - 08:30 PM',
        description: `Relax at a top-rated panorama deck or coastal promenade as the sun sets over ${destination}.`,
        category: 'Relaxation',
        location: 'Panoramics'
      });
    } else if (i === 2) {
      dayStops.push({
        id: `stop-${i}-1`,
        title: 'Art, Heritage & Historic Landmarks',
        time: '09:30 AM - 12:30 PM',
        description: `Visit renowned architectural highlights, cathedrals, or famous galleries.`,
        category: 'Culture',
        location: 'Museum District'
      });
      dayStops.push({
        id: `stop-${i}-2`,
        title: 'Food Market & Artisan Tasting',
        time: '01:00 PM - 03:00 PM',
        description: `Browse vibrant food halls, artisan bakeries, and savor fresh regional dishes.`,
        category: 'Food',
        location: 'Central Market'
      });
      dayStops.push({
        id: `stop-${i}-3`,
        title: 'Evening Cultural Experience',
        time: '07:00 PM - 09:30 PM',
        description: `Enjoy live acoustic music, local performances, or evening atmosphere.`,
        category: 'Culture',
        location: 'Downtown'
      });
    } else {
      dayStops.push({
        id: `stop-${i}-1`,
        title: `Day Trip & Nature Excursion near ${destination}`,
        time: '09:00 AM - 01:00 PM',
        description: `Head out to nearby scenic parks, coastal islands, or charming countryside towns.`,
        category: 'Adventure',
        location: `Greater ${destination}`
      });
      dayStops.push({
        id: `stop-${i}-2`,
        title: 'Farewell Culinary Feast',
        time: '07:00 PM - 09:30 PM',
        description: `Celebrate the final evening of your trip with an unforgettable dining experience.`,
        category: 'Food',
        location: 'Waterfront Restaurant'
      });
    }

    days.push({
      dayNumber: i,
      title: `Day ${i}: ${i === 1 ? 'Arrival & Key Sights' : i === 2 ? 'Culture & Food Tour' : 'Excursions & Highlights'}`,
      stops: dayStops
    });
  }

  return {
    isMock: true,
    tripTitle: `${daysCount}-Day ${destination} Travel Experience`,
    destination: destination,
    duration: `${daysCount} Days`,
    summary: `A customized ${daysCount}-day itinerary for "${prompt}". (Generated via Smart Resilience Engine)`,
    days: days
  };
}
