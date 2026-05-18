'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Phone, Search, RefreshCw, Clock,
  PhoneIncoming, PhoneOutgoing,
  Calendar, MessageSquare, TrendingUp,
  Hash, X
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCall, setSelectedCall] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  const fetchCalls = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/api/calls?limit=100`)
      setCalls(res.data.calls ?? [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchCalls()
    const t = setInterval(fetchCalls, 30000)
    return () => clearInterval(t)
  }, [])

  const filtered = calls.filter(call =>
    call.caller_name?.toLowerCase().includes(search.toLowerCase()) ||
    call.caller_phone?.toLowerCase().includes(search.toLowerCase()) ||
    call.outcome?.toLowerCase().includes(search.toLowerCase()) ||
    call.call_summary?.toLowerCase().includes(search.toLowerCase())
  )

  if (!mounted) return null

  const sentimentStyle = (s: string) => {
    if (!s) return { bg: '#f1f5f9', text: '#64748b', emoji: '😐' }
    if (s.toLowerCase() === 'positive') return { bg: '#ecfdf5', text: '#059669', emoji: '😊' }
    if (s.toLowerCase() === 'negative') return { bg: '#fef2f2', text: '#dc2626', emoji: '😟' }
    return { bg: '#fffbeb', text: '#d97706', emoji: '😐' }
  }

  const outcomeStyle = (o: string) => {
    if (!o) return { bg: '#f1f5f9', text: '#64748b' }
    if (o.includes('Booked')) return { bg: '#ecfdf5', text: '#059669' }
    if (o.includes('Emergency')) return { bg: '#fef2f2', text: '#dc2626' }
    if (o.includes('Transfer')) return { bg: '#fffbeb', text: '#d97706' }
    if (o.includes('Modified')) return { bg: '#f5f3ff', text: '#7c3aed' }
    return { bg: '#eef2ff', text: '#6366f1' }
  }

  const headerGradient = (call: any) =>
    call?.call_type === 'inbound'
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px', fontWeight: 800,
            color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.03em'
          }}>
            Call Logs
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
            {calls.length} total calls · Sara AI
          </p>
        </div>
        <button
          onClick={fetchCalls}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 18px', borderRadius: '10px',
            border: '1px solid #e2e8f0', backgroundColor: 'white',
            fontSize: '13px', fontWeight: 600, color: '#374151',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <RefreshCw size={13} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
        <Search size={15} color="#94a3b8" style={{
          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'
        }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, phone, or outcome..."
          style={{
            width: '100%', padding: '10px 14px 10px 38px',
            borderRadius: '10px', border: '1px solid #e2e8f0',
            backgroundColor: 'white', fontSize: '13px',
            fontWeight: 500, color: '#0f172a', outline: 'none',
            boxSizing: 'border-box'
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = '#6366f1'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = '#e2e8f0'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Main grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedCall ? '1fr 460px' : '1fr',
        gap: '16px',
        alignItems: 'start'
      }}>

        {/* ── Calls List ── */}
        <div style={{
          backgroundColor: 'white', borderRadius: '14px',
          border: '1px solid #f1f5f9', overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '80px 24px', textAlign: 'center' }}>
              <Phone size={32} color="#d1d5db" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#374151', margin: '0 0 4px' }}>No calls yet</p>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Call logs appear after first interaction</p>
            </div>
          ) : (
            filtered.map((call: any, i: number) => (
              <div
                key={i}
                onClick={() => setSelectedCall(call)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none',
                  borderLeft: selectedCall?.call_id === call.call_id
                    ? '3px solid #6366f1' : '3px solid transparent',
                  backgroundColor: selectedCall?.call_id === call.call_id
                    ? '#fafbff' : 'transparent',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
                onMouseEnter={e => {
                  if (selectedCall?.call_id !== call.call_id)
                    e.currentTarget.style.backgroundColor = '#fafafa'
                }}
                onMouseLeave={e => {
                  if (selectedCall?.call_id !== call.call_id)
                    e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '11px',
                  background: call.call_type === 'inbound'
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0
                }}>
                  {call.call_type === 'inbound'
                    ? <PhoneIncoming size={17} color="white" />
                    : <PhoneOutgoing size={17} color="white" />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '13px', fontWeight: 700, color: '#111827',
                    margin: 0, overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {call.caller_name || call.caller_phone || 'Unknown Caller'}
                  </p>
                  <p style={{
                    fontSize: '11px', color: '#94a3b8', margin: '2px 0 0',
                    fontWeight: 500, overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {call.outcome || 'No outcome'}
                  </p>
                </div>

                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'flex-end', gap: '5px', flexShrink: 0
                }}>
                  <span style={{
                    fontSize: '12px', fontWeight: 600, color: '#374151',
                    display: 'flex', alignItems: 'center', gap: '3px'
                  }}>
                    <Clock size={10} color="#94a3b8" />
                    {call.duration || '--:--'}
                  </span>
                  <span style={{
                    fontSize: '10px', fontWeight: 700,
                    padding: '2px 8px', borderRadius: '5px',
                    backgroundColor: call.status === 'completed' ? '#ecfdf5' : '#fef9c3',
                    color: call.status === 'completed' ? '#059669' : '#ca8a04'
                  }}>
                    {call.status}
                  </span>
                  {call.appointment_booked && (
                    <span style={{
                      fontSize: '10px', fontWeight: 700,
                      padding: '2px 7px', borderRadius: '5px',
                      backgroundColor: '#f0fdf4', color: '#16a34a'
                    }}>
                      ✓ Booked
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Detail Panel ── */}
        {selectedCall && (
          <div style={{
            borderRadius: '16px', border: '1px solid #e8edf5',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            position: 'sticky', top: '24px',
            backgroundColor: 'white'
          }}>

            {/* Coloured header */}
            <div style={{
              background: headerGradient(selectedCall),
              padding: '22px 20px 26px',
              position: 'relative'
            }}>
              <button
                onClick={() => setSelectedCall(null)}
                style={{
                  position: 'absolute', top: '14px', right: '14px',
                  width: '28px', height: '28px', borderRadius: '8px',
                  border: 'none', backgroundColor: 'rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={14} color="white" />
              </button>

              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '54px', height: '54px', borderRadius: '15px',
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', fontWeight: 800, color: 'white', flexShrink: 0
                }}>
                  {(selectedCall.caller_name || selectedCall.caller_phone || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: '18px', fontWeight: 800, color: 'white', margin: '0 0 3px' }}>
                    {selectedCall.caller_name || 'Unknown Caller'}
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', margin: 0, fontWeight: 500 }}>
                    {selectedCall.caller_phone || 'No phone on record'}
                  </p>
                </div>
              </div>

              {/* Pill stats */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                {[
                  { icon: '📞', label: selectedCall.call_type || 'inbound' },
                  { icon: '⏱', label: selectedCall.duration || '--:--' },
                  { icon: '🌐', label: selectedCall.language || 'English' },
                ].map((p, i) => (
                  <span key={i} style={{
                    fontSize: '11px', fontWeight: 600,
                    padding: '4px 11px', borderRadius: '20px',
                    backgroundColor: 'rgba(255,255,255,0.22)',
                    color: 'white', display: 'flex', alignItems: 'center', gap: '5px'
                  }}>
                    {p.icon} {p.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Outcome + Sentiment row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              borderBottom: '1px solid #f1f5f9'
            }}>
              {[
                {
                  label: 'Outcome',
                  content: (
                    <span style={{
                      fontSize: '12px', fontWeight: 700,
                      padding: '4px 10px', borderRadius: '7px',
                      backgroundColor: outcomeStyle(selectedCall.outcome).bg,
                      color: outcomeStyle(selectedCall.outcome).text,
                      display: 'inline-block'
                    }}>
                      {selectedCall.outcome || 'N/A'}
                    </span>
                  )
                },
                {
                  label: 'Sentiment',
                  content: selectedCall.user_sentiment ? (
                    <span style={{
                      fontSize: '12px', fontWeight: 700,
                      padding: '4px 10px', borderRadius: '7px',
                      backgroundColor: sentimentStyle(selectedCall.user_sentiment).bg,
                      color: sentimentStyle(selectedCall.user_sentiment).text,
                      display: 'inline-block'
                    }}>
                      {sentimentStyle(selectedCall.user_sentiment).emoji} {selectedCall.user_sentiment}
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>N/A</span>
                  )
                }
              ].map((col, i) => (
                <div key={i} style={{
                  padding: '14px 18px',
                  borderRight: i === 0 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <p style={{
                    fontSize: '10px', fontWeight: 700, color: '#94a3b8',
                    textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 7px'
                  }}>
                    {col.label}
                  </p>
                  {col.content}
                </div>
              ))}
            </div>

            {/* Scrollable content */}
            <div style={{
              padding: '16px 18px',
              maxHeight: 'calc(100vh - 380px)',
              overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: '14px'
            }}>

              {/* Appointment booked card */}
              {selectedCall.appointment_booked && (
                <div style={{
                  borderRadius: '12px', overflow: 'hidden',
                  border: '1px solid #bbf7d0'
                }}>
                  <div style={{
                    backgroundColor: '#16a34a', padding: '9px 14px',
                    display: 'flex', alignItems: 'center', gap: '7px'
                  }}>
                    <Calendar size={13} color="white" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>
                      Appointment Booked
                    </span>
                  </div>
                  <div style={{ padding: '11px 14px', backgroundColor: '#f0fdf4' }}>
                    <p style={{ fontSize: '12px', color: '#166534', margin: 0, fontWeight: 600, fontFamily: 'monospace' }}>
                      {selectedCall.appointment_id || 'N/A'}
                    </p>
                  </div>
                </div>
              )}

              {/* Call ID */}
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px', borderRadius: '10px',
                backgroundColor: '#f8fafc', border: '1px solid #f1f5f9'
              }}>
                <span style={{
                  fontSize: '11px', fontWeight: 700, color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  display: 'flex', alignItems: 'center', gap: '5px'
                }}>
                  <Hash size={10} /> Call ID
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', fontFamily: 'monospace' }}>
                  ...{selectedCall.call_id?.slice(-14) || 'N/A'}
                </span>
              </div>

              {/* AI Summary */}
              {selectedCall.call_summary && (
                <div style={{ borderRadius: '12px', border: '1px solid #e0e7ff', overflow: 'hidden' }}>
                  <div style={{
                    backgroundColor: '#eef2ff', padding: '9px 14px',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    <TrendingUp size={12} color="#6366f1" />
                    <span style={{
                      fontSize: '11px', fontWeight: 700, color: '#6366f1',
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                      AI Summary
                    </span>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: 1.7, fontWeight: 500 }}>
                      {selectedCall.call_summary}
                    </p>
                  </div>
                </div>
              )}

              {/* Transcript */}
              <div style={{ borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{
                  backgroundColor: '#f8fafc', padding: '9px 14px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <MessageSquare size={12} color="#64748b" />
                  <span style={{
                    fontSize: '11px', fontWeight: 700, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>
                    Transcript
                  </span>
                </div>

                {selectedCall.transcript ? (
                  <div style={{
                    padding: '14px', maxHeight: '360px', overflowY: 'auto',
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    backgroundColor: 'white'
                  }}>
                    {selectedCall.transcript
                      .split('\n')
                      .filter((line: string) => line.trim())
                      .map((line: string, i: number) => {
                        const isAgent =
                          line.toLowerCase().startsWith('agent:') ||
                          line.toLowerCase().startsWith('sara:') ||
                          line.toLowerCase().startsWith('assistant:')
                        const isUser =
                          line.toLowerCase().startsWith('user:') ||
                          line.toLowerCase().startsWith('patient:') ||
                          line.toLowerCase().startsWith('human:')
                        const cleanLine = line.replace(/^(agent|sara|assistant|user|patient|human):\s*/i, '')

                        return (
                          <div key={i} style={{
                            display: 'flex',
                            flexDirection: isAgent ? 'row' : 'row-reverse',
                            gap: '8px', alignItems: 'flex-end'
                          }}>
                            <div style={{
                              width: '28px', height: '28px', borderRadius: '9px',
                              backgroundColor: isAgent ? '#6366f1' : '#10b981',
                              display: 'flex', alignItems: 'center',
                              justifyContent: 'center', flexShrink: 0,
                              fontSize: '11px', fontWeight: 700, color: 'white'
                            }}>
                              {isAgent ? 'S' : 'U'}
                            </div>
                            <div style={{
                              maxWidth: '78%', padding: '9px 13px',
                              borderRadius: isAgent
                                ? '4px 14px 14px 14px'
                                : '14px 4px 14px 14px',
                              backgroundColor: isAgent ? '#eef2ff' : '#f0fdf4',
                              border: `1px solid ${isAgent ? '#e0e7ff' : '#dcfce7'}`,
                              fontSize: '12px', lineHeight: 1.65,
                              fontWeight: 500,
                              color: isAgent ? '#3730a3' : '#166534'
                            }}>
                              {cleanLine}
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                ) : (
                  <div style={{ padding: '32px', textAlign: 'center', backgroundColor: 'white' }}>
                    <MessageSquare size={24} color="#d1d5db" style={{ margin: '0 auto 8px', display: 'block' }} />
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
                      {selectedCall.status === 'ongoing' ? 'Call in progress...' : 'No transcript available'}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
