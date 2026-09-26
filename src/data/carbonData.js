/**
 * CarbonWise AI — Carbon Calculation Engine & Options
 *
 * Sourced directly from the central Emission Factor Registry (emissionFactors.js).
 * Calculates estimated daily carbon footprint (kg CO2e) following the GHG Protocol
 * Activity Data × Emission Factor methodology.
 */

import {
  FACTOR_VERSION,
  EMISSION_FACTOR_REGISTRY,
  getEmissionFactor,
  getAllEmissionFactors,
} from './emissionFactors.js'

export { FACTOR_VERSION, getAllEmissionFactors, getEmissionFactor }

export const TRANSPORT_OPTIONS = [
  {
    id: 'car',
    label: 'Car',
    icon: 'car',
    kg: EMISSION_FACTOR_REGISTRY.transport_car.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.transport_car,
    blurb: 'Solo driving, average petrol/diesel car (~25 km)',
  },
  {
    id: 'bus',
    label: 'Bus',
    icon: 'bus',
    kg: EMISSION_FACTOR_REGISTRY.transport_bus.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.transport_bus,
    blurb: 'Shared public transit bus (~20 km)',
  },
  {
    id: 'train',
    label: 'Train / Metro',
    icon: 'train',
    kg: EMISSION_FACTOR_REGISTRY.transport_train.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.transport_train,
    blurb: 'Rail, metro, or suburban local train (~20 km)',
  },
  {
    id: 'bicycle',
    label: 'Bicycle',
    icon: 'bike',
    kg: EMISSION_FACTOR_REGISTRY.transport_bicycle.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.transport_bicycle,
    blurb: 'Pedal power, active low-carbon commute (~10 km)',
  },
  {
    id: 'walking',
    label: 'Walking',
    icon: 'walk',
    kg: EMISSION_FACTOR_REGISTRY.transport_walking.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.transport_walking,
    blurb: 'Zero emissions, pure human energy (~5 km)',
  },
]

export const ELECTRICITY_OPTIONS = [
  {
    id: 'low',
    label: 'Low',
    kg: EMISSION_FACTOR_REGISTRY.electricity_low.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.electricity_low,
    blurb: 'Efficient fans, LEDs, minimal AC use (~1.7 kWh)',
  },
  {
    id: 'medium',
    label: 'Medium',
    kg: EMISSION_FACTOR_REGISTRY.electricity_medium.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.electricity_medium,
    blurb: 'Typical household baseline (~4.2 kWh)',
  },
  {
    id: 'high',
    label: 'High',
    kg: EMISSION_FACTOR_REGISTRY.electricity_high.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.electricity_high,
    blurb: 'Heavy AC, heating, or multi-appliance use (~8.1 kWh)',
  },
]

export const FOOD_OPTIONS = [
  {
    id: 'vegetarian',
    label: 'Vegetarian',
    kg: EMISSION_FACTOR_REGISTRY.food_vegetarian.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.food_vegetarian,
    blurb: 'Plant-based or traditional lacto-vegetarian meals',
  },
  {
    id: 'mixed',
    label: 'Mixed',
    kg: EMISSION_FACTOR_REGISTRY.food_mixed.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.food_mixed,
    blurb: 'Balanced mix of plant and animal products',
  },
  {
    id: 'non-vegetarian',
    label: 'Non-Vegetarian',
    kg: EMISSION_FACTOR_REGISTRY.food_non_vegetarian.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.food_non_vegetarian,
    blurb: 'Meat-forward meals today',
  },
]

export const PLASTIC_OPTIONS = [
  {
    id: 'low',
    label: 'Low',
    kg: EMISSION_FACTOR_REGISTRY.plastic_low.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.plastic_low,
    blurb: 'Reusables, cloth bags, minimal single-use packaging',
  },
  {
    id: 'medium',
    label: 'Medium',
    kg: EMISSION_FACTOR_REGISTRY.plastic_medium.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.plastic_medium,
    blurb: 'Standard grocery packaging and occasional items',
  },
  {
    id: 'high',
    label: 'High',
    kg: EMISSION_FACTOR_REGISTRY.plastic_high.dailyKgCO2e,
    factorMeta: EMISSION_FACTOR_REGISTRY.plastic_high,
    blurb: 'Frequent takeaway plastic containers and bottles',
  },
]

