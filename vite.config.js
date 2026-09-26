<<<<<<< HEAD
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import coachHandler from './api/coach.js'

function devApiServerPlugin() {
  return {
    name: 'dev-api-server',
    configResolved(config) {
      const loaded = loadEnv(config.mode, process.cwd(), '')
      if (loaded.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
        process.env.GEMINI_API_KEY = loaded.GEMINI_API_KEY
      }
      if (loaded.GEMINI_MODEL && !process.env.GEMINI_MODEL) {
        process.env.GEMINI_MODEL = loaded.GEMINI_MODEL
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/coach') {
          let bodyStr = ''
          req.on('data', (chunk) => {
            bodyStr += chunk
          })
          req.on('end', async () => {
            // Emulate standard serverless req/res helpers for dev parity
            const wrappedReq = {
              method: req.method,
              headers: req.headers,
              body: bodyStr,
            }

            const wrappedRes = {
              setHeader(key, val) {
                res.setHeader(key, val)
              },
              status(statusCode) {
                res.statusCode = statusCode
                return {
                  json(payload) {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify(payload))
                  },
                  end(data) {
                    res.end(data)
                  },
                }
              },
            }

            try {
              await coachHandler(wrappedReq, wrappedRes)
            } catch (err) {
              if (!res.writableEnded) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Internal Dev Server Error', message: err.message }))
              }
            }
          })
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), devApiServerPlugin()],
=======
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
<<<<<<< HEAD
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
        },
      },
    },
=======
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
  },
})
