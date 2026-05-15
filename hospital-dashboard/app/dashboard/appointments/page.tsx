'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Calendar, Search, CheckCircle,
  XCircle, RefreshCw, Trash2,
  Clock, ArrowUpRight, Filter
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [mounted, setMounted] = useState(false)

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API}/api/appointments?limit=100`)
      setAppointments(res.data.appointments || []) // ✅ Added fallback for undefined
    } catch (error) {
      console.error(error)
      setAppointments([]) // ✅ Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchAppointments()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`${API}/api/appointments/${id}`, { status })
      fetchAppointments()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteAppointment = async (id: string) => {
    if (!confirm('Delete this appointment?')) return
    try {
      await axios.delete(`${API}/api/appointments/${id}`)
      fetchAppointments()
    } catch (error) {
      console.error(error)
    }
  }

  const filtered = appointments.filter(apt => {
    const matchSearch =
      apt.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
      apt.doctor_name?.toLowerCase().includes(search.toLowerCase()) ||
      apt.specialty?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || apt.status === filter
    return matchSearch && matchFilter
  })

  if (!mounted) return null

  const statusColors: any = {
    confirmed: { bg: '#ecfdf5', color: '#059669', border: '#d1fae5' },
    pending: { bg: '#fffbeb', color: '#d97706', border: '#fef3c7' },
    cancelled: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
  }

  const filters = ['all', 'confirmed', 'pending', 'cancelled']

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
            Appointments
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#94a3b8',
            margin: 0,
            fontWeight: 500
          }}>
            {appointments.length} total · {filtered.length} showing
          </p>
        </div>
        <button
          onClick={fetchAppointments}
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

      {/* Search & Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={15} color="#94a3b8" style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none' // ✅ Prevent icon from blocking input
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patient, doctor, specialty..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0f172a',
              outline: 'none',
              boxSizing: 'border-box' // ✅ Fix width overflow
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
        <div style={{
          display: 'flex',
          gap: '4px',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '10px'
        }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                backgroundColor: filter === f ? 'white' : 'transparent',
                color: filter === f ? '#0f172a' : '#64748b',
                boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '14px',
        border: '1px solid #f1f5f9',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {loading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '13px'
          }}>
            Loading appointments...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            padding: '80px 24px',
            textAlign: 'center'
          }}>
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
              <Calendar size={24} color="#94a3b8" />
            </div>
            <p style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#374151',
              margin: '0 0 4px'
            }}>
              No appointments found
            </p>
            <p style={{
              fontSize: '13px',
              color: '#94a3b8',
              margin: 0
            }}>
              Appointments will appear when Sara books them
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1.2fr 1fr 0.8fr 0.7fr 0.6fr 0.7fr',
              padding: '12px 20px',
              borderBottom: '1px solid #f1f5f9',
              backgroundColor: '#fafbfc'
            }}>
              {['Patient', 'Doctor', 'Specialty', 'Date', 'Time', 'Status', 'Actions'].map(h => (
                <span key={h} style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((apt: any, i: number) => {
              const sc = statusColors[apt.status] || statusColors.pending
              return (
                <div
                  key={apt.appointment_id || i} // ✅ Use unique ID instead of index
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1.2fr 1fr 0.8fr 0.7fr 0.6fr 0.7fr',
                    padding: '14px 20px',
                    borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none',
                    alignItems: 'center',
                    transition: 'background 0.15s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafbfc'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Patient */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '12px',
                      flexShrink: 0
                    }}>
                      {apt.patient_name?.charAt(0)?.toUpperCase() || 'P'}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        {apt.patient_name || 'Unknown'}
                      </p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
                        {apt.patient_phone || 'No phone'}
                      </p>
                    </div>
                  </div>

                  {/* Doctor */}
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                    {apt.doctor_name || 'TBC'}
                  </span>

                  {/* Specialty */}
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#6366f1',
                    backgroundColor: '#eef2ff',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    width: 'fit-content'
                  }}>
                    {apt.specialty || 'General'}
                  </span>

                  {/* Date */}
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#475569' }}>
                    {apt.date || 'TBC'}
                  </span>

                  {/* Time */}
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={11} color="#94a3b8" />
                    {apt.time || 'TBC'}
                  </span>

                  {/* Status */}
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: sc.bg,
                    color: sc.color,
                    textTransform: 'capitalize',
                    width: 'fit-content'
                  }}>
                    {apt.status || 'pending'}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={e => { e.stopPropagation(); updateStatus(apt.appointment_id, 'confirmed') }}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        border: 'none',
                        backgroundColor: '#ecfdf5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Confirm"
                    >
                      <CheckCircle size={13} color="#059669" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); updateStatus(apt.appointment_id, 'cancelled') }}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        border: 'none',
                        backgroundColor: '#fef2f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Cancel"
                    >
                      <XCircle size={13} color="#dc2626" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); deleteAppointment(apt.appointment_id) }}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        border: 'none',
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Delete"
                    >
                      <Trash2 size={13} color="#64748b" />
                    </button>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