// Impact Rating Thresholds (Daily kg CO2e)
export const IMPACT_LEVELS = [
  { id: 'low', label: 'Low Impact', max: 5.0, color: '#3fc47e', desc: 'You are living lightly on the planet today.' },
  { id: 'moderate', label: 'Moderate Impact', max: 9.0, color: '#aed43b', desc: 'A balanced footprint with room for targeted reductions.' },
  { id: 'high', label: 'High Impact', max: 13.0, color: '#e3b341', desc: 'Your footprint is above average today.' },
  { id: 'very-high', label: 'Very High Impact', max: Infinity, color: '#e2604f', desc: 'High emissions today — small swaps add up fast.' },
]

export function validateCarbonInputs(inputs) {
  const errors = {}
  if (!inputs || typeof inputs !== 'object') {
    return {
      valid: false,
      errors: { form: 'Input data is required.' },
      sanitized: { transport: 'car', electricity: 'medium', food: 'mixed', plastic: 'medium' },
    }
  }

  const validTransport = TRANSPORT_OPTIONS.some((o) => o.id === inputs.transport)
  const validElectricity = ELECTRICITY_OPTIONS.some((o) => o.id === inputs.electricity)
  const validFood = FOOD_OPTIONS.some((o) => o.id === inputs.food)
  const validPlastic = PLASTIC_OPTIONS.some((o) => o.id === inputs.plastic)

  if (!validTransport) errors.transport = 'Please select a valid transportation option.'
  if (!validElectricity) errors.electricity = 'Please select a valid electricity usage option.'
  if (!validFood) errors.food = 'Please select a valid food preference.'
  if (!validPlastic) errors.plastic = 'Please select a valid plastic usage option.'

  const sanitized = {
    transport: validTransport ? inputs.transport : 'car',
    electricity: validElectricity ? inputs.electricity : 'medium',
    food: validFood ? inputs.food : 'mixed',
    plastic: validPlastic ? inputs.plastic : 'medium',
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  }
}

export function getImpactLevel(score) {
  const numericScore = typeof score === 'number' && Number.isFinite(score) ? Math.max(0, score) : 0
  return IMPACT_LEVELS.find((lvl) => numericScore <= lvl.max) || IMPACT_LEVELS[IMPACT_LEVELS.length - 1]
}

export function calculateCarbonScore(inputs) {
  const { sanitized } = validateCarbonInputs(inputs)

  const tMeta = getEmissionFactor('transport', sanitized.transport)
  const eMeta = getEmissionFactor('electricity', sanitized.electricity)
  const fMeta = getEmissionFactor('food', sanitized.food)
  const pMeta = getEmissionFactor('plastic', sanitized.plastic)

  const t = tMeta?.dailyKgCO2e ?? (TRANSPORT_OPTIONS.find((o) => o.id === sanitized.transport)?.kg ?? 0)
  const e = eMeta?.dailyKgCO2e ?? (ELECTRICITY_OPTIONS.find((o) => o.id === sanitized.electricity)?.kg ?? 0)
  const f = fMeta?.dailyKgCO2e ?? (FOOD_OPTIONS.find((o) => o.id === sanitized.food)?.kg ?? 0)
  const p = pMeta?.dailyKgCO2e ?? (PLASTIC_OPTIONS.find((o) => o.id === sanitized.plastic)?.kg ?? 0)

  const totalRaw = t + e + f + p
  const total = Number.isFinite(totalRaw) ? +totalRaw.toFixed(2) : 0

  return {
    total,
    breakdown: {
      transport: Number.isFinite(t) ? +t.toFixed(2) : 0,
      electricity: Number.isFinite(e) ? +e.toFixed(2) : 0,
      food: Number.isFinite(f) ? +f.toFixed(2) : 0,
      plastic: Number.isFinite(p) ? +p.toFixed(2) : 0,
    },
    factorVersion: FACTOR_VERSION,
  }
}

