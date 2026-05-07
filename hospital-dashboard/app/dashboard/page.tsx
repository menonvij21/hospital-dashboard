'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Users, Calendar, Phone, CheckCircle,
  Clock, ArrowUpRight, RefreshCw,
  TrendingUp, Activity
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const API = process.env.NEXT_PUBLIC_API_URL

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
        axios.get(`${API}/api/appointments?limit=5`),
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
      title: 'Appointments',
      value: stats?.total_appointments ?? 0,
      sub: `${stats?.todays_appointments ?? 0} today`,
      icon: Calendar,
      color: '#3b82f6',
      bg: '#eff6ff'
    },
    {
      title: 'Patients',
      value: stats?.total_patients ?? 0,
      sub: 'Registered',
      icon: Users,
      color: '#10b981',
      bg: '#ecfdf5'
    },
    {
      title: 'AI Calls',
      value: stats?.total_calls ?? 0,
      sub: `${stats?.todays_calls ?? 0} today`,
      icon: Phone,
      color: '#8b5cf6',
      bg: '#f5f3ff'
    },
    {
      title: 'Confirmed',
      value: stats?.confirmed ?? 0,
      sub: `${stats?.pending ?? 0} pending`,
      icon: CheckCircle,
      color: '#f59e0b',
      bg: '#fffbeb'
    },
  ]

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#111827',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Dashboard
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '4px 0 0',
            fontWeight: 500
          }}>
            Real-time overview of your hospital AI system
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {lastUpdated && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              fontSize: '12px',
              fontWeight: 600,
              color: '#6b7280'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981'
              }} />
              Updated {lastUpdated}
            </div>
          )}
          <Button
            onClick={fetchData}
            style={{
              backgroundColor: '#111827',
              color: 'white',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {statCards.map((card, i) => (
          <div key={i} style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '24px',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)'
              e.currentTarget.style.borderColor = card.color
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: card.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <card.icon size={22} color={card.color} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                fontSize: '11px',
                fontWeight: 700,
                color: '#059669'
              }}>
                <TrendingUp size={12} />
                +12%
              </div>
            </div>

            <p style={{
              fontSize: loading ? '14px' : '36px',
              fontWeight: 800,
              color: '#111827',
              margin: '0 0 4px',
              letterSpacing: '-0.02em'
            }}>
              {loading ? '...' : card.value}
            </p>
            <p style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 2px'
            }}>
              {card.title}
            </p>
            <p style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#9ca3af',
              margin: 0
            }}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Sara AI Status Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #111827, #1e293b)',
        borderRadius: '16px',
        padding: '28px 32px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 0 20px rgba(99,102,241,0.4)',
            position: 'relative'
          }}>
            🤖
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              border: '3px solid #111827'
            }} />
          </div>
          <div>
            <p style={{
              fontSize: '18px',
              fontWeight: 800,
              color: 'white',
              margin: 0
            }}>
              Sara AI Agent
            </p>
            <p style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#94a3b8',
              margin: '2px 0 0'
            }}>
              Handling calls · English & Arabic · 24/7
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center'
        }}>
          {[
            { label: 'Calls Today', value: stats?.todays_calls ?? 0 },
            { label: 'Booked Today', value: stats?.todays_appointments ?? 0 },
            { label: 'Status', value: 'Online' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '24px',
                fontWeight: 800,
                color: item.value === 'Online' ? '#22c55e' : 'white',
                margin: 0
              }}>
                {item.value}
              </p>
              <p style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#64748b',
                margin: '2px 0 0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>

        {/* Recent Appointments */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#111827',
                margin: 0
              }}>
                Recent Appointments
              </h3>
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '2px 0 0',
                fontWeight: 500
              }}>
                Booked by Sara AI
              </p>
            </div>
            <a href="/dashboard/appointments" style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#6366f1',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              View all <ArrowUpRight size={12} />
            </a>
          </div>

          <div style={{ padding: '12px' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                Loading...
              </div>
            ) : appointments.length === 0 ? (
              <div style={{
                padding: '48px 24px',
                textAlign: 'center'
              }}>
                <Calendar size={40} color="#d1d5db"
                  style={{ margin: '0 auto 12px' }} />
                <p style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                  margin: '0 0 4px'
                }}>
                  No appointments yet
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  margin: 0
                }}>
                  Will appear when Sara books them
                </p>
              </div>
            ) : (
              appointments.map((apt: any, i: number) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  marginBottom: '4px',
                  transition: 'background 0.15s',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '16px',
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
                      color: '#6b7280',
                      margin: '2px 0 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontWeight: 500
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
                        ? '#ecfdf5' : '#fef3c7',
                      color: apt.status === 'confirmed'
                        ? '#059669' : '#d97706',
                      textTransform: 'capitalize'
                    }}>
                      {apt.status}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: '#9ca3af',
                      fontWeight: 500
                    }}>
                      {apt.date}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Calls */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#111827',
                margin: 0
              }}>
                Recent AI Calls
              </h3>
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '2px 0 0',
                fontWeight: 500
              }}>
                Sara voice activity
              </p>
            </div>
            <a href="/dashboard/calls" style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#8b5cf6',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              View all <ArrowUpRight size={12} />
            </a>
          </div>

          <div style={{ padding: '12px' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                Loading...
              </div>
            ) : calls.length === 0 ? (
              <div style={{
                padding: '48px 24px',
                textAlign: 'center'
              }}>
                <Phone size={40} color="#d1d5db"
                  style={{ margin: '0 auto 12px' }} />
                <p style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                  margin: '0 0 4px'
                }}>
                  No calls yet
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  margin: 0
                }}>
                  Will appear after first call
                </p>
              </div>
            ) : (
              calls.map((call: any, i: number) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  marginBottom: '4px',
                  transition: 'background 0.15s',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: call.call_type === 'inbound'
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Phone size={18} color="white" />
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
                      {call.caller_phone || 'Unknown'}
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      margin: '2px 0 0',
                      fontWeight: 500
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
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Clock size={11} color="#9ca3af" />
                      {call.duration || '--:--'}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: call.call_type === 'inbound'
                        ? '#ecfdf5' : '#eff6ff',
                      color: call.call_type === 'inbound'
                        ? '#059669' : '#2563eb'
                    }}>
                      {call.call_type}
                    </span>
                    {call.appointment_booked && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '6px',
                        backgroundColor: '#f0fdf4',
                        color: '#16a34a'
                      }}>
                        ✓ Booked
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}