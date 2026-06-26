import { useState, useEffect } from 'react'
import MapView from './components/MapView.jsx'
import Dashboard from './components/Dashboard.jsx'
import TopBar from './components/TopBar.jsx'
import LandingStats from './components/LandingStats.jsx'
import axios from 'axios'

//const API = 'http://localhost:8000'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: '#050f05',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'fadeOut 0.6s ease 2.2s forwards'
    }}>
      <style>{`
        @keyframes fadeOut { to { opacity: 0; pointer-events: none; } }
        @keyframes pulse  { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes rise   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{
        width: 80, height: 80, borderRadius: 20,
        background: 'linear-gradient(135deg,#1b5e20,#4caf50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 24,
        animation: 'rise 0.6s ease forwards'
      }}>A</div>

      <div style={{
        fontSize: 36, fontWeight: 800, color: '#81c784', letterSpacing: 2,
        animation: 'rise 0.6s ease 0.15s both'
      }}>AI4Sustain</div>

      <div style={{
        fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 10,
        animation: 'rise 0.6s ease 0.3s both'
      }}>
        AI expansion · resource impact · sustainability forecasting
      </div>

      <div style={{
        marginTop: 48, display: 'flex', gap: 8,
        animation: 'rise 0.6s ease 0.5s both'
      }}>
        {['Loading models','Fetching predictions','Rendering globe'].map((t, i) => (
          <div key={t} style={{
            fontSize: 11, color: 'rgba(100,255,100,0.5)',
            animation: `pulse 1s ease ${i * 0.3}s infinite`
          }}>{t}{i < 2 ? ' ·' : ''}</div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [splash, setSplash]           = useState(true)
  const [selected, setSelected]       = useState(null)
  const [countryData, setCountryData] = useState(null)
  const [globalData, setGlobalData]   = useState(null)
  const [loading, setLoading]         = useState(false)
  const [panelOpen, setPanelOpen]     = useState(false)

  useEffect(() => {
    axios.get(`${API}/global`).then(r => setGlobalData(r.data)).catch(() => {})
  }, [])

  const handleCountryClick = async (code) => {
    if (!code) return
    setLoading(true)
    setPanelOpen(true)
    setSelected(code)
    setCountryData(null)
    try {
      const r = await axios.get(`${API}/country/${code}`)
      setCountryData(r.data)
    } catch {
      setCountryData({ error: 'Could not load data for ' + code })
    }
    setLoading(false)
  }

  const handleClose = () => {
    setPanelOpen(false)
    setSelected(null)
    setCountryData(null)
  }

  return (
    <>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}

      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.35)'
        }} />

        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <MapView onCountryClick={handleCountryClick} selectedCode={selected} />
        </div>

        <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:5, pointerEvents:'none' }}>
          <div style={{ pointerEvents:'all' }}><TopBar /></div>
        </div>

        {!panelOpen && globalData && (
          <div style={{ position:'absolute', bottom:0, left:0, zIndex:5, pointerEvents:'none' }}>
            <div style={{ pointerEvents:'all' }}>
              <LandingStats global={globalData} />
            </div>
          </div>
        )}

        {panelOpen && (
          <div style={{
            position:'absolute', top:0, right:0, zIndex:10,
            width:'min(520px, 100vw)', height:'100vh',
            overflowY:'auto', pointerEvents:'all'
          }}>
            <Dashboard data={countryData} loading={loading} onClose={handleClose} />
          </div>
        )}
      </div>
    </>
  )
}