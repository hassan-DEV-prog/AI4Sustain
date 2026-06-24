export default function LandingStats({ global: g }) {
  const stats = [
    { label: 'Global avg score', value: `${g.global_avg_score}/100` },
    { label: 'Countries tracked', value: g.total_countries },
    { label: 'Moderate risk', value: g.risk_distribution['Moderate risk'] ?? 0 },
    { label: 'High / Critical risk', value: (g.risk_distribution['High risk'] ?? 0) + (g.risk_distribution['Critical risk'] ?? 0) },
  ]

  return (
    <div style={{
      pointerEvents: 'all',
      position: 'absolute', bottom: 32, left: 24,
      display: 'flex', gap: 12, flexWrap: 'wrap'
    }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(100,255,100,0.2)',
          borderRadius: 12, padding: '12px 18px', minWidth: 130
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#81c784' }}>{s.value}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
        </div>
      ))}

      <div style={{
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(100,255,100,0.2)',
        borderRadius: 12, padding: '12px 18px', minWidth: 200
      }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Most sustainable</div>
        {g.most_sustainable.slice(0,3).map(c => (
          <div key={c.country_code} style={{ fontSize: 12, color: '#a5d6a7', lineHeight: 1.8 }}>
            {c.country_name} — {c.predicted_score.toFixed(1)}
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,100,100,0.2)',
        borderRadius: 12, padding: '12px 18px', minWidth: 200
      }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Most at risk</div>
        {g.least_sustainable.slice(0,3).map(c => (
          <div key={c.country_code} style={{ fontSize: 12, color: '#ef9a9a', lineHeight: 1.8 }}>
            {c.country_name} — {c.predicted_score.toFixed(1)}
          </div>
        ))}
      </div>
    </div>
  )
}