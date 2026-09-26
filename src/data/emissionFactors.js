/**
 * CarbonWise AI — Central Emission Factor Registry
 *
 * All factors follow the GHG Protocol basic calculation model:
 * Estimated Emissions = Activity Data × Emission Factor
 *
 * Standardized Factor Schema:
 * - id: Unique factor identifier
 * - category: 'transport' | 'electricity' | 'food' | 'plastic'
 * - activity: Human-readable activity name
 * - activityUnit: Unit of user activity (e.g. km/day, kWh/day, day)
 * - assumedActivityValue: Baseline daily activity value assumed in MVP option selectors
 * - factor: Numeric emission factor
 * - factorUnit: Standardized emission factor unit (e.g. kgCO2e/km, kgCO2e/kWh)
 * - dailyKgCO2e: Normalized daily emission estimate (assumedActivityValue × factor)
 * - gasType: 'CO2e' (carbon dioxide equivalent) or 'CO2'
 * - region: Geographic validity (e.g. 'India National Grid (CEA)' or 'Global Benchmark')
 * - isIndiaSpecific: boolean
 * - source: Primary authoritative reference
 * - sourceUrl: Link to verified publication
 * - year: Publication or baseline year
 * - methodology: Calculation standard (e.g. Tier 1 IPCC, Location-based grid intensity, LCA)
 * - isFallback: boolean indicating whether this is a fallback estimate
 * - notes: Explicit assumptions and operational boundaries
 */

export const FACTOR_VERSION = '2026.1'

