import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
<<<<<<< HEAD
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
=======
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
<<<<<<< HEAD
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
=======
    <BrowserRouter>
      <App />
    </BrowserRouter>
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
  </React.StrictMode>
)
