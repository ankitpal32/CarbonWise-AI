
export const TRANSPORT_OPTIONS = [
  { id: 'car', label: 'Car', icon: 'car', kg: 4.6, blurb: 'Solo driving, average fuel car' },
  { id: 'bus', label: 'Bus', icon: 'bus', kg: 1.7, blurb: 'Shared public transit' },
  { id: 'train', label: 'Train', icon: 'train', kg: 1.0, blurb: 'Rail or metro commute' },
  { id: 'bicycle', label: 'Bicycle', icon: 'bike', kg: 0.1, blurb: 'Pedal power, near zero emissions' },
  { id: 'walking', label: 'Walking', icon: 'walk', kg: 0, blurb: 'Zero emissions, all you' },
]

export const ELECTRICITY_OPTIONS = [
  { id: 'low', label: 'Low', kg: 1.2, blurb: 'Mindful use, efficient appliances' },
  { id: 'medium', label: 'Medium', kg: 3.0, blurb: 'Typical household usage' },
  { id: 'high', label: 'High', kg: 5.8, blurb: 'AC, heating, or heavy appliance use' },
]

export const FOOD_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian', kg: 1.5, blurb: 'Plant-based meals today' },
  { id: 'mixed', label: 'Mixed', kg: 3.2, blurb: 'A mix of plant and animal products' },
  { id: 'non-vegetarian', label: 'Non-Vegetarian', kg: 5.0, blurb: 'Meat-forward meals today' },
]

export const PLASTIC_OPTIONS = [
  { id: 'low', label: 'Low', kg: 0.3, blurb: 'Reusables, minimal single-use plastic' },
  { id: 'medium', label: 'Medium', kg: 0.9, blurb: 'Some packaging and single-use items' },
  { id: 'high', label: 'High', kg: 1.8, blurb: 'Frequent single-use plastic' },
]
export const FLIGHT_OPTIONS = [
  { id: 'none', label: 'No Flights', icon: 'cloud', kg: 0, blurb: 'No air travel today' },
  { id: 'short-haul', label: 'Short-Haul Flight', icon: 'airplane-takeoff', kg: 150.0, blurb: 'Domestic or regional flight (< 3 hours)' },
  { id: 'medium-haul', label: 'Medium-Haul Flight', icon: 'airplane', kg: 350.0, blurb: 'Cross-continental flight (3-6 hours)' },
  { id: 'long-haul', label: 'Long-Haul Flight', icon: 'airplane-landing', kg: 850.0, blurb: 'Intercontinental journey (6+ hours)' },
]

export const CONSUMPTION_OPTIONS = [
  { id: 'minimalist', label: 'Minimalist', icon: 'leaf', kg: 0.5, blurb: 'Bought nothing new or shopped purely secondhand' },
  { id: 'essentials', label: 'Essentials Only', icon: 'basket', kg: 2.2, blurb: 'Groceries, medicine, or unavoidable baseline goods' },
  { id: 'discretionary', label: 'Discretionary Shopping', icon: 'shirt', kg: 8.5, blurb: 'New clothes, homeware, or small retail items' },
  { id: 'electronics', label: 'Tech & Gadgets', icon: 'laptop', kg: 45.0, blurb: 'Purchased a new smartphone, tablet, or appliance' },
]

export const WATER_OPTIONS = [
  { id: 'low', label: 'Water Conscious', icon: 'water-pump', kg: 0.2, blurb: 'Short shower (< 5 mins), efficient appliance cycles' },
  { id: 'medium', label: 'Standard Use', icon: 'water', kg: 0.8, blurb: 'Average shower length, typical daily tap use' },
  { id: 'high', label: 'High Water Use', icon: 'bathtub', kg: 2.1, blurb: 'Long hot showers, deep baths, or running hose lines' },
]

export const WASTE_OPTIONS = [
  { id: 'zero-waste', label: 'Near Zero Waste', icon: 'recycle', kg: 0.1, blurb: 'Composted food scraps, sorted recycling, minimal trash' },
  { id: 'standard', label: 'Standard Trash', icon: 'trash-can', kg: 0.9, blurb: 'Mixed trash bin, standard household sorting' },
  { id: 'heavy', label: 'Heavy Waste', icon: 'dumpster', kg: 2.4, blurb: 'Significant food waste, untrimmed packaging, zero recycling' },
]

// Thresholds for daily total kg-CO2e -> impact rating
export const IMPACT_LEVELS = [
  { id: 'low', label: 'Low Impact', max: 5, color: '#3fc47e', desc: 'You are living lightly on the planet today.' },
  { id: 'moderate', label: 'Moderate Impact', max: 9, color: '#aed43b', desc: 'A balanced footprint with room to trim.' },
  { id: 'high', label: 'High Impact', max: 13, color: '#e3b341', desc: 'Your footprint is above average today.' },
  { id: 'very-high', label: 'Very High Impact', max: Infinity, color: '#e2604f', desc: 'Significant emissions today — small swaps add up fast.' },
]

