import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, Cell
} from 'recharts'

const RISK_COLOR = {
  'Low risk'      : '#4caf50',
  'Moderate risk' : '#ffa726',
  'High risk'     : '#ef6c00',
  'Critical risk' : '#c62828',
}

const glass = {
  background    : 'rgba(5,20,5,0.82)',
  backdropFilter: 'blur(20px)',
  borderLeft    : '1px solid rgba(100,255,100,0.15)',
  height        : '100%',
  padding       : '0 0 40px 0',
}

const section = {
  margin  : '0 20px 20px',
  padding : '16px',
  background: 'rgba(255,255,255,0.04)',
  borderRadius: 12,
  border  : '1px solid rgba(100,255,100,0.08)',
}

const label = { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }
const value = { fontSize: 22, fontWeight: 700, color: '#81c784' }

function MetricCard({ label: l, value: v, unit = '' }) {
  return (
    <div style={{
      flex: 1, background: 'rgba(255,255,255,0.05)',
      borderRadius: 10, padding: '12px',
      border: '1px solid rgba(100,255,100,0.1)', minWidth: 100
    }}>
      <div style={label}>{l}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#a5d6a7' }}>
        {v}<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginLeft: 2 }}>{unit}</span>
      </div>
    </div>
  )
}

function ScoreBadge({ score, risk }) {
  const color = RISK_COLOR[risk] || '#81c784'
  const pct   = Math.min(100, Math.max(0, score))
  return (
    <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
      <div style={{ position: 'relative', display: 'inline-block', width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10"/>
          <circle cx="60" cy="60" r="52" fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${(pct / 100) * 327} 327`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ fontSize: 28, fontWeight: 800, color }}>{score}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>/ 100</div>
        </div>
      </div>
      <div style={{
        marginTop: 8, display: 'inline-block',
        background: color + '22', border: `1px solid ${color}55`,
        borderRadius: 20, padding: '4px 14px',
        fontSize: 12, color, fontWeight: 600
      }}>{risk}</div>
    </div>
  )
}

export default function Dashboard({ data, loading, onClose }) {
  if (loading) return (
    <div style={{ ...glass, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ width: 40, height: 40, border: '3px solid rgba(100,255,100,0.2)',
          borderTop: '3px solid #4caf50', borderRadius: '50%' }}
      />
    </div>
  )

  if (!data || data.error) return (
    <div style={{ ...glass, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef9a9a' }}>
      {data?.error || 'No data available'}
    </div>
  )

  const radarData = [
    { subject: 'Energy risk',    A: data.radar.energy_risk },
    { subject: 'Water risk',     A: data.radar.water_risk },
    { subject: 'Carbon risk',    A: data.radar.carbon_risk },
    { subject: 'AI pressure',    A: data.radar.ai_pressure },
    { subject: 'Renewables',     A: data.radar.renewable_score },
  ]

  const socioData = [
    { name: 'AI jobs risk',       value: data.socio.ai_jobs_risk_pct },
    { name: 'Energy cost idx',    value: data.socio.energy_cost_index },
    { name: 'Inequality pressure',value: data.socio.inequality_pressure },
  ]

  const forecast = (data.forecast_curve || []).filter((_, i) => i % 2 === 0)

  return (
    <motion.div
      initial={{ x: 520 }} animate={{ x: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={glass}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(100,255,100,0.1)',
        position: 'sticky', top: 0, zIndex: 5,
        background: 'rgba(5,20,5,0.95)',
        backdropFilter: 'blur(20px)'
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#a5d6a7' }}>{data.country_name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{data.country_code} · Sustainability dashboard</div>
        </div>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, color: 'rgba(255,255,255,0.6)', padding: '6px 12px',
          cursor: 'pointer', fontSize: 13
        }}>✕ Close</button>
      </div>

      {/* Score ring */}
      <ScoreBadge score={data.sustainability_score} risk={data.risk_level} />

      {/* Overview */}
      <div style={{ ...section }}>
        <div style={{ ...label, marginBottom: 8 }}>Overview</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
          {data.overview}
        </div>
      </div>

      {/* Key metrics */}
      <div style={{ margin: '0 20px 20px' }}>
        <div style={{ ...label, marginBottom: 8 }}>Key metrics</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <MetricCard label="GDP per capita"      value={`$${(data.gdp_per_capita/1000).toFixed(1)}k`} />
          <MetricCard label="Renewable energy"    value={data.renewable_pct.toFixed(1)} unit="%" />
          <MetricCard label="AI expansion index"  value={(data.ai_expansion_index * 100).toFixed(0)} unit="/100" />
          <MetricCard label="Water stress"        value={data.water_stress_pct.toFixed(1)} unit="%" />
          <MetricCard label="Energy per capita"   value={data.energy_kwh_per_capita.toFixed(0)} unit="kWh" />
          <MetricCard label="Population"          value={data.population > 1e6 ? `${(data.population/1e6).toFixed(1)}M` : data.population.toLocaleString()} />
        </div>
      </div>

      {/* Forecast chart */}
      <div style={section}>
        <div style={{ ...label, marginBottom: 12 }}>Sustainability forecast 2024–2040</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={forecast}>
            <XAxis dataKey="year" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
            <YAxis domain={[0,100]} stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(100,255,100,0.2)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#81c784' }}
              itemStyle={{ color: '#a5d6a7' }}
            />
            <Line type="monotone" dataKey="predicted_score" stroke="#4caf50"
              strokeWidth={2.5} dot={{ fill: '#4caf50', r: 3 }}
              activeDot={{ r: 5, fill: '#69f0ae' }} name="Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Radar chart */}
      <div style={section}>
        <div style={{ ...label, marginBottom: 8 }}>Risk dimensions</div>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
            <Radar dataKey="A" stroke="#4caf50" fill="#4caf50" fillOpacity={0.25} strokeWidth={1.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Socio-economic bar chart */}
      <div style={section}>
        <div style={{ ...label, marginBottom: 12 }}>Socio-economic impact (0–100 index)</div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={socioData} layout="vertical">
            <XAxis type="number" domain={[0,100]} stroke="rgba(255,255,255,0.2)"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
            <YAxis type="category" dataKey="name" width={120}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,165,0,0.2)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#ffa726' }}
            />
            <Bar dataKey="value" radius={[0,4,4,0]}>
              {socioData.map((_, i) => (
                <Cell key={i} fill={['#ef6c00','#0288d1','#7b1fa2'][i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* GDP card */}
      <div style={{ ...section, display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={label}>GDP per capita</div>
          <div style={value}>${data.gdp_per_capita.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={label}>AI jobs at risk</div>
          <div style={{ ...value, color: '#ef9a9a' }}>{data.socio.ai_jobs_risk_pct}%</div>
        </div>
      </div>
    </motion.div>
  )
}