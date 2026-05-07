'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Phone, Search, RefreshCw, Clock,
  PhoneIncoming, PhoneOutgoing,
  Calendar, User, MessageSquare
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCall, setSelectedCall] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  const fetchCalls = async () => {
    try {
      const res = await axios.get(`${API}/api/calls?limit=100`)
      setCalls(res.data.calls)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchCalls()
  }, [])

  const filtered = calls.filter(call =>
    call.caller_phone?.toLowerCase().includes(search.toLowerCase()) ||
    call.outcome?.toLowerCase().includes(search.toLowerCase())
  )

  if (!mounted) return null

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
            fontSize: '24px',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 4px',
            letterSpacing: '-0.03em'
          }}>
            Call Logs
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#94a3b8',
            margin: 0,
            fontWeight: 500
          }}>
            {calls.length} total calls by Sara AI
          </p>
        </div>
        <button
          onClick={fetchCalls}
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

      {/* Search */}
      <div style={{
        position: 'relative',
        marginBottom: '20px',
        maxWidth: '400px'
      }}>
        <Search size={15} color="#94a3b8" style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)'
        }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by phone or outcome..."
          style={{
            width: '100%',
            padding: '10px 14px 10px 38px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            fontSize: '13px',
            fontWeight: 500,
            color: '#0f172a',
            outline: 'none'
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

      {/* Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '16px',
        alignItems: 'start'
      }}>

        {/* Calls List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          border: '1px solid #f1f5f9',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '80px 24px', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Phone size={24} color="#94a3b8" />
              </div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#374151', margin: '0 0 4px' }}>
                No calls yet
              </p>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                Call logs appear after first interaction
              </p>
            </div>
          ) : (
            filtered.map((call: any, i: number) => (
              <div
                key={i}
                onClick={() => setSelectedCall(call)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none',
                  borderLeft: selectedCall?.call_id === call.call_id
                    ? '3px solid #6366f1' : '3px solid transparent',
                  backgroundColor: selectedCall?.call_id === call.call_id
                    ? '#fafbff' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
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
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: call.call_type === 'inbound'
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {call.call_type === 'inbound'
                    ? <PhoneIncoming size={16} color="white" />
                    : <PhoneOutgoing size={16} color="white" />
                  }
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
                    fontWeight: 600,
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Clock size={10} color="#94a3b8" />
                    {call.duration || '--:--'}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '5px',
                    backgroundColor: call.call_type === 'inbound' ? '#ecfdf5' : '#eef2ff',
                    color: call.call_type === 'inbound' ? '#059669' : '#6366f1'
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
            ))
          )}
        </div>

        {/* Call Details */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          border: '1px solid #f1f5f9',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          position: 'sticky',
          top: '100px'
        }}>
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid #f8fafc',
            backgroundColor: '#fafbfc'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0
            }}>
              Call Details
            </h3>
          </div>

          {selectedCall ? (
            <div style={{ padding: '20px' }}>
              {[
                { label: 'Call ID', value: selectedCall.call_id?.slice(-8) || 'N/A' },
                { label: 'Phone', value: selectedCall.caller_phone || 'Unknown' },
                { label: 'Type', value: selectedCall.call_type },
                { label: 'Duration', value: selectedCall.duration || 'N/A' },
                { label: 'Outcome', value: selectedCall.outcome },
                { label: 'Language', value: selectedCall.language || 'English' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: i < 5 ? '1px solid #f8fafc' : 'none'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#111827',
                    textAlign: 'right',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}

              {selectedCall.appointment_booked && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #dcfce7'
                }}>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#16a34a',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Calendar size={13} />
                    Appointment Booked
                  </p>
                  <p style={{
                    fontSize: '11px',
                    color: '#15803d',
                    margin: '4px 0 0',
                    fontWeight: 500
                  }}>
                    ID: {selectedCall.appointment_id || 'N/A'}
                  </p>
                </div>
              )}

              {selectedCall.transcript && (
                <div style={{ marginTop: '16px' }}>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: '0 0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <MessageSquare size={12} />
                    Transcript
                  </p>
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #f1f5f9',
                    padding: '14px',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    fontSize: '12px',
                    color: '#475569',
                    lineHeight: 1.7,
                    fontWeight: 500,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedCall.transcript}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              padding: '60px 24px',
              textAlign: 'center'
            }}>
              <Phone size={32} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
              <p style={{
                fontSize: '13px',
                color: '#94a3b8',
                margin: 0,
                fontWeight: 500
              }}>
                Select a call to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}