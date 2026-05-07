'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  TrendingUp, Phone, Calendar,
  Users, CheckCircle,
  RefreshCw, ArrowUpRight,
  ArrowDownRight
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

const weeklyData: DataPoint[] = [
  { day: 'Mon', calls: 12, appointments: 8, patients: 6 },
  { day: 'Tue', calls: 19, appointments: 14, patients: 11 },
  { day: 'Wed', calls: 15, appointments: 11, patients: 9 },
  { day: 'Thu', calls: 25, appointments: 18, patients: 15 },
  { day: 'Fri', calls: 22, appointments: 16, patients: 13 },
  { day: 'Sat', calls: 18, appointments: 12, patients: 10 },
  { day: 'Sun', calls: 10, appointments: 7, patients: 5 },
]

const monthlyData: DataPoint[] = [
  { day: 'Jan', calls: 320, appointments: 240, patients: 180 },
  { day: 'Feb', calls: 280, appointments: 200, patients: 150 },
  { day: 'Mar', calls: 410, appointments: 310, patients: 220 },
  { day: 'Apr', calls: 380, appointments: 290, patients: 200 },
  { day: 'May', calls: 450, appointments: 340, patients: 260 },
  { day: 'Jun', calls: 420, appointments: 320, patients: 240 },
]

const specialtyData = [
  { name: 'Cardiology', value: 28, color: '#6366f1' },
  { name: 'Orthopedics', value: 22, color: '#8b5cf6' },
  { name: 'General Med', value: 20, color: '#a78bfa' },
  { name: 'Pediatrics', value: 18, color: '#c4b5fd' },
  { name: 'Others', value: 12, color: '#e0e7ff' },
]

const outcomeData = [
  { name: 'Appointment Booked', value: 45, color: '#10b981' },
  { name: 'Info Provided', value: 30, color: '#6366f1' },
  { name: 'Emergency', value: 10, color: '#ef4444' },
  { name: 'Transferred', value: 15, color: '#f59e0b' },
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
        <p style={{ color: '#6b7280', margin: '0 0 6px' }}>
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
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly')

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/dashboard/stats`)
      setStats(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchStats()
  }, [])

  if (!mounted) return null

  const chartData: DataPoint[] = period === 'weekly' ? weeklyData : monthlyData

  const kpis = [
    {
      title: 'Total Calls',
      value: stats?.total_calls ?? 0,
      change: '+24.1%',
      up: true,
      icon: Phone,
      color: '#6366f1',
      bg: '#eef2ff',
      sub: `${stats?.todays_calls ?? 0} today`
    },
    {
      title: 'Appointments',
      value: stats?.total_appointments ?? 0,
      change: '+12.5%',
      up: true,
      icon: Calendar,
      color: '#10b981',
      bg: '#ecfdf5',
      sub: `${stats?.todays_appointments ?? 0} today`
    },
    {
      title: 'Patients',
      value: stats?.total_patients ?? 0,
      change: '+8.2%',
      up: true,
      icon: Users,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      sub: 'registered'
    },
    {
      title: 'Success Rate',
      value: '98%',
      change: '+2.1%',
      up: true,
      icon: CheckCircle,
      color: '#f59e0b',
      bg: '#fffbeb',
      sub: 'call completion'
    },
  ]

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
            Sara AI performance insights
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Period Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            gap: '2px'
          }}>
            {(['weekly', 'monthly'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  backgroundColor: period === p ? 'white' : 'transparent',
                  color: period === p ? '#0f172a' : '#64748b',
                  boxShadow: period === p
                    ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={fetchStats}
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
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

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
              transition: 'all 0.2s',
              cursor: 'default'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 25px -5px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
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
                <kpi.icon size={18} color={kpi.color} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '11px',
                fontWeight: 700,
                color: kpi.up ? '#10b981' : '#ef4444',
                backgroundColor: kpi.up ? '#ecfdf5' : '#fef2f2',
                padding: '3px 8px',
                borderRadius: '6px'
              }}>
                {kpi.up
                  ? <ArrowUpRight size={11} />
                  : <ArrowDownRight size={11} />
                }
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
              {loading ? '—' : kpi.value}
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
              Performance Overview
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#94a3b8',
              margin: 0,
              fontWeight: 500
            }}>
              Calls & appointments {period} trend
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
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: 'white' }}
              activeDot={{ r: 6 }}
              name="Calls"
            />
            <Area
              type="monotone"
              dataKey="appointments"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#gAppts)"
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: 'white' }}
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
            By appointment volume
          </p>

          <div style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center'
          }}>
            <PieChart width={160} height={160}>
              <Pie
                data={specialtyData}
                cx={75}
                cy={75}
                innerRadius={45}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {specialtyData.map((entry, index) => (
                  <Cell
                    key={index}
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
              {specialtyData.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: i < specialtyData.length - 1 ? '10px' : 0
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
            What Sara resolved per call
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {outcomeData.map((item, i) => (
              <div key={i}>
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
                    width: `${item.value}%`,
                    backgroundColor: item.color,
                    borderRadius: '10px'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
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
            <div>
              <p style={{
                fontSize: '11px',
                color: '#94a3b8',
                margin: '0 0 2px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Avg Duration
              </p>
              <p style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0
              }}>
                3:24
              </p>
            </div>
            <div>
              <p style={{
                fontSize: '11px',
                color: '#94a3b8',
                margin: '0 0 2px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Satisfaction
              </p>
              <p style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#10b981',
                margin: 0
              }}>
                4.9 ⭐
              </p>
            </div>
            <div>
              <p style={{
                fontSize: '11px',
                color: '#94a3b8',
                margin: '0 0 2px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Resolution
              </p>
              <p style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#6366f1',
                margin: 0
              }}>
                98%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}