export function getImpactLevel(score) {
  return IMPACT_LEVELS.find((lvl) => score <= lvl.max) || IMPACT_LEVELS[IMPACT_LEVELS.length - 1]
}

export function calculateCarbonScore({ transport, electricity, food, plastic }) {
  const t = TRANSPORT_OPTIONS.find((o) => o.id === transport)?.kg ?? 0
  const e = ELECTRICITY_OPTIONS.find((o) => o.id === electricity)?.kg ?? 0
  const f = FOOD_OPTIONS.find((o) => o.id === food)?.kg ?? 0
  const p = PLASTIC_OPTIONS.find((o) => o.id === plastic)?.kg ?? 0
  const total = +(t + e + f + p).toFixed(2)
  return {
    total,
    breakdown: { transport: t, electricity: e, food: f, plastic: p },
  }
}

export const RECOMMENDATION_RULES = [
  {
    id: 'swap-car',
    when: (i) => i.transport === 'car',
    text: 'Swap one car trip this week for a bus, train, or bike ride — transport is your biggest single lever.',
    category: 'Transportation',
  },
  {
    id: 'keep-active',
    when: (i) => i.transport === 'bicycle' || i.transport === 'walking',
    text: 'Great call commuting under your own power — keep it up and you are already near zero here.',
    category: 'Transportation',
  },
  {
    id: 'electricity-high',
    when: (i) => i.electricity === 'high',
    text: 'Shift heavy appliance use (AC, heater, laundry) to off-peak hours and unplug idle electronics.',
    category: 'Electricity',
  },
  {
    id: 'electricity-medium',
    when: (i) => i.electricity === 'medium',
    text: 'Switch to LED bulbs and turn off devices on standby — small habits compound over a month.',
    category: 'Electricity',
  },
  {
    id: 'food-meat',
    when: (i) => i.food === 'non-vegetarian',
    text: 'Try one plant-based meal today — even one swap a day meaningfully lowers your food footprint.',
    category: 'Food',
  },
  {
    id: 'food-mixed',
    when: (i) => i.food === 'mixed',
    text: 'Lean a little more plant-forward this week; lentils and legumes are a low-carbon protein swap.',
    category: 'Food',
  },
  {
    id: 'plastic-high',
    when: (i) => i.plastic === 'high',
    text: 'Carry a reusable bottle and bag — single-use plastic is the easiest category to cut fast.',
    category: 'Plastic',
  },
  {
    id: 'plastic-medium',
    when: (i) => i.plastic === 'medium',
    text: 'Choose unpackaged produce where you can and refill containers instead of buying new.',
    category: 'Plastic',
  },
  {
    id: 'plastic-low',
    when: (i) => i.plastic === 'low',
    text: 'Your plastic habits are already solid — share your reusables setup with a friend.',
    category: 'Plastic',
  },
]

export function getRecommendations(inputs) {
  return RECOMMENDATION_RULES.filter((rule) => rule.when(inputs))
}

export const CHALLENGES = [
  {
    id: 'no-plastic-day',
    title: 'No Plastic Day',
    description: 'Go a full day without using any single-use plastic.',
    points: 20,
    category: 'Plastic',
  },
  {
    id: 'walk-instead',
    title: 'Walk Instead of Drive',
    description: 'Replace one car trip with walking, cycling, or transit.',
    points: 15,
    category: 'Transportation',
  },
  {
    id: 'energy-saver',
    title: 'Energy Saver Challenge',
    description: 'Cut your electricity use for the day — lights, AC, and devices.',
    points: 15,
    category: 'Electricity',
  },
  {
    id: 'plant-a-tree',
    title: 'Plant a Tree',
    description: 'Plant a tree or sapling, or sponsor one through a local initiative.',
    points: 30,
    category: 'Offsetting',
  },
  {
    id: 'meat-free-day',
    title: 'Meat-Free Day',
    description: 'Eat fully vegetarian or vegan for the entire day.',
    points: 15,
    category: 'Food',
  },
  {
    id: 'second-hand-find',
    title: 'Buy Second-Hand',
    description: 'Choose a pre-owned item instead of buying new.',
    points: 10,
    category: 'Consumption',
  },
]

export const BADGES = [
  {
    id: 'green-beginner',
    name: 'Green Beginner',
    minPoints: 0,
    icon: 'sprout',
    desc: 'You have started your sustainability journey.',
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    minPoints: 100,
    icon: 'leaf',
    desc: 'Consistent eco-action — 100+ points earned.',
  },
  {
    id: 'sustainability-champion',
    name: 'Sustainability Champion',
    minPoints: 150,
    icon: 'tree',
    desc: 'A role model for low-impact living — 150+ points earned.',
  },
]

export function getCurrentBadge(points) {
  return [...BADGES].reverse().find((b) => points >= b.minPoints) || BADGES[0]
}

export function getNextBadge(points) {
  return BADGES.find((b) => points < b.minPoints) || null
}
