import React from 'react'
import GlassCard from './GlassCard'
import { IconLeaf, IconSparkles } from './Icons'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
    this.handleReload = this.handleReload.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CarbonWise ErrorBoundary caught]:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReload() {
    window.location.reload()
  }

  handleReset() {
    try {
      window.localStorage.removeItem('carbonwise_today')
      window.sessionStorage.clear()
    } catch {
      // Ignore
    }
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV

      return (
        <div className="min-h-screen bg-carbon-950 text-bark-100 flex items-center justify-center p-4">
          <GlassCard className="max-w-xl w-full p-7 text-center shadow-glow-moss border-moss-500/25">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-moss-500/15 text-moss-400 ring-1 ring-moss-500/30">
              <IconLeaf className="w-6 h-6" />
            </span>
            <h1 className="mt-4 font-display text-xl font-semibold text-bark-200">
              Something went wrong
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-bark-400">
              CarbonWise encountered an unexpected issue. Your saved data is secure in your browser.
            </p>

            {isDev && this.state.error && (
              <div className="mt-4 text-left p-3.5 rounded-xl border border-signal-bad/30 bg-signal-bad/10 text-xs font-mono text-signal-bad max-h-48 overflow-auto">
                <p className="font-bold">{this.state.error.toString()}</p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mt-2 text-[10px] text-bark-300 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-primary w-full sm:w-auto text-xs py-2.5 px-5 shadow-glow-moss"
              >
                <IconSparkles className="w-3.5 h-3.5" />
                Refresh Application
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="btn-secondary w-full sm:w-auto text-xs py-2.5 px-4"
              >
                Return to Home
              </button>
            </div>
          </GlassCard>
        </div>
      )
    }

    return this.props.children
  }
}
