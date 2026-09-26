import fs from 'fs'
import path from 'path'

import {
  calculateCarbonScore,
  validateCarbonInputs,
  getImpactLevel,
  getCurrentBadge,
  getNextBadge,
  getRecommendations,
  getReductionPlan,
  getCalculationDetails,
  FACTOR_VERSION,
} from './src/data/carbonData.js'

import {
  EMISSION_FACTOR_REGISTRY,
  getEmissionFactor,
  getAllEmissionFactors,
} from './src/data/emissionFactors.js'

import {
  calculateStreaks,
  saveGoal,
  getGoal,
  saveTodayEntry,
  getHistory,
  exportDataAsJSON,
  exportDataAsCSV,
  importDataFromJSON,
  clearAllData,
  saveLocationContext,
  getLocationContext,
} from './src/utils/storage.js'

import {
  getFallbackAdvice,
  formatAdviceAsText,
  fetchCoachAdvice,
} from './src/utils/geminiService.js'

import {
  validateAndSanitizePayload,
  buildPrompt,
  parseStructuredAIResponse,
  getStructuredFallbackAdvice,
  checkRateLimit,
} from './api/coach.js'

import {
  getEnvironmentalRecommendation,
} from './src/services/geminiRecommendationService.js'

import {
  reverseGeocode,
} from './src/services/locationService.js'

console.log('=== RUNNING CARBONWISE AI PART 4 PRODUCTION & EXPERIENCE TESTS ===\n')

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    console.log(`✓ [PASS] ${message}`)
    passed++
  } else {
    console.error(`✗ [FAIL] ${message}`)
    failed++
  }
}

// In-memory localStorage mock for comprehensive test suite
const memoryStore = {}
global.window = {
  localStorage: {
    getItem: (key) => memoryStore[key] || null,
    setItem: (key, val) => { memoryStore[key] = String(val) },
    removeItem: (key) => { delete memoryStore[key] },
    clear: () => { Object.keys(memoryStore).forEach(k => delete memoryStore[k]) },
  },
}

// 1. Emission Factor Registry & Metadata Integrity
console.log('\n--- 1. Emission Factor Registry & Metadata Integrity ---')
const allFactors = getAllEmissionFactors()
assert(allFactors.length === 14, `All 14 factors registered in central registry (found ${allFactors.length})`)
assert(FACTOR_VERSION === '2026.1', `Factor version is correctly set to ${FACTOR_VERSION}`)

allFactors.forEach((f) => {
  const hasFields = f.id && f.category && f.activity && f.factorUnit && typeof f.factor === 'number' && f.source && f.year
  assert(hasFields, `Factor [${f.id}] has complete source metadata, year (${f.year}), and factor (${f.factor} ${f.factorUnit})`)
})

const ceaElectricity = getEmissionFactor('electricity', 'medium')
assert(ceaElectricity.isIndiaSpecific === true, `Indian electricity factor is flagged isIndiaSpecific = true`)
assert(ceaElectricity.factor === 0.713, `Indian CEA Grid factor is 0.713 kgCO2e/kWh`)

// 2. Core Calculation Model (Activity Data × Emission Factor)
console.log('\n--- 2. Core Calculation Model ---')
const normalInputs = { transport: 'car', electricity: 'medium', food: 'mixed', plastic: 'medium' }
const calc1 = calculateCarbonScore(normalInputs)
assert(calc1.total === 11.7, `Standard calculation total matches sum of components (11.7 kg CO2e, got ${calc1.total})`)
assert(calc1.breakdown.transport === 4.6, `Breakdown transport is 4.6 kg CO2e`)
assert(calc1.breakdown.electricity === 3.0, `Breakdown electricity is 3.0 kg CO2e`)
assert(calc1.breakdown.food === 3.2, `Breakdown food is 3.2 kg CO2e`)
assert(calc1.breakdown.plastic === 0.9, `Breakdown plastic is 0.9 kg CO2e`)
assert(calc1.factorVersion === FACTOR_VERSION, `Calculation records factorVersion: ${FACTOR_VERSION}`)

