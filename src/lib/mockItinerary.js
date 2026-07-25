/**
 * Dynamic Smart Itinerary Generator with Per-Pax Budget Estimation & Low-Budget Protection.
 */

export function getMockItinerary(userPrompt, targetBudget = null) {
  const prompt = userPrompt || 'Travel trip';
  const promptLower = prompt.toLowerCase();
  
  // Extract potential destination
  let destination = 'Custom Destination';
  if (promptLower.includes('spain')) destination = 'Spain';
  else if (promptLower.includes('netherlands') || promptLower.includes('amsterdam')) destination = 'Netherlands';
  else if (promptLower.includes('phuket') || promptLower.includes('thailand')) destination = 'Phuket, Thailand';
  else if (promptLower.includes('paris') || promptLower.includes('france')) destination = 'Paris, France';
  else if (promptLower.includes('tokyo') || promptLower.includes('japan')) destination = 'Tokyo, Japan';
  else if (promptLower.includes('goa') || promptLower.includes('india')) destination = 'Goa, India';
  else if (promptLower.includes('york') || promptLower.includes('nyc')) destination = 'New York City, USA';
  else if (promptLower.includes('kyoto')) destination = 'Kyoto, Japan';

  // Extract duration (default 3 days)
  let daysCount = 3;
  const dayMatch = promptLower.match(/(\d+)\s*day/);
  if (dayMatch && dayMatch[1]) {
    daysCount = Math.min(Math.max(parseInt(dayMatch[1], 10), 1), 7);
  }

  // Extract budget number from prompt or targetBudget
  let reqBudget = targetBudget;
  if (!reqBudget) {
    const budgetMatch = promptLower.match(/(?:budget|under|\$|usd|inr|₹)\s*(\d+)/);
    if (budgetMatch && budgetMatch[1]) {
      reqBudget = parseInt(budgetMatch[1], 10);
    }
  }

  // Min realistic budget calculation (~$50-$80/day per person minimum)
  const minRequiredPerDay = 50;
  const minTotalRequired = daysCount * minRequiredPerDay;

  let isBudgetTooLow = false;
  let budgetWarning = null;

  if (reqBudget && reqBudget < minTotalRequired) {
    isBudgetTooLow = true;
    budgetWarning = `Given budget ($${reqBudget}/pax) is too low for a ${daysCount}-day trip to ${destination}. Recommended minimum budget is $${minTotalRequired} per person ($${minRequiredPerDay}/day).`;
  }

  const estimatedTotalPerPax = isBudgetTooLow ? reqBudget : Math.max(reqBudget || 350, minTotalRequired);

  const days = [];
  for (let i = 1; i <= daysCount; i++) {
    const dayStops = [
      {
        id: `stop-${i}-1`,
        title: i === 1 ? `Arrival & Exploration in ${destination}` : i === 2 ? 'Cultural Landmarks & Sights' : 'Local Excursions & Markets',
        time: '10:00 AM - 01:00 PM',
        description: `Explore the vibrant districts and sights of ${destination}.`,
        category: 'Sightseeing',
        location: destination,
        estimatedCost: '$15 - $25'
      },
      {
        id: `stop-${i}-2`,
        title: reqBudget && reqBudget < 400 ? 'Budget Street Food & Local Eats' : 'Signature Dining & Local Tasting',
        time: '01:30 PM - 03:00 PM',
        description: `Enjoy delicious regional food tailored to your budget preferences.`,
        category: 'Food',
        location: 'Food Quarter',
        estimatedCost: reqBudget && reqBudget < 400 ? '$8 - $15' : '$25 - $40'
      },
      {
        id: `stop-${i}-3`,
        title: 'Sunset Viewpoint & Evening Walk',
        time: '06:00 PM - 08:30 PM',
        description: `Relax and take in panoramic views of ${destination}.`,
        category: 'Relaxation',
        location: 'Panoramics',
        estimatedCost: 'Free'
      }
    ];

    days.push({
      dayNumber: i,
      title: `Day ${i}: ${i === 1 ? 'Arrival & Key Sights' : i === 2 ? 'Culture & Food' : 'Excursions'}`,
      stops: dayStops
    });
  }

  return {
    isMock: true,
    tripTitle: `${daysCount}-Day ${destination} Travel Plan`,
    destination: destination,
    duration: `${daysCount} Days`,
    summary: `A customized ${daysCount}-day itinerary for "${prompt}".`,
    estimatedBudgetPerPax: `$${estimatedTotalPerPax} / person`,
    budgetBreakdown: {
      stay: `$${Math.round(estimatedTotalPerPax * 0.45)}`,
      food: `$${Math.round(estimatedTotalPerPax * 0.35)}`,
      activities: `$${Math.round(estimatedTotalPerPax * 0.20)}`
    },
    isBudgetTooLow: isBudgetTooLow,
    budgetWarning: budgetWarning,
    days: days
  };
}
