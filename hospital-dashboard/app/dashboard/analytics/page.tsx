'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Phone, Calendar, Users, CheckCircle,
  RefreshCw, ArrowUpRight
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const API = process.env.NEXT_PUBLIC_API_URL

type DataPoint = {
  day: string
  calls: number
  appointments: number
  patients: number
}

const fallbackWeekly: DataPoint[] = [
  { day: 'Mon', calls: 0, appointments: 0, patients: 0 },
  { day: 'Tue', calls: 0, appointments: 0, patients: 0 },
  { day: 'Wed', calls: 0, appointments: 0, patients: 0 },
  { day: 'Thu', calls: 0, appointments: 0, patients: 0 },
  { day: 'Fri', calls: 0, appointments: 0, patients: 0 },
  { day: 'Sat', calls: 0, appointments: 0, patients: 0 },
  { day: 'Sun', calls: 0, appointments: 0, patients: 0 },
]

const fallbackSpecialty = [
  { name: 'No Data Yet', value: 100, color: '#e2e8f0' },
]

const fallbackOutcome = [
  { name: 'No Data Yet', value: 100, color: '#e2e8f0' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        padding: '12px 16px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
        fontSize: '12px',
        fontWeight: 600
      }}>
        <p style={{
          color: '#6b7280',
          margin: '0 0 6px'
        }}>
          {label}
        </p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{
            color: p.color,
            margin: '2px 0',
            fontWeight: 700
          }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [realChartData, setRealChartData] = useState<DataPoint[]>([])
  const [realSpecialtyData, setRealSpecialtyData] = useState<any[]>([])
  const [realOutcomeData, setRealOutcomeData] = useState<any[]>([])
  const [hasRealData, setHasRealData] = useState(false)

  const fetchStats = async () => {
    try {
      const [statsRes, chartRes] = await Promise.all([
        axios.get(`${API}/api/dashboard/stats`),
        axios.get(`${API}/api/dashboard/chart-data`)
      ])

      setStats(statsRes.data)

      // ✅ FIXED: Added patients check
      const chartData = chartRes.data.chart_data || []
      const hasData = chartData.some(
        (d: any) => d.calls > 0 || d.appointments > 0 || d.patients > 0
      )

      if (hasData) {
        setRealChartData(chartData)
        setHasRealData(true)
      }

      if (chartRes.data.specialty_data?.length > 0) {
        setRealSpecialtyData(chartRes.data.specialty_data)
      }

      if (chartRes.data.outcome_data?.length > 0) {
        setRealOutcomeData(chartRes.data.outcome_data)
      }

    } catch (e) {
      console.error('Analytics fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchStats()
  }, [])

  if (!mounted) return null

  const chartData: DataPoint[] = realChartData.length > 0
    ? realChartData
    : fallbackWeekly

  const displaySpecialtyData = realSpecialtyData.length > 0
    ? realSpecialtyData
    : fallbackSpecialty

  const displayOutcomeData = realOutcomeData.length > 0
    ? realOutcomeData
    : fallbackOutcome

  const kpis = [
    {
      title: 'Total Calls',
      value: stats?.total_calls ?? 0,
      change: stats?.total_calls > 0 ? 'Real Data' : 'No calls yet',
      up: stats?.total_calls > 0,
      icon: Phone,
      color: '#6366f1',
      bg: '#eef2ff',
      sub: `${stats?.todays_calls ?? 0} today`
    },
    {
      title: 'Appointments',
      value: stats?.total_appointments ?? 0,
      change: stats?.total_appointments > 0
        ? 'Real Data' : 'No data yet',
      up: stats?.total_appointments > 0,
      icon: Calendar,
      color: '#10b981',
      bg: '#ecfdf5',
      sub: `${stats?.todays_appointments ?? 0} today`
    },
    {
      title: 'Patients',
      value: stats?.total_patients ?? 0,
      change: stats?.total_patients > 0
        ? 'Real Data' : 'No data yet',
      up: stats?.total_patients > 0,
      icon: Users,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      sub: 'registered'
    },
    {
      title: 'Confirmed',
      value: stats?.confirmed ?? 0,
      change: `${stats?.pending ?? 0} pending`,
      up: true,
      icon: CheckCircle,
      color: '#f59e0b',
      bg: '#fffbeb',
      sub: 'appointments'
    },
  ]

  const renderIcon = (icon: any, color: string) => {
    switch (icon) {
      case Phone:
        return <Phone size={18} color={color} />
      case Calendar:
        return <Calendar size={18} color={color} />
      case Users:
        return <Users size={18} color={color} />
      case CheckCircle:
        return <CheckCircle size={18} color={color} />
      default:
        return null
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 4px',
            letterSpacing: '-0.03em'
          }}>
            Analytics
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#94a3b8',
            margin: 0,
            fontWeight: 500
          }}>
            {hasRealData
              ? '✅ Showing real data from MongoDB'
              : '⚠️ No real data yet - make calls to see analytics'
            }
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 18px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            fontSize: '13px',
            fontWeight: 600,
            color: '#374151',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            opacity: loading ? 0.6 : 1
          }}
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* No Data Banner */}
      {!hasRealData && !loading && (
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>📊</span>
          <div>
            <p style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#92400e',
              margin: '0 0 2px'
            }}>
              Analytics will show real data after calls
            </p>
            <p style={{
              fontSize: '12px',
              color: '#b45309',
              margin: 0,
              fontWeight: 500
            }}>
              Make calls through Sara AI and data will
              automatically appear here
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {kpis.map((kpi, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'white',
              borderRadius: '14px',
              border: '1px solid #f1f5f9',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow =
                  '0 8px 25px -5px rgba(0,0,0,0.1)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow =
                '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '3px',
              backgroundColor: kpi.color
            }} />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop: '8px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: kpi.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {renderIcon(kpi.icon, kpi.color)}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '10px',
                fontWeight: 700,
                color: kpi.up ? '#10b981' : '#94a3b8',
                backgroundColor: kpi.up ? '#ecfdf5' : '#f8fafc',
                padding: '3px 8px',
                borderRadius: '6px'
              }}>
                {kpi.up && <ArrowUpRight size={10} />}
                {kpi.change}
              </div>
            </div>
            <p style={{
              fontSize: loading ? '14px' : '30px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 2px',
              letterSpacing: '-0.02em'
            }}>
              {loading ? '—' : kpi.value.toLocaleString()}
            </p>
            <p style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              margin: '0 0 2px'
            }}>
              {kpi.title}
            </p>
            <p style={{
              fontSize: '11px',
              color: '#94a3b8',
              margin: 0,
              fontWeight: 500
            }}>
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '14px',
        border: '1px solid #f1f5f9',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 2px'
            }}>
              Calls & Appointments by Day
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#94a3b8',
              margin: 0,
              fontWeight: 500
            }}>
              {hasRealData
                ? 'Real data from your MongoDB database'
                : 'Waiting for real call data...'
              }
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { color: '#6366f1', label: 'Calls' },
              { color: '#10b981', label: 'Appointments' },
            ].map((l, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '3px',
                  backgroundColor: l.color
                }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
          >
            <defs>
              <linearGradient id="gCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gAppts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="calls"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#gCalls)"
              dot={{
                r: 4,
                fill: '#6366f1',
                strokeWidth: 2,
                stroke: 'white'
              }}
              activeDot={{ r: 6 }}
              name="Calls"
            />
            <Area
              type="monotone"
              dataKey="appointments"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#gAppts)"
              dot={{
                r: 4,
                fill: '#10b981',
                strokeWidth: 2,
                stroke: 'white'
              }}
              activeDot={{ r: 6 }}
              name="Appointments"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>

        {/* Specialties Pie */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          border: '1px solid #f1f5f9',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#0f172a',
            margin: '0 0 4px'
          }}>
            Top Specialties
          </h3>
          <p style={{
            fontSize: '12px',
            color: '#94a3b8',
            margin: '0 0 24px',
            fontWeight: 500
          }}>
            {realSpecialtyData.length > 0
              ? 'Real data from appointments'
              : 'No appointment data yet'
            }
          </p>

          <div style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center'
          }}>
            <PieChart width={160} height={160}>
              <Pie
                data={displaySpecialtyData}
                cx={75}
                cy={75}
                innerRadius={45}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {displaySpecialtyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value}%`, '']}
                contentStyle={{
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid #e5e7eb'
                }}
              />
            </PieChart>

            <div style={{ flex: 1 }}>
              {displaySpecialtyData.map((item, i) => (
                <div key={`specialty-${i}`} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: i < displaySpecialtyData.length - 1
                    ? '10px' : 0
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '2px',
                      backgroundColor: item.color,
                      flexShrink: 0
                    }} />
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#374151'
                    }}>
                      {item.name}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}>
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call Outcomes */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          border: '1px solid #f1f5f9',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#0f172a',
            margin: '0 0 4px'
          }}>
            Call Outcomes
          </h3>
          <p style={{
            fontSize: '12px',
            color: '#94a3b8',
            margin: '0 0 24px',
            fontWeight: 500
          }}>
            {realOutcomeData.length > 0
              ? 'Real data from completed calls'
              : 'No call data yet'
            }
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {displayOutcomeData.map((item, i) => (
              <div key={`outcome-${i}`}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#374151'
                  }}>
                    {item.name}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}>
                    {item.value}%
                  </span>
                </div>
                <div style={{
                  height: '6px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(item.value, 100)}%`,
                    backgroundColor: item.color,
                    borderRadius: '10px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            borderRadius: '10px',
            backgroundColor: '#f8fafc',
            border: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '11px',
                color: '#94a3b8',
                margin: '0 0 4px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Total Calls
              </p>
              <p style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0
              }}>
                {loading ? '—' : (stats?.total_calls ?? 0).toLocaleString()}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '11px',
                color: '#94a3b8',
                margin: '0 0 4px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Booked
              </p>
              <p style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#10b981',
                margin: 0
              }}>
                {loading ? '—' : (stats?.confirmed ?? 0).toLocaleString()}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '11px',
                color: '#94a3b8',
                margin: '0 0 4px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Patients
              </p>
              <p style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#6366f1',
                margin: 0
              }}>
                {loading ? '—' : (stats?.total_patients ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
