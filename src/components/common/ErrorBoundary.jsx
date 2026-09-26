import React from 'react'
import GlassCard from './GlassCard'
import { IconLeaf, IconSparkles } from './Icons'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    this.handleReload = this.handleReload.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CarbonWise ErrorBoundary caught]:', error, errorInfo)
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
      return (
        <div className="min-h-screen bg-carbon-950 text-bark-100 flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full p-7 text-center shadow-glow-moss border-moss-500/25">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-moss-500/15 text-moss-400 ring-1 ring-moss-500/30">
              <IconLeaf className="w-6 h-6" />
            </span>
            <h1 className="mt-4 font-display text-xl font-semibold text-bark-200">
              Something went wrong
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-bark-400">
              CarbonWise encountered an unexpected issue. Your saved data is secure in your browser.
            </p>

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