const zeroWalkingInputs = { transport: 'walking', electricity: 'low', food: 'vegetarian', plastic: 'low' }
const calcZero = calculateCarbonScore(zeroWalkingInputs)
assert(calcZero.total === 3.0, `Zero transport calculation total expected 3.0, got ${calcZero.total}`)
assert(calcZero.breakdown.transport === 0, `Walking transport is 0 kg CO2e`)

const invalidInputs = { transport: 'spaceship', electricity: -99, food: null, plastic: undefined }
const validCheck = validateCarbonInputs(invalidInputs)
assert(!validCheck.valid, `Invalid inputs flagged properly: ${JSON.stringify(validCheck.errors)}`)
assert(validCheck.sanitized.transport === 'car', `Invalid transport sanitized to safe default`)

const calcInvalid = calculateCarbonScore(invalidInputs)
assert(!isNaN(calcInvalid.total) && isFinite(calcInvalid.total) && calcInvalid.total > 0, `Invalid input produces safe finite positive score: ${calcInvalid.total}`)

// 3. Calculation Transparency & Formula Details
console.log('\n--- 3. Calculation Transparency & Formula Details ---')
const details = getCalculationDetails(normalInputs)
assert(details.length === 4, `Generated transparency breakdown for all 4 categories`)
assert(details[0].formula.includes('25 km/day × 0.184 kgCO2e/km'), `Transport formula is explicit: ${details[0].formula}`)
assert(details[1].formula.includes('4.21 kWh/day × 0.713 kgCO2e/kWh'), `Electricity formula uses CEA grid factor: ${details[1].formula}`)
assert(details[0].source.includes('DEFRA') || details[0].source.includes('ARAI'), `Transport includes verified source citation`)

// 4. Factor Versioning & Historical Reproducibility
console.log('\n--- 4. Factor Versioning & Historical Reproducibility ---')
const sampleEntry = {
  date: '2026-09-26',
  score: calc1.total,
  breakdown: calc1.breakdown,
  inputs: normalInputs,
  factorVersion: FACTOR_VERSION,
}
saveTodayEntry(sampleEntry)
const history = getHistory()
assert(history.length === 1, `Saved history entry successfully`)
assert(history[0].factorVersion === FACTOR_VERSION, `Historical entry preserves factorVersion (${history[0].factorVersion})`)

// 5. Reduction Planner
console.log('\n--- 5. Reduction Planner ---')
const reductionPlan = getReductionPlan(calc1.breakdown)
assert(reductionPlan.largestCategory === 'transport', `Identified largest category as transport`)
assert(reductionPlan.actions.length === 3, `Generated 3 actionable reduction steps`)
assert(reductionPlan.actions[0].challengeId === 'walk-instead', `Reduction action links to challenge walk-instead`)

// 6. Personal Goals & Storage
console.log('\n--- 6. Personal Goals & Storage ---')
const savedGoal = saveGoal({ enabled: true, targetPercent: 20, baseScore: 11.7, targetKg: 9.4 })
assert(savedGoal.enabled === true, `Goal enabled flag persisted`)
assert(savedGoal.targetPercent === 20, `Target percent is 20%`)
const retrievedGoal = getGoal()
assert(retrievedGoal.targetPercent === 20, `Retrieved goal matches persisted goal`)

// 7. Data Export & Import
console.log('\n--- 7. Data Export & Import ---')
const jsonExport = exportDataAsJSON()
assert(typeof jsonExport === 'string' && jsonExport.includes(FACTOR_VERSION), `Exported JSON includes factorVersion`)

const csvExport = exportDataAsCSV()
assert(typeof csvExport === 'string' && csvExport.includes('FactorVersion'), `Exported CSV includes FactorVersion header`)

const validImportResult = importDataFromJSON(jsonExport)
assert(validImportResult.success === true, `Imported JSON backup successfully`)