export function getCalculationDetails(inputs) {
  const { sanitized } = validateCarbonInputs(inputs)

  const items = [
    {
      category: 'Transportation',
      key: 'transport',
      optionId: sanitized.transport,
      meta: getEmissionFactor('transport', sanitized.transport),
    },
    {
      category: 'Electricity',
      key: 'electricity',
      optionId: sanitized.electricity,
      meta: getEmissionFactor('electricity', sanitized.electricity),
    },
    {
      category: 'Food & Diet',
      key: 'food',
      optionId: sanitized.food,
      meta: getEmissionFactor('food', sanitized.food),
    },
    {
      category: 'Single-Use Plastics',
      key: 'plastic',
      optionId: sanitized.plastic,
      meta: getEmissionFactor('plastic', sanitized.plastic),
    },
  ]

  return items.map((item) => {
    const meta = item.meta
    const activityVal = meta?.assumedActivityValue ?? 1
    const activityUnit = meta?.activityUnit ?? 'unit'
    const factorVal = meta?.factor ?? 0
    const factorUnit = meta?.factorUnit ?? 'kgCO2e/unit'
    const estimatedKg = meta?.dailyKgCO2e ?? (activityVal * factorVal)

    return {
      category: item.category,
      key: item.key,
      activity: meta?.activity || item.optionId,
      activityValue: activityVal,
      activityUnit: activityUnit,
      factor: factorVal,
      factorUnit: factorUnit,
      estimatedKg: +estimatedKg.toFixed(2),
      formula: `${activityVal} ${activityUnit} × ${factorVal} ${factorUnit} = ${estimatedKg.toFixed(2)} kg CO₂e`,
      source: meta?.source || 'Documented benchmark',
      sourceUrl: meta?.sourceUrl || '',
      region: meta?.region || 'Global',
      isIndiaSpecific: Boolean(meta?.isIndiaSpecific),
      year: meta?.year || 2024,
      notes: meta?.notes || '',
    }
  })
}

export const RECOMMENDATION_RULES = [
  {
    id: 'swap-car',
    when: (i) => i.transport === 'car',
    text: 'Swap one car trip this week for a bus, train, or bike ride — transport is your biggest single lever.',
    category: 'Transportation',
    challengeId: 'walk-instead',
  },
  {
    id: 'keep-active',
    when: (i) => i.transport === 'bicycle' || i.transport === 'walking',
    text: 'Great call commuting under your own power — keep it up and you are already near zero emissions here.',
    category: 'Transportation',
    challengeId: null,
  },
  {
    id: 'transit-user',
    when: (i) => i.transport === 'bus' || i.transport === 'train',
    text: 'Using public transit cuts per-person travel emissions by up to 70% compared to solo driving.',
    category: 'Transportation',
    challengeId: null,
  },
  {
    id: 'electricity-high',
    when: (i) => i.electricity === 'high',
    text: 'Shift heavy appliance use (AC, geysers, laundry) away from peak hours and maintain AC at 24-25°C.',
    category: 'Electricity',
    challengeId: 'energy-saver',
  },
  {
    id: 'electricity-medium',
    when: (i) => i.electricity === 'medium',
    text: 'Switch to LED bulbs and turn off devices on standby — small habits compound over a month.',
    category: 'Electricity',
    challengeId: 'energy-saver',
  },
  {
    id: 'food-meat',
    when: (i) => i.food === 'non-vegetarian',
    text: 'Try one plant-based meal today — even one swap a day meaningfully lowers your food footprint.',
    category: 'Food',
    challengeId: 'meat-free-day',
  },
  {
    id: 'food-mixed',
    when: (i) => i.food === 'mixed',
    text: 'Lean a little more plant-forward this week; lentils, legumes, and paneer/tofu are low-carbon protein swaps.',
    category: 'Food',
    challengeId: 'meat-free-day',
  },
  {
    id: 'plastic-high',
    when: (i) => i.plastic === 'high',
    text: 'Carry a reusable water bottle and cloth shopping bag — cutting single-use plastic is the fastest habit win.',
    category: 'Plastic',
    challengeId: 'no-plastic-day',
  },
  {
    id: 'plastic-medium',
    when: (i) => i.plastic === 'medium',
    text: 'Choose unpackaged fresh produce where you can and refill containers instead of buying single-use bottles.',
    category: 'Plastic',
    challengeId: 'no-plastic-day',
  },
]

export function getRecommendations(inputs) {
  if (!inputs) return []
  return RECOMMENDATION_RULES.filter((rule) => {
    try {
      return rule.when(inputs)
    } catch {
      return false
    }
  })
}

