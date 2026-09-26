import { useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import GlassCard from '../components/common/GlassCard'
import { IconClose, IconCheck, IconTarget, IconSparkles, IconRobot, IconShieldCheck } from '../components/common/Icons'
import { useCarbonData } from '../hooks/useCarbonData'
import { useEnvData } from '../hooks/useEnvData'

export default function Settings() {
  const { history, points, goal, exportJSON, exportCSV, importJSON, resetData } = useCarbonData()
  const { locationInfo, locationStatus, requestLocation, weather, airQuality } = useEnvData({ autoRequest: false })

  const [importStatus, setImportStatus] = useState(null)
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const [locUpdating, setLocUpdating] = useState(false)

  const handleUpdateLocation = async () => {
    setLocUpdating(true)
    await requestLocation()
    setLocUpdating(false)
  }

  const handleDownloadJSON = () => {
    const jsonStr = exportJSON()
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `carbonwise-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadCSV = () => {
    const csvStr = exportCSV()
    const blob = new Blob([csvStr], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `carbonwise-history-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e) => {
    setImportStatus(null)
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        const result = importJSON(content)
        if (result.success) {
          setImportStatus({ type: 'success', message: 'Data successfully restored from backup file!' })
        } else {
          setImportStatus({ type: 'error', message: result.error || 'Failed to import backup data.' })
        }
      }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    resetData()
    setShowConfirmReset(false)
    setResetDone(true)
    setTimeout(() => setResetDone(false), 4000)
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8">
          <p className="section-eyebrow">Preferences & Data</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-bark-200 sm:text-4xl">
            Settings & Data Management
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-bark-400">
            Export your data, restore from a backup, manage location context, and review local privacy settings.
          </p>
        </header>

        <div className="space-y-6">
          {/* Location Context Settings */}
          <GlassCard className="p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-bark-200">
                  Location & Environmental Context
                </h2>
                <p className="mt-1 text-xs text-bark-400 leading-relaxed">
                  Used solely to retrieve local weather conditions, air quality index, and regional carbon benchmarks.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-bark-300">
                  <span>📍 Active context:</span>
                  <span className="font-semibold text-moss-300">
                    {locationInfo?.formattedName || 'Default Regional Baseline'}
                  </span>
                  {weather && (
                    <span className="text-bark-400">({weather.temperature?.toFixed(0)}°C, {weather.condition})</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpdateLocation}
                disabled={locUpdating}
                className="btn-secondary text-xs py-2 px-4 shrink-0"
              >
                {locUpdating ? 'Updating...' : 'Update Location'}
              </button>
            </div>
          </GlassCard>

          {/* AI Coach Status */}
          <GlassCard className="p-6 sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <IconRobot className="w-5 h-5 text-moss-400" />
                  <h2 className="font-display text-lg font-semibold text-bark-200">
                    AI Coach Status
                  </h2>
                </div>
                <p className="mt-1 text-xs text-bark-400 leading-relaxed">
                  Powered by a secure serverless proxy (/api/coach) with automatic offline rule engine fallback.
                </p>
              </div>
              <span className="chip text-[10px] text-moss-400 border-moss-500/30 bg-moss-500/10">
                Serverless Active
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-bark-300 space-y-1.5">
              <p>• <b>Privacy:</b> Zero API keys or sensitive credentials exist in client-side code.</p>
              <p>• <b>Abuse Protection:</b> Rate-limited sliding window protects server inference capacity.</p>
              <p>• <b>Resilience:</b> If offline or unavailable, the deterministic smart action plan steps in seamlessly.</p>
            </div>
          </GlassCard>

          {/* Data Export & Backup */}
          <GlassCard className="p-6 sm:p-7">
            <h2 className="font-display text-lg font-semibold text-bark-200">
              Export & Backup My Data
            </h2>
            <p className="mt-1 text-xs text-bark-400 leading-relaxed">
              Since CarbonWise AI does not use user accounts or cloud databases, your data belongs 100% to you. Download a copy of your carbon logs, streaks, and challenge points anytime.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownloadJSON}
                className="btn-primary text-xs py-2.5 px-4"
              >
                Download JSON Backup
              </button>
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="btn-secondary text-xs py-2.5 px-4"
              >
                Download CSV Spreadsheet
              </button>
            </div>

            <div className="mt-4 text-[11px] text-bark-400">
              Current local storage contains: <b>{history.length} logged days</b> · <b>{points} points</b>
            </div>
          </GlassCard>

          {/* Data Import */}
          <GlassCard className="p-6 sm:p-7">
            <h2 className="font-display text-lg font-semibold text-bark-200">
              Import & Restore Data
            </h2>
            <p className="mt-1 text-xs text-bark-400 leading-relaxed">
              Restore your history, completed challenges, and goals from a previously exported CarbonWise JSON backup file.
            </p>

            <div className="mt-5">
              <label
                htmlFor="import-file"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-bark-200 cursor-pointer hover:bg-white/[0.07] transition-all"
              >
                Choose Backup JSON File
              </label>
              <input
                id="import-file"
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {importStatus && (
              <div
                className={`mt-4 rounded-xl p-3 text-xs ${
                  importStatus.type === 'success'
                    ? 'border border-moss-500/30 bg-moss-500/10 text-moss-300'
                    : 'border border-signal-bad/30 bg-signal-bad/10 text-signal-bad'
                }`}
              >
                {importStatus.message}
              </div>
            )}
          </GlassCard>

          {/* Privacy Transparency Overview */}
          <GlassCard className="p-6 sm:p-7">
            <h2 className="font-display text-lg font-semibold text-bark-200">
              Privacy & Local Architecture
            </h2>
            <div className="mt-3 space-y-3 text-xs leading-relaxed text-bark-300">
              <div className="flex items-start gap-2.5">
                <span className="text-moss-400 mt-0.5 font-bold">✓</span>
                <p><b>No Accounts or Passwords:</b> You are never asked to register, log in, or provide an email address.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-moss-400 mt-0.5 font-bold">✓</span>
                <p><b>User-Controlled Location:</b> Browser geolocation is requested only with your explicit permission to fetch local weather and air quality. If denied, the entire app works seamlessly with default regional baselines.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-moss-400 mt-0.5 font-bold">✓</span>
                <p><b>Client-Side Storage:</b> Daily footprint calculations, goals, streak counters, and badge unlocks are saved exclusively in your browser's Local Storage.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-moss-400 mt-0.5 font-bold">✓</span>
                <p><b>Secure AI Coaching:</b> Coaching advice is processed through a secure serverless endpoint (`/api/coach`) without exposing secrets or retaining personal records.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-moss-400 mt-0.5 font-bold">✓</span>
                <p><b>External Services:</b> Weather and Air Quality queries communicate with public telemetry endpoints (Open-Meteo / OpenWeatherMap) solely to retrieve local atmospheric conditions.</p>
              </div>
            </div>
          </GlassCard>

          {/* Reset All Data */}
          <GlassCard className="p-6 sm:p-7 border-signal-bad/25 bg-signal-bad/[0.02]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-base font-semibold text-signal-bad">
                  Reset All Local Data
                </h2>
                <p className="mt-1 text-xs text-bark-400">
                  Permanently clear all logged days, streaks, goals, and badge points from this browser.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="rounded-full border border-signal-bad/40 bg-signal-bad/10 px-4 py-2 text-xs font-semibold text-signal-bad hover:bg-signal-bad/20 transition-colors"
              >
                Reset My Data
              </button>
            </div>

            {resetDone && (
              <p className="mt-3 text-xs text-moss-400 animate-rise">
                ✓ All local data has been successfully cleared.
              </p>
            )}
          </GlassCard>
        </div>

        {/* Reset Confirmation Modal */}
        {showConfirmReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon-950/80 p-4 backdrop-blur-sm animate-rise">
            <GlassCard className="w-full max-w-md p-6 shadow-glow-moss" role="dialog" aria-modal="true">
              <div className="flex items-start justify-between">
                <h3 className="font-display text-lg font-semibold text-bark-200">
                  Confirm Data Reset
                </h3>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="text-bark-400 hover:text-bark-200"
                  aria-label="Close modal"
                >
                  <IconClose className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-3 text-xs text-bark-300 leading-relaxed">
                This will wipe all historical carbon logs, challenge progress, streaks, and personal goals stored on this device. This cannot be undone unless you have a JSON backup.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full bg-signal-bad px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
                >
                  Yes, Wipe Everything
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