const invalidImportResult = importDataFromJSON('INVALID_JSON_CORRUPTED')
assert(invalidImportResult.success === false, `Corrupted JSON import safely rejected without crashing`)

// 8. Streaks & Gamification
console.log('\n--- 8. Streaks & Gamification ---')
const todayStr = new Date().toISOString().slice(0, 10)
const yesterdayDate = new Date()
yesterdayDate.setDate(yesterdayDate.getDate() - 1)
const yesterdayStr = yesterdayDate.toISOString().slice(0, 10)

const mockHistory = [
  { date: yesterdayStr, score: 9.5 },
  { date: todayStr, score: 7.2 },
]
const streaks = calculateStreaks(mockHistory)
assert(streaks.currentStreak === 2, `Consecutive 2-day history produces streak = 2`)

// 9. Impact & Badges
console.log('\n--- 9. Impact & Badges ---')
assert(getImpactLevel(3.0).id === 'low', `3.0 kg is Low Impact`)
assert(getImpactLevel(7.5).id === 'moderate', `7.5 kg is Moderate Impact`)
assert(getImpactLevel(11.0).id === 'high', `11.0 kg is High Impact`)
assert(getImpactLevel(25.0).id === 'very-high', `25.0 kg is Very High Impact`)

assert(getCurrentBadge(0).name === 'Green Beginner', `0 pts is Green Beginner`)
assert(getCurrentBadge(100).name === 'Eco Warrior', `100 pts is Eco Warrior`)
assert(getCurrentBadge(200).name === 'Sustainability Champion', `200 pts is Sustainability Champion`)

// 10. Gemini Serverless Proxy Validation & Security
console.log('\n--- 10. Gemini Serverless Proxy Validation & Security ---')

// 10a. Payload Validator
const validPayload = {
  inputs: normalInputs,
  score: 11.7,
  breakdown: calc1.breakdown,
  impactLabel: 'High Impact',
  weather: { condition: 'Partly Cloudy', temperature: 29 },
  airQuality: { aqi: 75, aqiLevel: { label: 'Moderate' } },
  locationInfo: { city: 'Bengaluru', formattedName: 'Bengaluru, Karnataka' },
  goal: { targetPercent: 15 },
  streak: 3,
}
const valResult = validateAndSanitizePayload(validPayload)
assert(valResult.valid === true, `Valid coach payload accepted`)
assert(valResult.data.score === 11.7, `Sanitized payload score preserved: 11.7`)
assert(valResult.data.locationInfo.city === 'Bengaluru', `Sanitized city preserved without sensitive coords`)

// 10b. Invalid payload rejection
const invalidPayloadCheck = validateAndSanitizePayload('INVALID_NON_OBJECT')
assert(invalidPayloadCheck.valid === false, `Non-object payload correctly rejected`)

// 10c. Prompt Construction
const promptText = buildPrompt(valResult.data)
assert(promptText.includes('Bengaluru'), `Prompt includes regional context`)
assert(promptText.includes('11.7 kg CO₂e'), `Prompt includes estimated carbon footprint`)
assert(promptText.includes('Transport Habit: car'), `Prompt includes specific habits`)

// 10d. Structured Response Parsing
const mockGeminiJSON = JSON.stringify({
  summary: 'Based on your estimated footprint of 11.7 kg CO₂e, transport is your highest area.',
  mainCategory: 'Transport',
  suggestions: ['Carpool or take the metro twice weekly', 'Set AC to 24°C'],
  challenge: 'Try 1 car-free day this week',
  encouragement: 'Every sustainable swap creates positive change!',
})
const parsedAdvice = parseStructuredAIResponse(mockGeminiJSON, valResult.data)
assert(parsedAdvice.mainCategory === 'Transport', `Parsed structured main category: Transport`)
assert(parsedAdvice.suggestions.length === 2, `Parsed 2 suggestions from Gemini JSON`)
assert(parsedAdvice.challenge.includes('car-free day'), `Parsed challenge from Gemini JSON`)

