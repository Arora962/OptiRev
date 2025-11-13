import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import SearchPage from './pages/SearchPage'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'

const App: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a3c4f3, #f3e5f5)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
