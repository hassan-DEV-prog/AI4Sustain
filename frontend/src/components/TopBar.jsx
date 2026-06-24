export default function TopBar() {
  return (
    <div style={{
      pointerEvents: 'all',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 24px',
      background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(100,255,100,0.15)'
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: 'linear-gradient(135deg,#1a7a1a,#4caf50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 700, color: '#fff'
      }}>A</div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#81c784', letterSpacing: 1 }}>
          AI4Sustain
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
          AI expansion · resource impact · sustainability forecasting
        </div>
      </div>
      <div style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
        Click any country on the map
      </div>
    </div>
  )
}