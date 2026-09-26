import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Challenges from './pages/Challenges'
import About from './pages/About'
<<<<<<< HEAD
import Settings from './pages/Settings'
=======
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/about" element={<About />} />
<<<<<<< HEAD
      <Route path="/settings" element={<Settings />} />
=======
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