export const EMISSION_FACTOR_REGISTRY = {
  // ==========================================
  // TRANSPORTATION
  // ==========================================
  transport_car: {
    id: 'transport_car',
    category: 'transport',
    activity: 'Solo Driving (Petrol/Diesel Car)',
    assumedActivityValue: 25.0,
    activityUnit: 'km/day',
    factor: 0.184,
    factorUnit: 'kgCO2e/km',
    dailyKgCO2e: 4.6,
    gasType: 'CO2e',
    region: 'India & Global Benchmark',
    isIndiaSpecific: true,
    source: 'UK DEFRA / DESNZ 2024 & ARAI (Automotive Research Association of India) small-to-midsize car average (~14 km/L)',
    sourceUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024',
    year: 2024,
    methodology: 'Activity (km) × Average direct tailpipe emissions + well-to-wheel multiplier',
    isFallback: false,
    notes: 'Assumes average urban compact petrol/diesel car with solo occupancy and ~25 km typical daily roundtrip.',
  },

  transport_bus: {
    id: 'transport_bus',
    category: 'transport',
    activity: 'Shared Public Transit (Bus)',
    assumedActivityValue: 20.0,
    activityUnit: 'km/day',
    factor: 0.085,
    factorUnit: 'kgCO2e/pass-km',
    dailyKgCO2e: 1.7,
    gasType: 'CO2e',
    region: 'India & Global Benchmark',
    isIndiaSpecific: true,
    source: 'Central Road Research Institute (CRRI) / UK DEFRA Local Bus Passenger Benchmarks',
    sourceUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024',
    year: 2024,
    methodology: 'Fleet fuel consumption allocated across average passenger-km load',
    isFallback: false,
    notes: 'Assumes standard city/suburban public transit bus with average urban load factor (~20 km daily roundtrip).',
  },

  transport_train: {
    id: 'transport_train',
    category: 'transport',
    activity: 'Rail Transit / Metro / Suburban Train',
    assumedActivityValue: 20.0,
    activityUnit: 'km/day',
    factor: 0.050,
    factorUnit: 'kgCO2e/pass-km',
    dailyKgCO2e: 1.0,
    gasType: 'CO2e',
    region: 'India & Global Benchmark',
    isIndiaSpecific: true,
    source: 'Delhi Metro Rail Corporation (DMRC) Carbon Baseline & Indian Railways GHG Reports',
    sourceUrl: 'https://www.delhimetrorail.com',
    year: 2024,
    methodology: 'Electric traction grid intensity allocated per passenger-km',
    isFallback: false,
    notes: 'Assumes electric urban rail/metro commute of ~20 km powered by Indian national grid electric traction.',
  },

  transport_bicycle: {
    id: 'transport_bicycle',
    category: 'transport',
    activity: 'Bicycle / Active Pedal Commute',
    assumedActivityValue: 10.0,
    activityUnit: 'km/day',
    factor: 0.010,
    factorUnit: 'kgCO2e/km',
    dailyKgCO2e: 0.1,
    gasType: 'CO2e',
    region: 'Global Benchmark',
    isIndiaSpecific: false,
    source: 'European Cyclists Federation (ECF) Lifecycle Bicycle Assessment',
    sourceUrl: 'https://ecf.com/resources/cycling-facts-and-figures',
    year: 2023,
    methodology: 'Amortized manufacturing, maintenance, and dietary caloric replenishment',
    isFallback: false,
    notes: 'Direct tailpipe is 0.00; accounts for amortized equipment lifecycle (~0.01 kg CO2e/km).',
  },

  transport_walking: {
    id: 'transport_walking',
    category: 'transport',
    activity: 'Walking / Foot Travel',
    assumedActivityValue: 5.0,
    activityUnit: 'km/day',
    factor: 0.0,
    factorUnit: 'kgCO2e/km',
    dailyKgCO2e: 0.0,
    gasType: 'CO2e',
    region: 'Global Standard',
    isIndiaSpecific: false,
    source: 'GHG Protocol Standard Scope 3 Guidance',
    sourceUrl: 'https://ghgprotocol.org',
    year: 2024,
    methodology: 'Zero direct anthropogenic greenhouse gas emissions',
    isFallback: false,
    notes: 'Zero emissions, pure human energy.',
  },

  // ==========================================
  // ELECTRICITY (GRID INTENSITY)
  // ==========================================
  electricity_low: {
    id: 'electricity_low',
    category: 'electricity',
    activity: 'Low Electricity (Mindful / Energy Efficient)',
    assumedActivityValue: 1.68,
    activityUnit: 'kWh/day',
    factor: 0.713,
    factorUnit: 'kgCO2e/kWh',
    dailyKgCO2e: 1.2,
    gasType: 'CO2e',
    region: 'India National Grid (CEA)',
    isIndiaSpecific: true,
    source: 'Central Electricity Authority (CEA) of India, CO2 Baseline Database for Indian Power Sector (User Guide v19)',
    sourceUrl: 'https://cea.nic.in',
    year: 2024,
    methodology: 'Location-based National Grid weighted average operating & build margin',
    isFallback: false,
    notes: 'Assumes ~1.7 kWh daily consumption (efficient ceiling fans, LED lights, phone/laptop, zero AC use) @ 0.713 kg CO2e/kWh.',
  },

  electricity_medium: {
    id: 'electricity_medium',
    category: 'electricity',
    activity: 'Medium Electricity (Typical Household Baseline)',
    assumedActivityValue: 4.21,
    activityUnit: 'kWh/day',
    factor: 0.713,
    factorUnit: 'kgCO2e/kWh',
    dailyKgCO2e: 3.0,
    gasType: 'CO2e',
    region: 'India National Grid (CEA)',
    isIndiaSpecific: true,
    source: 'Central Electricity Authority (CEA) of India, CO2 Baseline Database v19 & BEE (Bureau of Energy Efficiency)',
    sourceUrl: 'https://cea.nic.in',
    year: 2024,
    methodology: 'Location-based National Grid emission factor applied to median urban household consumption',
    isFallback: false,
    notes: 'Assumes ~4.2 kWh daily consumption (refrigerator, TV, lighting, occasional fan/AC) @ 0.713 kg CO2e/kWh.',
  },

  electricity_high: {
    id: 'electricity_high',
    category: 'electricity',
    activity: 'High Electricity (Heavy AC / Heating / Multi-Appliance)',
    assumedActivityValue: 8.13,
    activityUnit: 'kWh/day',
    factor: 0.713,
    factorUnit: 'kgCO2e/kWh',
    dailyKgCO2e: 5.8,
    gasType: 'CO2e',
    region: 'India National Grid (CEA)',
    isIndiaSpecific: true,
    source: 'Central Electricity Authority (CEA) of India, CO2 Baseline Database v19',
    sourceUrl: 'https://cea.nic.in',
    year: 2024,
    methodology: 'Location-based grid intensity applied to multi-ton air-conditioning / heavy appliance load',
    isFallback: false,
    notes: 'Assumes ~8.1 kWh daily consumption (sustained 1.5-ton AC cooling, water heaters, multiple appliances) @ 0.713 kg CO2e/kWh.',
  },

  // ==========================================
  // DIET & FOOD
  // ==========================================
  food_vegetarian: {
    id: 'food_vegetarian',
    category: 'food',
    activity: 'Vegetarian / Plant-Based Diet',
    assumedActivityValue: 1.0,
    activityUnit: 'day of meals',
    factor: 1.5,
    factorUnit: 'kgCO2e/day',
    dailyKgCO2e: 1.5,
    gasType: 'CO2e',
    region: 'India & Global Benchmark',
    isIndiaSpecific: true,
    source: 'Poore & Nemecek (Science 2018), Our World in Data & ICMR-NIN (National Institute of Nutrition India)',
    sourceUrl: 'https://ourworldindata.org/environmental-impacts-of-food',
    year: 2023,
    methodology: 'Supply chain lifecycle analysis (farm gate, processing, packaging, transport, retail)',
    isFallback: false,
    notes: 'Traditional lacto-vegetarian baseline with grains, lentils/dal, seasonal vegetables, and dairy.',
  },

  food_mixed: {
    id: 'food_mixed',
    category: 'food',
    activity: 'Mixed / Flexitarian Diet',
    assumedActivityValue: 1.0,
    activityUnit: 'day of meals',
    factor: 3.2,
    factorUnit: 'kgCO2e/day',
    dailyKgCO2e: 3.2,
    gasType: 'CO2e',
    region: 'Global Benchmark',
    isIndiaSpecific: false,
    source: 'Poore & Nemecek (Science 2018), Our World in Data',
    sourceUrl: 'https://ourworldindata.org/environmental-impacts-of-food',
    year: 2023,
    methodology: 'Median LCA dietary emissions for mixed omnivore/flexitarian diets with moderate poultry/eggs/fish',
    isFallback: false,
    notes: 'Balanced omnivore diet with moderate meat/poultry/egg consumption combined with grains and produce.',
  },

  food_non_vegetarian: {
    id: 'food_non_vegetarian',
    category: 'food',
    activity: 'Meat-Forward Non-Vegetarian Diet',
    assumedActivityValue: 1.0,
    activityUnit: 'day of meals',
    factor: 5.0,
    factorUnit: 'kgCO2e/day',
    dailyKgCO2e: 5.0,
    gasType: 'CO2e',
    region: 'Global Benchmark',
    isIndiaSpecific: false,
    source: 'Poore & Nemecek (Science 2018), Scarborough et al. (Nature Food 2023)',
    sourceUrl: 'https://ourworldindata.org/carbon-footprint-food-methane',
    year: 2023,
    methodology: 'Full lifecycle accounting including ruminant enteric fermentation, feed crops, and processing',
    isFallback: false,
    notes: 'Diets featuring daily meat-forward meals (mutton, chicken, fish, beef), driving higher land-use and methane emissions.',
  },

  // ==========================================
  // SINGLE-USE PLASTIC & PACKAGING
  // ==========================================
  plastic_low: {
    id: 'plastic_low',
    category: 'plastic',
    activity: 'Low Packaging (Reusables / Zero Single-Use)',
    assumedActivityValue: 1.0,
    activityUnit: 'day of packaging',
    factor: 0.3,
    factorUnit: 'kgCO2e/day',
    dailyKgCO2e: 0.3,
    gasType: 'CO2e',
    region: 'Global Benchmark',
    isIndiaSpecific: false,
    source: 'PlasticsEurope Eco-Profiles & UNEP Single-Use Plastics LCA Meta-Analysis',
    sourceUrl: 'https://plasticseurope.org',
    year: 2023,
    methodology: 'Cradle-to-grave polymer resin production, converting, and end-of-life disposal',
    isFallback: false,
    notes: 'Active reusable bottles, cloth shopping bags, and minimal disposable takeaway packaging.',
  },

  plastic_medium: {
    id: 'plastic_medium',
    category: 'plastic',
    activity: 'Medium Packaging (Standard Household Items)',
    assumedActivityValue: 1.0,
    activityUnit: 'day of packaging',
    factor: 0.9,
    factorUnit: 'kgCO2e/day',
    dailyKgCO2e: 0.9,
    gasType: 'CO2e',
    region: 'Global Benchmark',
    isIndiaSpecific: false,
    source: 'PlasticsEurope & Franklin Associates Lifecycle Inventory',
    sourceUrl: 'https://plasticseurope.org',
    year: 2023,
    methodology: 'Standard household plastic consumption (polyethylene food packaging, PET containers)',
    isFallback: false,
    notes: 'Typical daily grocery packaging, 1-2 single-use plastic wrappers or containers.',
  },

  plastic_high: {
    id: 'plastic_high',
    category: 'plastic',
    activity: 'High Single-Use Plastic (Heavy Takeaway / Bottles)',
    assumedActivityValue: 1.0,
    activityUnit: 'day of packaging',
    factor: 1.8,
    factorUnit: 'kgCO2e/day',
    dailyKgCO2e: 1.8,
    gasType: 'CO2e',
    region: 'Global Benchmark',
    isIndiaSpecific: false,
    source: 'UNEP Single-Use Plastics and Their Alternatives LCA & Circular Economy Reports',
    sourceUrl: 'https://www.unep.org/resources/publication/single-use-plastic-bottles-and-their-alternatives-life-cycle-assessments',
    year: 2023,
    methodology: 'High disposable volume of PET bottles, takeaway containers, and polybags',
    isFallback: false,
    notes: 'Multiple single-use plastic bottles, disposable food delivery packaging, and plastic carry bags daily.',
  },
}

/**
 * Lookup helper to retrieve full factor metadata by key
 */
export function getEmissionFactor(category, optionId) {
  const compositeKey = `${category}_${optionId}`
  return EMISSION_FACTOR_REGISTRY[compositeKey] || null
}

/**
 * Returns all emission factors as a list with metadata
 */
export function getAllEmissionFactors() {
  return Object.values(EMISSION_FACTOR_REGISTRY)
}
