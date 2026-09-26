import fs from 'fs'

const envContent = fs.readFileSync('.env', 'utf8')
const match = envContent.match(/GEMINI_API_KEY=([^\r\n]+)/)
const key = match ? match[1].trim() : ''

async function testGenerate(apiVersion, model) {
  try {
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${key}`
    console.log(`\nTesting generateContent: ${apiVersion} / ${model}`)
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: 'You are an eco coach. Respond strictly in JSON.' }],
        },
        contents: [{ role: 'user', parts: [{ text: 'Say "hello" with a summary, suggestions, challenge, and encouragement.' }] }],
        generationConfig: { response_mime_type: 'application/json' },
      }),
    })
    console.log(`Status: ${res.status}`)
    const data = await res.json()
    if (res.ok) {
      console.log('SUCCESS! Output text:')
      console.log(data?.candidates?.[0]?.content?.parts?.[0]?.text)
    } else {
      console.log('Error Result:', JSON.stringify(data, null, 2))
    }
  } catch (err) {
    console.error('Generate error:', err.message)
  }
}

await testGenerate('v1', 'gemini-3.8-flash')
await testGenerate('v1beta', 'gemini-3.8-flash')
await testGenerate('v1', 'gemini-flash-latest')
await testGenerate('v1beta', 'gemini-flash-latest')
await testGenerate('v1', 'gemini-3.7-flash')
await testGenerate('v1beta', 'gemini-3.5-flash')
