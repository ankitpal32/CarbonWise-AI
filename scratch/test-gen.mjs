import fs from 'fs'

const envContent = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : ''
const match = envContent.match(/GEMINI_API_KEY=([^\r\n]+)/)
const key = match ? match[1].trim() : ''

async function testModel(model) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
    const start = Date.now()
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Respond with a short 1-sentence eco tip.' }] }],
        generationConfig: { maxOutputTokens: 50 },
      }),
    })
    const dur = Date.now() - start
    const data = await res.json()
    if (res.ok) {
      console.log(`[PASS] ${model} (${dur}ms):`, data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim())
    } else {
      console.log(`[FAIL] ${model} status ${res.status}:`, data?.error?.message)
    }
  } catch (err) {
    console.log(`[ERR] ${model}:`, err.message)
  }
}

for (const m of ['gemini-2.5-flash', 'gemini-3.7-flash', 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite']) {
  await testModel(m)
}
