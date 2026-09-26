import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Challenges from './pages/Challenges'
import About from './pages/About'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/about" element={<About />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
