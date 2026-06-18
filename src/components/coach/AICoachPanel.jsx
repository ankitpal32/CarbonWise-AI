import { useState, useEffect, useRef } from 'react'
import GlassCard from '../common/GlassCard'
import { IconRobot, IconSparkles, IconClose } from '../common/Icons'
import { getAICoachAdvice, getFallbackAdvice, validateGeminiKey } from '../../utils/geminiService'
import { getGeminiKey, saveGeminiKey, removeGeminiKey } from '../../utils/storage'
import { getImpactLevel } from '../../data/carbonData'

export default function AICoachPanel({ open, onClose, entry }) {
  const savedGeminiKey = getGeminiKey()
  const [apiKey, setApiKey] = useState(savedGeminiKey || '')
  const [showKeyInput, setShowKeyInput] = useState(!savedGeminiKey)
  const [connected, setConnected] = useState(Boolean(savedGeminiKey))
  const [loading, setLoading] = useState(false)
  const [advice, setAdvice] = useState('')
  const [error, setError] = useState('')
  const [usedFallback, setUsedFallback] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const dialogRef = useRef(null)

  useEffect(() => {
    if (open) {
      setAdvice('')
      setError('')
      setUsedFallback(false)
      dialogRef.current?.focus()
    }
  }, [open])

  if (!open || !entry) return null

  const impactLabel = getImpactLevel(entry.score).label

  const handleSaveKey = async () => {
    setStatusMessage('')
    setError('')
    const trimmed = apiKey.trim()
    if (!trimmed) {
      setError('Please enter a valid API key.')
      return
    }
    setLoading(true)
    try {
      const ok = await validateGeminiKey(trimmed)
      if (!ok) throw new Error('Key validation failed')
      saveGeminiKey(trimmed)
      setShowKeyInput(false)
      setConnected(true)
      setStatusMessage('Gemini AI Connected')
    } catch (err) {
      setError(err.message || 'Failed to validate API key')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveKey = () => {
    removeGeminiKey()
    setApiKey('')
    setShowKeyInput(true)
    setConnected(false)
    setStatusMessage('')
  }

  const handleGetAdvice = async () => {
    setLoading(true)
    setError('')
    setUsedFallback(false)
    try {
      const keyToUse = getGeminiKey() || (connected ? apiKey : '')
      const text = await getAICoachAdvice({
        apiKey: keyToUse,
        inputs: entry.inputs,
        score: entry.score,
        breakdown: entry.breakdown,
        impactLabel,
      })
      setAdvice(text)
    } catch (err) {
      // Always fall back so the feature still demos without a live key/network
      setUsedFallback(true)
      setAdvice(getFallbackAdvice({ inputs: entry.inputs, impactLabel }))
      if (err.message !== 'NO_API_KEY') {
        setError('Could not reach Gemini — showing offline coaching instead.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-carbon-950/70 p-4 backdrop-blur-sm animate-rise"
      onClick={onClose}
    >
      <GlassCard
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="AI Sustainability Coach"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg p-6 sm:p-7"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lichen-500/15 text-lichen-400 ring-1 ring-lichen-500/25">
              <IconRobot className="w-5 h-5" />
            </span>
            <div>
              <p className="section-eyebrow">AI Sustainability Coach</p>
              <h3 className="font-display text-lg font-semibold text-bark-200">Get personalized advice</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-bark-400 hover:text-bark-200" aria-label="Close">
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        {showKeyInput && (
          <div className="mt-5 rounded-lg border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="text-sm text-bark-300">
              Add a Gemini API key to get live AI coaching. Without one, you'll still get smart
              offline suggestions generated from your inputs.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Gemini API key"
                className="flex-1 rounded-lg border border-white/10 bg-carbon-900 px-3 py-2 text-sm text-bark-200 placeholder:text-bark-400/60 focus:border-moss-500/50"
              />
              <button onClick={handleSaveKey} className="btn-secondary whitespace-nowrap">
                {loading ? 'Validating...' : 'Save key'}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-bark-400 underline-offset-2 hover:text-bark-300 hover:underline"
              >
                Get Free API Key
              </a>
              <button
                onClick={() => setShowKeyInput(false)}
                className="text-xs font-medium text-bark-400 underline-offset-2 hover:text-bark-300 hover:underline"
              >
                Skip — use offline coaching
              </button>
            </div>
            {error && <p className="mt-3 text-xs text-signal-bad">{error}</p>}
            {statusMessage && <p className="mt-3 text-xs text-moss-400">{statusMessage}</p>}
          </div>
        )}

        {!showKeyInput && (
          <>
            {connected ? (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-moss-400">Gemini AI Connected</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowKeyInput(true)}
                    className="text-xs font-medium text-bark-400 underline-offset-2 hover:text-bark-300 hover:underline"
                  >
                    Update API key
                  </button>
                  <button onClick={handleRemoveKey} className="text-xs font-medium text-signal-bad">
                    Remove API Key
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowKeyInput(true)}
                className="mt-4 text-xs font-medium text-bark-400 underline-offset-2 hover:text-bark-300 hover:underline"
              >
                Add a Gemini API key for live advice
              </button>
            )}
          </>
        )}

        <div className="mt-5">
          {!advice && !loading && (
            <button onClick={handleGetAdvice} className="btn-primary w-full">
              <IconSparkles className="w-4 h-4" />
              Get AI Advice
            </button>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] py-8 text-sm text-bark-400">
              <span className="h-2 w-2 animate-pulse-ring rounded-full bg-moss-400" />
              Thinking through your day...
            </div>
          )}

          {advice && !loading && (
            <div className="rounded-lg border border-moss-500/20 bg-moss-500/[0.06] p-4">
              <p className="whitespace-pre-line text-sm leading-relaxed text-bark-200">{advice}</p>
              {usedFallback && (
                <p className="mt-3 text-[11px] text-bark-400">
                  Offline suggestion — add a Gemini API key above for live AI-generated coaching.
                </p>
              )}
              <button onClick={handleGetAdvice} className="btn-secondary mt-4 w-full text-xs">
                Regenerate advice
              </button>
            </div>
          )}

          {error && <p className="mt-3 text-xs text-signal-bad">{error}</p>}
        </div>
      </GlassCard>
    </div>
  )
}
