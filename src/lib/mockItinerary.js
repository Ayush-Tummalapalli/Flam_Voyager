/**
 * Dynamic Smart Itinerary Generator with Packing Checklist, Companion Filters, Per-Pax Budget & Weather Advisor.
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

  let packingChecklist = {
    documents: ['Passport & ID Cards', 'Flight & Hotel Bookings', 'Travel Medical Insurance'],
    clothing: ['Comfortable sneakers / walking shoes', 'Breathable shirts & tops', 'Versatile jacket or sweater'],
    electronics: ['Universal Plug Adapter', 'Power Bank (10,000mAh+)', 'Phone & Camera Chargers'],
    essentials: ['High SPF Sunscreen', 'Refillable Water Bottle', 'Personal First Aid Kit']
  };

  if (promptLower.includes('spain')) {
    destination = 'Spain';
    weatherAdvisor = {
      bestSeason: 'Spring (May-June) & Autumn (Sept-Oct)',
      averageTemp: '24°C / 75°F',
      packingTip: 'Sunscreen, comfortable walking shoes & breathable cotton clothing.'
    };
    packingChecklist.clothing.push('Sun hat & sunglasses');
    packingChecklist.essentials.push('Spanish phrasebook / translator app');
  } else if (promptLower.includes('netherlands') || promptLower.includes('amsterdam')) {
    destination = 'Netherlands';
    weatherAdvisor = {
      bestSeason: 'Spring (April-May tulip season) & Summer',
      averageTemp: '18°C / 64°F',
      packingTip: 'Compact umbrella, waterproof light jacket & walking sneakers.'
    };
    packingChecklist.essentials.push('Windbreaker / Raincoat', 'Compact Travel Umbrella');
  } else if (promptLower.includes('phuket') || promptLower.includes('thailand')) {
    destination = 'Phuket, Thailand';
    weatherAdvisor = {
      bestSeason: 'November to April (Dry Season)',
      averageTemp: '30°C / 86°F',
      packingTip: 'Swimwear, flip flops, high SPF sunscreen & light linen shirts.'
    };
    packingChecklist.clothing = ['Swimwear & Beach Cover-ups', 'Flip-flops & Sandals', 'Light Linen Shirts & Shorts'];
    packingChecklist.essentials.push('Waterproof Phone Pouch', 'Mosquito Repellent Spray');
  } else if (promptLower.includes('paris') || promptLower.includes('france')) {
    destination = 'Paris, France';
    weatherAdvisor = {
      bestSeason: 'June to August & September to October',
      averageTemp: '21°C / 70°F',
      packingTip: 'Stylish smart-casual outfits, comfortable shoes & light scarf.'
    };
    packingChecklist.clothing = ['Smart Casual Evening Wear', 'Comfortable Walking Shoes', 'Light Trench Coat or Scarf'];
  } else if (promptLower.includes('tokyo') || promptLower.includes('japan')) {
    destination = 'Tokyo, Japan';
    weatherAdvisor = {
      bestSeason: 'March-May (Cherry Blossom) & Sept-Nov',
      averageTemp: '19°C / 66°F',
      packingTip: 'Easy-to-remove walking shoes, portable charger & light jacket.'
    };
    packingChecklist.electronics.push('Pocket WiFi Router / eSIM');
    packingChecklist.clothing.push('Slip-on Shoes (easy removal for shrines/restaurants)');
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
    const dayStops = [
      {
        id: `stop-${i}-1`,
        title: i === 1 ? `Arrival & Exploring Sights in ${destination}` : i === 2 ? 'Cultural Landmarks & Architecture' : 'Local Markets & Panoramics',
        time: '10:00 AM - 01:00 PM',
        description: `Explore the vibrant streets, historic landmarks, and scenery of ${destination}.`,
        category: 'Sightseeing',
        location: destination,
        estimatedCost: '$15 - $25'
      },
      {
        id: `stop-${i}-2`,
        title: reqBudget && reqBudget < 400 ? 'Budget Street Food & Local Eateries' : 'Authentic Regional Dining',
        time: '01:30 PM - 03:00 PM',
        description: `Sample regional culinary specialties and local delicacies.`,
        category: 'Food',
        location: `${destination} Central Market`,
        estimatedCost: reqBudget && reqBudget < 400 ? '$8 - $15' : '$25 - $40'
      },
      {
        id: `stop-${i}-3`,
        title: 'Sunset Viewpoint & Evening Stroll',
        time: '06:00 PM - 08:30 PM',
        description: `Relax and take in panoramic views of ${destination}.`,
        category: 'Relaxation',
        location: `${destination} Waterfront`,
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
    tripTitle: `${daysCount}-Day ${destination} Experience`,
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
    packingChecklist: packingChecklist,
    isBudgetTooLow: isBudgetTooLow,
    budgetWarning: budgetWarning,
    days: days
  };
}