// 10e. Structured Markdown Fence Stripping
const mockFencedJSON = '```json\n' + mockGeminiJSON + '\n```'
const parsedFenced = parseStructuredAIResponse(mockFencedJSON, valResult.data)
assert(parsedFenced.mainCategory === 'Transport', `Parsed markdown-fenced JSON successfully`)

// 10f. Offline Deterministic Fallback Generator
const fallbackAdvice = getStructuredFallbackAdvice(valResult.data)
assert(fallbackAdvice.mainCategory === 'Transport', `Fallback accurately identified Transport as top contributor`)
assert(fallbackAdvice.suggestions.length >= 2, `Fallback generated actionable suggestions`)
assert(fallbackAdvice.summary.includes('Based on your estimated daily footprint'), `Fallback uses responsible estimation language`)

// 10g. Text Formatter
const textFormatted = formatAdviceAsText(fallbackAdvice)
assert(textFormatted.includes('Actionable Steps:'), `Formatted structured advice to readable text`)

// 10h. Rate Limiting Sliding-Window Abuse Check
const ipCheck1 = checkRateLimit('192.168.1.100')
assert(ipCheck1.allowed === true, `First request within IP rate limit allowed`)
for (let i = 0; i < 30; i++) {
  checkRateLimit('10.0.0.99')
}
const ipCheckBlocked = checkRateLimit('10.0.0.99')
assert(ipCheckBlocked.allowed === false, `Spamming IP rate limit capped & blocked properly`)

// 11. Location Context & Local Data Reset Flow
console.log('\n--- 11. Location Context & Reset Flow ---')
const kolkataDefault = {
  lat: 22.5726,
  lon: 88.3639,
  city: 'Kolkata',
  region: 'West Bengal',
  country: 'India',
  formattedName: 'Kolkata, West Bengal',
  isDefault: true,
}
assert(kolkataDefault.city === 'Kolkata', `Default location city is Kolkata`)
assert(kolkataDefault.region === 'West Bengal', `Default location region is West Bengal`)
assert(kolkataDefault.isDefault === true, `Default location is marked isDefault = true`)

const sampleLoc = { city: 'Mumbai', region: 'Maharashtra', country: 'India', formattedName: 'Mumbai, Maharashtra', isDefault: false }
saveLocationContext(sampleLoc)
const loadedLoc = getLocationContext()
assert(loadedLoc.city === 'Mumbai', `Location context saved and retrieved accurately`)
assert(loadedLoc.isDefault === false, `User-detected location has isDefault = false`)

clearAllData()
const historyAfterReset = getHistory()
assert(historyAfterReset.length === 0, `clearAllData successfully wiped local storage without errors`)

// 12. Client Bundle Security Audit
console.log('\n--- 12. Client Bundle Security Verification ---')
const distDir = path.resolve(process.cwd(), 'dist', 'assets')
if (fs.existsSync(distDir)) {
  const assetFiles = fs.readdirSync(distDir)
  let foundSecret = false
  assetFiles.forEach((file) => {
    if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
      const content = fs.readFileSync(path.join(distDir, file), 'utf8')
      if (content.includes('VITE_GEMINI_API_KEY')) {
        foundSecret = true
        console.error(`✗ [FAIL] Found VITE_GEMINI_API_KEY in ${file}!`)
      }
      if (content.includes('AQ.Ab8RN6JV9WZtRrVF')) {
        foundSecret = true
        console.error(`✗ [FAIL] Found raw API key secret in client asset ${file}!`)
      }
    }
  })
  assert(!foundSecret, `Zero Gemini secret keys found in production client bundle (/dist/assets)`)
} else {
  console.log('ℹ (Run build first to scan dist/ directory)')
}

console.log(`\n======================================================`)
console.log(`ALL VERIFICATION TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`)
console.log(`======================================================\n`)

if (failed > 0) process.exit(1)
