/**
 * Dynamic Smart Itinerary Generator with Companion Filters, Per-Pax Budget & Weather Advisor.
 */

export function getMockItinerary(userPrompt, targetBudget = null, companionType = 'Solo Traveler') {
  const prompt = userPrompt || 'Travel trip';
  const promptLower = prompt.toLowerCase();
  
  // Extract potential destination
  let destination = 'Custom Destination';
  let weatherAdvisor = {
    bestSeason: 'Spring & Autumn (March-May, Sept-Nov)',
    averageTemp: '20°C / 68°F',
    packingTip: 'Comfortable walking shoes, sunglasses & light layers.'
  };

  if (promptLower.includes('spain')) {
    destination = 'Spain';
    weatherAdvisor = {
      bestSeason: 'Spring (May-June) & Autumn (Sept-Oct)',
      averageTemp: '24°C / 75°F',
      packingTip: 'Sunscreen, comfortable walking shoes & breathable cotton clothing.'
    };
  } else if (promptLower.includes('netherlands') || promptLower.includes('amsterdam')) {
    destination = 'Netherlands';
    weatherAdvisor = {
      bestSeason: 'Spring (April-May tulip season) & Summer',
      averageTemp: '18°C / 64°F',
      packingTip: 'Compact umbrella, waterproof light jacket & walking sneakers.'
    };
  } else if (promptLower.includes('phuket') || promptLower.includes('thailand')) {
    destination = 'Phuket, Thailand';
    weatherAdvisor = {
      bestSeason: 'November to April (Dry Season)',
      averageTemp: '30°C / 86°F',
      packingTip: 'Swimwear, flip flops, high SPF sunscreen & light linen shirts.'
    };
  } else if (promptLower.includes('paris') || promptLower.includes('france')) {
    destination = 'Paris, France';
    weatherAdvisor = {
      bestSeason: 'June to August & September to October',
      averageTemp: '21°C / 70°F',
      packingTip: 'Stylish smart-casual outfits, comfortable shoes & light scarf.'
    };
  } else if (promptLower.includes('tokyo') || promptLower.includes('japan')) {
    destination = 'Tokyo, Japan';
    weatherAdvisor = {
      bestSeason: 'March-May (Cherry Blossom) & Sept-Nov',
      averageTemp: '19°C / 66°F',
      packingTip: 'Easy-to-remove walking shoes, portable charger & light jacket.'
    };
  } else if (promptLower.includes('goa') || promptLower.includes('india')) {
    destination = 'Goa, India';
    weatherAdvisor = {
      bestSeason: 'November to February (Sunny Beach Season)',
      averageTemp: '29°C / 84°F',
      packingTip: 'Beachwear, sunglasses, mosquito repellent & light cottons.'
    };
  }

  // Extract duration
  let daysCount = 3;
  const dayMatch = promptLower.match(/(\d+)\s*day/);
  if (dayMatch && dayMatch[1]) {
    daysCount = Math.min(Math.max(parseInt(dayMatch[1], 10), 1), 7);
  }

  let reqBudget = targetBudget;
  if (!reqBudget) {
    const budgetMatch = promptLower.match(/(?:budget|under|\$|usd|inr|₹)\s*(\d+)/);
    if (budgetMatch && budgetMatch[1]) {
      reqBudget = parseInt(budgetMatch[1], 10);
    }
  }

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
    let stop1Title = `Arrival & Exploring Sights in ${destination}`;
    let stop2Title = 'Local Cuisine & Food Tasting';
    let stop3Title = 'Sunset Viewpoint & Evening Walk';

    if (companionType.includes('Family')) {
      stop1Title = `Family Friendly Parks & Sights in ${destination}`;
      stop2Title = 'Kid-Friendly Local Restaurant';
      stop3Title = 'Interactive Science & Nature Park Walk';
    } else if (companionType.includes('Couple')) {
      stop1Title = `Romantic Old Town Stroll in ${destination}`;
      stop2Title = 'Candlelit Local Bistro & Wine Tasting';
      stop3Title = 'Scenic Sunset Panorama Viewpoint';
    } else if (companionType.includes('Friends')) {
      stop1Title = `Group Adventure & High Energy Sights in ${destination}`;
      stop2Title = 'Vibrant Street Food & Craft Brewery Crawl';
      stop3Title = 'Night Market & Live Music Lounge';
    }

    const dayStops = [
      {
        id: `stop-${i}-1`,
        title: stop1Title,
        time: '10:00 AM - 01:00 PM',
        description: `Experience ${destination} tailored specifically for ${companionType}.`,
        category: 'Sightseeing',
        location: destination,
        estimatedCost: '$15 - $25'
      },
      {
        id: `stop-${i}-2`,
        title: stop2Title,
        time: '01:30 PM - 03:00 PM',
        description: `Sample regional food and dining spots suitable for ${companionType}.`,
        category: 'Food',
        location: `${destination} Central District`,
        estimatedCost: reqBudget && reqBudget < 400 ? '$8 - $15' : '$25 - $40'
      },
      {
        id: `stop-${i}-3`,
        title: stop3Title,
        time: '06:00 PM - 08:30 PM',
        description: `Relax and wrap up day ${i} with an enjoyable evening atmosphere.`,
        category: 'Relaxation',
        location: `${destination} Promenade`,
        estimatedCost: 'Free'
      }
    ];

    days.push({
      dayNumber: i,
      title: `Day ${i}: ${i === 1 ? 'Arrival & Key Highlights' : i === 2 ? 'Culture & Dining' : 'Excursions'}`,
      stops: dayStops
    });
  }

  return {
    isMock: true,
    tripTitle: `${daysCount}-Day ${destination} (${companionType} Edition)`,
    destination: destination,
    duration: `${daysCount} Days`,
    summary: `A customized ${daysCount}-day itinerary for ${companionType} based on "${prompt}".`,
    companionType: companionType,
    estimatedBudgetPerPax: `$${estimatedTotalPerPax} / person`,
    budgetBreakdown: {
      stay: `$${Math.round(estimatedTotalPerPax * 0.45)}`,
      food: `$${Math.round(estimatedTotalPerPax * 0.35)}`,
      activities: `$${Math.round(estimatedTotalPerPax * 0.20)}`
    },
    weatherAdvisor: weatherAdvisor,
    isBudgetTooLow: isBudgetTooLow,
    budgetWarning: budgetWarning,
    days: days
  };
}
