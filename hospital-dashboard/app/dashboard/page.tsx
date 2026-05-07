'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Users, Calendar, Phone, CheckCircle,
  Clock, ArrowUpRight, RefreshCw,
  TrendingUp, TrendingDown, Activity,
  MoreHorizontal, Zap, Circle
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
  PieChart, Pie, Cell
} from 'recharts'

const API = process.env.NEXT_PUBLIC_API_URL

const weekData = [
  { day: 'Mon', calls: 12, appointments: 8 },
  { day: 'Tue', calls: 19, appointments: 14 },
  { day: 'Wed', calls: 15, appointments: 11 },
  { day: 'Thu', calls: 25, appointments: 18 },
  { day: 'Fri', calls: 22, appointments: 16 },
  { day: 'Sat', calls: 18, appointments: 12 },
  { day: 'Sun', calls: 10, appointments: 7 },
]

const specialtyData = [
  { name: 'Cardiology', value: 28, color: '#6366f1' },
  { name: 'Orthopedics', value: 22, color: '#8b5cf6' },
  { name: 'General Med', value: 20, color: '#a78bfa' },
  { name: 'Pediatrics', value: 18, color: '#c4b5fd' },
  { name: 'Others', value: 12, color: '#e0e7ff' },
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
        <p style={{ color: '#6b7280', marginBottom: '6px' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, margin: '2px 0' }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('')

  const fetchData = async () => {
    try {
      const [s, a, c] = await Promise.all([
        axios.get(`${API}/api/dashboard/stats`),
        axios.get(`${API}/api/appointments?limit=6`),
        axios.get(`${API}/api/calls?limit=5`),
      ])
      setStats(s.data)
      setAppointments(a.data.appointments)
      setCalls(c.data.calls)
      setLastUpdated(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      )
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchData()
    const t = setInterval(fetchData, 30000)
    return () => clearInterval(t)
  }, [])

  if (!mounted) return null

  const statCards = [
    {
      title: 'Total Appointments',
      value: stats?.total_appointments ?? 0,
      sub: `+${stats?.todays_appointments ?? 0} today`,
      trend: 'up',
      trendValue: '12.5%',
      icon: Calendar,
      iconBg: '#eef2ff',
      iconColor: '#6366f1',
      accent: '#6366f1'
    },
    {
      title: 'Total Patients',
      value: stats?.total_patients ?? 0,
      sub: 'Registered patients',
      trend: 'up',
      trendValue: '8.2%',
      icon: Users,
      iconBg: '#ecfdf5',
      iconColor: '#10b981',
      accent: '#10b981'
    },
    {
      title: 'AI Calls Handled',
      value: stats?.total_calls ?? 0,
      sub: `+${stats?.todays_calls ?? 0} today`,
      trend: 'up',
      trendValue: '24.1%',
      icon: Phone,
      iconBg: '#f5f3ff',
      iconColor: '#8b5cf6',
      accent: '#8b5cf6'
    },
    {
      title: 'Confirmed',
      value: stats?.confirmed ?? 0,
      sub: `${stats?.pending ?? 0} pending`,
      trend: 'up',
      trendValue: '5.3%',
      icon: CheckCircle,
      iconBg: '#fffbeb',
      iconColor: '#f59e0b',
      accent: '#f59e0b'
    },
  ]

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: '#111827',
      maxWidth: '1400px'
    }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '6px'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-0.03em'
            }}>
              Overview
            </h1>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '100px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                display: 'inline-block'
              }} />
              Live
            </span>
          </div>
          <p style={{
            fontSize: '13px',
            color: '#94a3b8',
            margin: 0,
            fontWeight: 500
          }}>
            Universal Hospital · Abu Dhabi, UAE
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {lastUpdated && (
            <span style={{
              fontSize: '12px',
              color: '#94a3b8',
              fontWeight: 500
            }}>
              Updated {lastUpdated}
            </span>
          )}
          <button
            onClick={fetchData}
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
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f8fafc'
              e.currentTarget.style.borderColor = '#6366f1'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {statCards.map((card, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'white',
              borderRadius: '14px',
              border: '1px solid #f1f5f9',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.25s',
              cursor: 'default'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 12px 24px -4px ${card.accent}20`
              e.currentTarget.style.borderColor = `${card.accent}30`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
              e.currentTarget.style.borderColor = '#f1f5f9'
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: card.accent,
              borderRadius: '14px 14px 0 0'
            }} />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px',
              marginTop: '4px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: card.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <card.icon size={18} color={card.iconColor} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#10b981',
                backgroundColor: '#ecfdf5',
                padding: '3px 8px',
                borderRadius: '6px'
              }}>
                <TrendingUp size={10} />
                {card.trendValue}
              </div>
            </div>

            <p style={{
              fontSize: loading ? '16px' : '32px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 2px',
              letterSpacing: '-0.03em',
              lineHeight: 1.1
            }}>
              {loading ? '—' : card.value.toLocaleString()}
            </p>
            <p style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              margin: '0 0 2px'
            }}>
              {card.title}
            </p>
            <p style={{
              fontSize: '11px',
              fontWeight: 500,
              color: '#94a3b8',
              margin: 0
            }}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '16px',
        marginBottom: '24px'
      }}>

        {/* Area Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          border: '1px solid #f1f5f9',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
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
                Calls & Appointments
              </h3>
              <p style={{
                fontSize: '12px',
                color: '#94a3b8',
                margin: 0,
                fontWeight: 500
              }}>
                Weekly performance trend
              </p>
            </div>
            <div style={{
              display: 'flex',
              gap: '16px',
              fontSize: '11px',
              fontWeight: 600
            }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#6366f1'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: '#6366f1',
                  display: 'inline-block'
                }} />
                Calls
              </span>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#10b981'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: '#10b981',
                  display: 'inline-block'
                }} />
                Appointments
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weekData}
              margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
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
                fill="url(#colorCalls)"
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: 'white' }}
                activeDot={{ r: 6 }}
                name="Calls"
              />
              <Area
                type="monotone"
                dataKey="appointments"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#colorAppts)"
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: 'white' }}
                activeDot={{ r: 6 }}
                name="Appointments"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          border: '1px solid #f1f5f9',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 2px'
            }}>
              Top Specialties
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#94a3b8',
              margin: 0,
              fontWeight: 500
            }}>
              By appointment volume
            </p>
          </div>

          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={specialtyData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {specialtyData.map((entry, index) => (
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
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {specialtyData.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 0',
                borderBottom: i < specialtyData.length - 1
                  ? '1px solid #f8fafc' : 'none'
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
                    backgroundColor: item.color
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

      {/* ── Sara AI Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        borderRadius: '14px',
        padding: '24px 32px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '200px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.08)',
          filter: 'blur(40px)'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '13px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 0 20px rgba(99,102,241,0.35)',
            position: 'relative',
            flexShrink: 0
          }}>
            🤖
            <div style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              border: '2.5px solid #0f172a'
            }} />
          </div>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '3px'
            }}>
              <p style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'white',
                margin: 0
              }}>
                Sara AI
              </p>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '100px',
                backgroundColor: 'rgba(34,197,94,0.15)',
                color: '#4ade80',
                border: '1px solid rgba(34,197,94,0.2)'
              }}>
                ACTIVE
              </span>
            </div>
            <p style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#64748b',
              margin: 0
            }}>
              Inbound & Outbound · English & Arabic · 24/7
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center'
        }}>
          {[
            {
              label: 'Calls Today',
              value: stats?.todays_calls ?? 0,
              color: 'white'
            },
            {
              label: 'Booked Today',
              value: stats?.todays_appointments ?? 0,
              color: 'white'
            },
            {
              label: 'Success Rate',
              value: '98%',
              color: '#4ade80'
            },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '26px',
                fontWeight: 800,
                color: item.color,
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                {item.value}
              </p>
              <p style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#475569',
                margin: '2px 0 0',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Activity Tables ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>

        {/* Appointments */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          border: '1px solid #f1f5f9',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid #f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 1px'
              }}>
                Recent Appointments
              </h3>
              <p style={{
                fontSize: '11px',
                color: '#94a3b8',
                margin: 0,
                fontWeight: 500
              }}>
                Booked by Sara AI
              </p>
            </div>
            <a
              href="/dashboard/appointments"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#6366f1',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                padding: '5px 10px',
                borderRadius: '7px',
                backgroundColor: '#eef2ff'
              }}
            >
              All <ArrowUpRight size={10} />
            </a>
          </div>

          {loading ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '13px'
            }}>
              Loading...
            </div>
          ) : appointments.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Calendar size={22} color="#94a3b8" />
              </div>
              <p style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                margin: '0 0 4px'
              }}>
                No appointments yet
              </p>
              <p style={{
                fontSize: '11px',
                color: '#94a3b8',
                margin: 0
              }}>
                Will appear when Sara books them
              </p>
            </div>
          ) : (
            <div>
              {appointments.map((apt: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '13px 20px',
                    borderBottom: i < appointments.length - 1
                      ? '1px solid #f8fafc' : 'none',
                    transition: 'background 0.15s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e =>
                    e.currentTarget.style.backgroundColor = '#fafafa'}
                  onMouseLeave={e =>
                    e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '9px',
                    background: `linear-gradient(135deg, #6366f1, #8b5cf6)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    {apt.patient_name?.charAt(0) || 'P'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#111827',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {apt.patient_name}
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      margin: '1px 0 0',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {apt.doctor_name} · {apt.specialty}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '4px',
                    flexShrink: 0
                  }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: apt.status === 'confirmed'
                        ? '#ecfdf5'
                        : apt.status === 'pending'
                        ? '#fffbeb'
                        : '#fef2f2',
                      color: apt.status === 'confirmed'
                        ? '#059669'
                        : apt.status === 'pending'
                        ? '#d97706'
                        : '#dc2626',
                      textTransform: 'capitalize'
                    }}>
                      {apt.status}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: '#cbd5e1',
                      fontWeight: 500
                    }}>
                      {apt.date || 'TBC'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calls */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          border: '1px solid #f1f5f9',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid #f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 1px'
              }}>
                Recent AI Calls
              </h3>
              <p style={{
                fontSize: '11px',
                color: '#94a3b8',
                margin: 0,
                fontWeight: 500
              }}>
                Sara voice activity
              </p>
            </div>
            <a
              href="/dashboard/calls"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#8b5cf6',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                padding: '5px 10px',
                borderRadius: '7px',
                backgroundColor: '#f5f3ff'
              }}
            >
              All <ArrowUpRight size={10} />
            </a>
          </div>

          {loading ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '13px'
            }}>
              Loading...
            </div>
          ) : calls.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Phone size={22} color="#94a3b8" />
              </div>
              <p style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                margin: '0 0 4px'
              }}>
                No calls yet
              </p>
              <p style={{
                fontSize: '11px',
                color: '#94a3b8',
                margin: 0
              }}>
                Will appear after first call
              </p>
            </div>
          ) : (
            <div>
              {calls.map((call: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '13px 20px',
                    borderBottom: i < calls.length - 1
                      ? '1px solid #f8fafc' : 'none',
                    transition: 'background 0.15s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e =>
                    e.currentTarget.style.backgroundColor = '#fafafa'}
                  onMouseLeave={e =>
                    e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '9px',
                    background: call.call_type === 'inbound'
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Phone size={15} color="white" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#111827',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {call.caller_phone || 'Unknown Number'}
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      margin: '1px 0 0',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {call.outcome}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '4px',
                    flexShrink: 0
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#475569'
                    }}>
                      <Clock size={10} color="#94a3b8" />
                      {call.duration || '--:--'}
                    </div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '5px',
                      backgroundColor: call.call_type === 'inbound'
                        ? '#ecfdf5' : '#eef2ff',
                      color: call.call_type === 'inbound'
                        ? '#059669' : '#6366f1'
                    }}>
                      {call.call_type}
                    </span>
                    {call.appointment_booked && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '5px',
                        backgroundColor: '#f0fdf4',
                        color: '#16a34a'
                      }}>
                        ✓ Booked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}