export function getReductionPlan(breakdown) {
  if (!breakdown || typeof breakdown !== 'object') {
    return {
      largestCategory: 'transport',
      largestLabel: 'Transportation',
      largestValue: 0,
      icon: 'car',
      actions: [
        { text: 'Walk or bike for short trips under 2 km', challengeId: 'walk-instead' },
        { text: 'Combine daily errands into a single trip', challengeId: 'walk-instead' },
      ],
    }
  }

  const entries = [
    { key: 'transport', label: 'Transportation', icon: 'car', val: breakdown.transport || 0 },
    { key: 'electricity', label: 'Electricity Usage', icon: 'bolt', val: breakdown.electricity || 0 },
    { key: 'food', label: 'Diet & Meals', icon: 'plate', val: breakdown.food || 0 },
    { key: 'plastic', label: 'Single-Use Plastics', icon: 'bottle', val: breakdown.plastic || 0 },
  ]

  entries.sort((a, b) => b.val - a.val)
  const top = entries[0]

  const actionMap = {
    transport: [
      { text: 'Replace solo short vehicle trips with walking, cycling, or metro', challengeId: 'walk-instead' },
      { text: 'Combine multiple errands into a single connected journey', challengeId: 'walk-instead' },
      { text: 'Carpool or use public bus transit for regular commutes', challengeId: 'walk-instead' },
    ],
    electricity: [
      { text: 'Set AC thermostat to 24-25°C to cut cooling emissions by 15-20%', challengeId: 'energy-saver' },
      { text: 'Turn off standby power switches for TVs, chargers, and microwaves', challengeId: 'energy-saver' },
      { text: 'Maximize natural daylight and cross-ventilation during peak hours', challengeId: 'energy-saver' },
    ],
    food: [
      { text: 'Enjoy a fully vegetarian/plant-based meal today', challengeId: 'meat-free-day' },
      { text: 'Choose seasonal, locally grown produce over imported goods', challengeId: 'meat-free-day' },
      { text: 'Minimize meal leftovers and compost organic kitchen scraps', challengeId: 'meat-free-day' },
    ],
    plastic: [
      { text: 'Carry a personal refillable bottle and reusable cloth bag', challengeId: 'no-plastic-day' },
      { text: 'Decline single-use plastic cutlery, straws, and polybags', challengeId: 'no-plastic-day' },
      { text: 'Buy pantry staples in bulk or unpackaged fresh markets', challengeId: 'second-hand-find' },
    ],
  }

  return {
    largestCategory: top.key,
    largestLabel: top.label,
    largestValue: top.val,
    icon: top.icon,
    actions: actionMap[top.key] || actionMap.transport,
  }
}

export const CHALLENGES = [
  {
    id: 'no-plastic-day',
    title: 'No Plastic Day',
    description: 'Go a full day without using any single-use plastic items or polybags.',
    points: 20,
    category: 'Plastic',
  },
  {
    id: 'walk-instead',
    title: 'Walk, Bike, or Transit',
    description: 'Replace at least one car/cab trip with walking, cycling, or public transit.',
    points: 15,
    category: 'Transportation',
  },
  {
    id: 'energy-saver',
    title: 'Energy Saver Day',
    description: 'Cut non-essential electricity use — keep AC at 24°C+ and unplug idle devices.',
    points: 15,
    category: 'Electricity',
  },
  {
    id: 'plant-a-tree',
    title: 'Plant or Tend Greens',
    description: 'Plant a sapling, tend home plants, or support a local urban greens initiative.',
    points: 30,
    category: 'Offsetting',
  },
  {
    id: 'meat-free-day',
    title: 'Plant-Forward Meals',
    description: 'Eat fully vegetarian or plant-based for all meals today.',
    points: 15,
    category: 'Food',
  },
  {
    id: 'second-hand-find',
    title: 'Reusable or Pre-Owned',
    description: 'Choose a pre-owned item or reusable container instead of buying brand new.',
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
    desc: 'You started your daily sustainability journey.',
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    minPoints: 100,
    icon: 'leaf',
    desc: 'Consistent eco-action with 100+ points earned.',
  },
  {
    id: 'sustainability-champion',
    name: 'Sustainability Champion',
    minPoints: 200,
    icon: 'tree',
    desc: 'A role model for low-impact living with 200+ points earned.',
  },
]

export function getCurrentBadge(points) {
  const safePoints = typeof points === 'number' && Number.isFinite(points) ? Math.max(0, points) : 0
  return [...BADGES].reverse().find((b) => safePoints >= b.minPoints) || BADGES[0]
}

export function getNextBadge(points) {
  const safePoints = typeof points === 'number' && Number.isFinite(points) ? Math.max(0, points) : 0
  return BADGES.find((b) => safePoints < b.minPoints) || null
}
