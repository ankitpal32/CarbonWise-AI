import fs from 'fs'

const envContent = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : ''
const match = envContent.match(/GEMINI_API_KEY=([^\r\n]+)/)
const key = match ? match[1].trim() : ''

if (!key) {
  console.log('No GEMINI_API_KEY in .env')
  process.exit(0)
}

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
if (!res.ok) {
  console.error('List models failed:', res.status, await res.text())
  process.exit(1)
}

const data = await res.json()
console.log('Total models:', data.models?.length)
const generateModels = data.models?.filter(m => m.supportedGenerationMethods?.includes('generateContent'))
console.log('Models supporting generateContent:')
generateModels?.forEach(m => console.log(`- ${m.name} (${m.displayName}) [methods: ${m.supportedGenerationMethods.join(', ')}]`))
