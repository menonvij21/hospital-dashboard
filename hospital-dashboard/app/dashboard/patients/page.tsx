'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Users, Search, RefreshCw,
  Calendar, Phone, Clock
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/api/patients?limit=100`)
      setPatients(res.data.patients ?? [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchPatients()
    const t = setInterval(fetchPatients, 30000)
    return () => clearInterval(t)
  }, [])

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.toLowerCase().includes(search.toLowerCase())
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
            Patients
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#94a3b8',
            margin: 0,
            fontWeight: 500
          }}>
            {patients.length} registered patients
          </p>
        </div>
        <button
          onClick={fetchPatients}
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
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <RefreshCw size={13} />
          {loading ? 'Loading...' : 'Refresh'}
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
          placeholder="Search by name or phone..."
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

      {/* Patient Cards */}
      {loading ? (
        <div style={{
          padding: '60px',
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: '13px'
        }}>
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          border: '1px solid #f1f5f9',
          padding: '80px 24px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
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
            <Users size={24} color="#94a3b8" />
          </div>
          <p style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#374151',
            margin: '0 0 4px'
          }}>
            No patients yet
          </p>
          <p style={{
            fontSize: '13px',
            color: '#94a3b8',
            margin: 0
          }}>
            Patient records appear when Sara books appointments
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }}>
          {filtered.map((patient: any, i: number) => (
            <div
              key={i}
              style={{
                backgroundColor: 'white',
                borderRadius: '14px',
                border: '1px solid #f1f5f9',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 25px -5px rgba(0,0,0,0.1)'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
                e.currentTarget.style.borderColor = '#f1f5f9'
              }}
            >
              {/* Patient Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '18px',
                  flexShrink: 0
                }}>
                  {patient.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#111827',
                    margin: 0
                  }}>
                    {patient.name}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    margin: '2px 0 0',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Phone size={11} />
                    {patient.phone}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div style={{
                borderTop: '1px solid #f1f5f9',
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Calendar size={12} />
                    Total Visits
                  </span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#111827'
                  }}>
                    {patient.total_visits || 0}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Clock size={12} />
                    Last Visit
                  </span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#475569'
                  }}>
                    {patient.last_visit
                      ? new Date(patient.last_visit).toLocaleDateString()
                      : 'N/A'
                    }
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    fontWeight: 500
                  }}>
                    Appointments
                  </span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#6366f1',
                    backgroundColor: '#eef2ff',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {patient.appointments?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
