'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  ChevronLeft, ChevronRight, Calendar,
  Clock, User, RefreshCw, Plus, X,
  CheckCircle, AlertCircle
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

const DOCTORS = [
  { name: 'Dr. Mohammed Al Rashidi', specialty: 'Cardiology' },
  { name: 'Dr. Priya Sharma', specialty: 'Cardiology' },
  { name: 'Dr. Khalid Al Zaabi', specialty: 'Orthopedic Surgery' },
  { name: 'Dr. Ahmed Al Mansouri', specialty: 'Rheumatology' },
  { name: 'Dr. Hessa Al Qubaisi', specialty: 'Obstetrics & Gynecology' },
  { name: 'Dr. Moza Al Ketbi', specialty: 'Neurology' },
  { name: 'Dr. Amna Al Marzooqi', specialty: 'Paediatrics' },
  { name: 'Dr. Mansoor Al Bloushi', specialty: 'Gastroenterology' },
  { name: 'Dr. Aisha Al Muhairi', specialty: 'Dermatology' },
  { name: 'Dr. Noura Al Shamsi', specialty: 'Ophthalmology' },
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarPage() {
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [calendarData, setCalendarData] = useState<any>({})
  const [loading, setLoading] = useState(false)

  // Slot booking states
  const [showBooking, setShowBooking] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0].name)
  const [slots, setSlots] = useState<any[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookingForm, setBookingForm] = useState({
    patient_name: '',
    patient_phone: '',
  })
  const [bookingStatus, setBookingStatus] = useState<{
    type: 'success' | 'error' | null,
    message: string
  }>({ type: null, message: '' })

  useEffect(() => {
    setMounted(true)
    const today = new Date()
    const dateStr = formatDate(today)
    setSelectedDate(dateStr)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchMonthData()
    }
  }, [currentDate, mounted])

  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      fetchSlots()
    }
  }, [selectedDate, selectedDoctor])

  const formatDate = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return ''
    const [y, m, d] = dateStr.split('-')
    return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`
  }

  const fetchMonthData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `${API}/api/calendar/month?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}`
      )
      setCalendarData(res.data.data || {})
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchSlots = async () => {
    try {
      setSlotsLoading(true)
      const res = await axios.get(
        `${API}/api/calendar/slots?doctor_name=${encodeURIComponent(selectedDoctor)}&date=${selectedDate}`
      )
      setSlots(res.data.slots || [])
    } catch (e) {
      console.error(e)
    } finally {
      setSlotsLoading(false)
    }
  }

  const handleBook = async () => {
    if (!selectedSlot || !bookingForm.patient_name || !bookingForm.patient_phone) {
      setBookingStatus({ type: 'error', message: 'Please fill all fields and select a time slot' })
      return
    }

    try {
      const doctor = DOCTORS.find(d => d.name === selectedDoctor)
      const res = await axios.post(`${API}/api/calendar/book`, {
        doctor_name: selectedDoctor,
        date: selectedDate,
        time: selectedSlot,
        patient_name: bookingForm.patient_name,
        patient_phone: bookingForm.patient_phone,
        specialty: doctor?.specialty || 'General Medicine'
      })

      if (res.data.success) {
        setBookingStatus({ type: 'success', message: `Appointment confirmed for ${bookingForm.patient_name}!` })
        setBookingForm({ patient_name: '', patient_phone: '' })
        setSelectedSlot('')
        fetchSlots()
        fetchMonthData()
        setTimeout(() => {
          setShowBooking(false)
          setBookingStatus({ type: null, message: '' })
        }, 2000)
      } else {
        setBookingStatus({ type: 'error', message: res.data.error || 'Booking failed' })
      }
    } catch (e) {
      setBookingStatus({ type: 'error', message: 'Something went wrong. Try again.' })
    }
  }

  // Calendar grid calculations
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = formatDate(new Date())

  const getDateStr = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const getDayData = (day: number) => {
    const dateStr = getDateStr(day)
    return calendarData[dateStr] || null
  }

  if (!mounted) return null

  const selectedDayData = calendarData[selectedDate]

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
            Schedule Calendar
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#94a3b8',
            margin: 0,
            fontWeight: 500
          }}>
            Real appointments · Anti-double booking
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchMonthData}
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
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} />
            Refresh
          </button>
          <button
            onClick={() => setShowBooking(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
            }}
          >
            <Plus size={14} />
            Book Appointment
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        gap: '20px',
        alignItems: 'start'
      }}>

        {/* Calendar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          border: '1px solid #f1f5f9',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          {/* Month Navigation */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 800,
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              {MONTHS[month]} {year}
            </h3>
            <div style={{
              display: 'flex',
              gap: '4px',
              backgroundColor: '#f8fafc',
              padding: '4px',
              borderRadius: '10px'
            }}>
              <button
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'white'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                style={{
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6366f1',
                  cursor: 'pointer'
                }}
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'white'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div style={{ padding: '20px 24px' }}>
            {/* Day Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              marginBottom: '12px',
              gap: '4px'
            }}>
              {DAYS.map(day => (
                <div key={day} style={{
                  textAlign: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '8px 0'
                }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px'
            }}>
              {/* Blank cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`blank-${i}`} style={{ aspectRatio: '1' }} />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1
                const dateStr = getDateStr(day)
                const dayData = getDayData(day)
                const isSelected = selectedDate === dateStr
                const isToday = today === dateStr
                const hasAppts = dayData && dayData.total > 0

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      border: isSelected
                        ? '2px solid #6366f1'
                        : isToday
                        ? '2px solid #e0e7ff'
                        : '2px solid transparent',
                      backgroundColor: isSelected
                        ? '#6366f1'
                        : isToday
                        ? '#eef2ff'
                        : hasAppts
                        ? '#fafbff'
                        : 'transparent',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#f8fafc'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = isToday
                          ? '#eef2ff'
                          : hasAppts ? '#fafbff' : 'transparent'
                      }
                    }}
                  >
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: isSelected ? 'white' : isToday ? '#6366f1' : '#374151'
                    }}>
                      {day}
                    </span>

                    {/* Appointment dots */}
                    {hasAppts && (
                      <div style={{
                        display: 'flex',
                        gap: '2px',
                        marginTop: '3px'
                      }}>
                        {dayData.confirmed > 0 && (
                          <div style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'rgba(255,255,255,0.8)' : '#10b981'
                          }} />
                        )}
                        {dayData.pending > 0 && (
                          <div style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'rgba(255,255,255,0.6)' : '#f59e0b'
                          }} />
                        )}
                        {dayData.cancelled > 0 && (
                          <div style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'rgba(255,255,255,0.4)' : '#ef4444'
                          }} />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #f8fafc'
            }}>
              {[
                { color: '#10b981', label: 'Confirmed' },
                { color: '#f59e0b', label: 'Pending' },
                { color: '#ef4444', label: 'Cancelled' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: item.color
                  }} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#94a3b8'
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Selected Day Appointments */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '14px',
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              padding: '16px 20px',
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
                  margin: '0 0 2px'
                }}>
                  {formatDisplayDate(selectedDate)}
                </h3>
                <p style={{
                  fontSize: '11px',
                  color: '#94a3b8',
                  margin: 0,
                  fontWeight: 500
                }}>
                  {selectedDayData
                    ? `${selectedDayData.total} appointment${selectedDayData.total > 1 ? 's' : ''}`
                    : 'No appointments'
                  }
                </p>
              </div>
              {selectedDayData && (
                <div style={{
                  display: 'flex',
                  gap: '6px'
                }}>
                  {selectedDayData.confirmed > 0 && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#ecfdf5',
                      color: '#059669'
                    }}>
                      {selectedDayData.confirmed} confirmed
                    </span>
                  )}
                  {selectedDayData.pending > 0 && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#fffbeb',
                      color: '#d97706'
                    }}>
                      {selectedDayData.pending} pending
                    </span>
                  )}
                </div>
              )}
            </div>

            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {!selectedDayData ? (
                <div style={{
                  padding: '32px 20px',
                  textAlign: 'center'
                }}>
                  <Calendar size={28} color="#d1d5db"
                    style={{ margin: '0 auto 10px' }} />
                  <p style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#94a3b8',
                    margin: 0
                  }}>
                    No appointments this day
                  </p>
                </div>
              ) : (
                selectedDayData.appointments.map((apt: any, i: number) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px',
                    borderBottom: i < selectedDayData.appointments.length - 1
                      ? '1px solid #f8fafc' : 'none'
                  }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '9px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '13px',
                      flexShrink: 0
                    }}>
                      {apt.patient?.charAt(0) || 'P'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#111827',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {apt.patient}
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
                        {apt.doctor} · {apt.time}
                      </p>
                    </div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: apt.status === 'confirmed'
                        ? '#ecfdf5' : apt.status === 'pending'
                        ? '#fffbeb' : '#fef2f2',
                      color: apt.status === 'confirmed'
                        ? '#059669' : apt.status === 'pending'
                        ? '#d97706' : '#dc2626',
                      textTransform: 'capitalize',
                      flexShrink: 0
                    }}>
                      {apt.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Available Slots */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '14px',
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #f8fafc'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 10px'
              }}>
                Doctor Availability
              </h3>
              <select
                value={selectedDoctor}
                onChange={e => setSelectedDoctor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#374151',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {DOCTORS.map(doc => (
                  <option key={doc.name} value={doc.name}>
                    {doc.name} · {doc.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div style={{
              padding: '12px 16px',
              maxHeight: '250px',
              overflowY: 'auto'
            }}>
              {slotsLoading ? (
                <p style={{
                  textAlign: 'center',
                  color: '#94a3b8',
                  fontSize: '12px',
                  padding: '20px 0'
                }}>
                  Loading slots...
                </p>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px'
                }}>
                  {slots.map((slot, i) => (
                    <div key={i} style={{
                      padding: '8px 6px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: slot.available ? 'pointer' : 'not-allowed',
                      backgroundColor: !slot.available
                        ? '#fef2f2'
                        : '#ecfdf5',
                      color: !slot.available
                        ? '#dc2626'
                        : '#059669',
                      border: `1px solid ${!slot.available
                        ? '#fecaca'
                        : '#d1fae5'
                      }`,
                      transition: 'all 0.15s',
                      opacity: slot.available ? 1 : 0.7
                    }}>
                      {slot.time}
                      {!slot.available && (
                        <div style={{
                          fontSize: '9px',
                          color: '#dc2626',
                          fontWeight: 600,
                          marginTop: '2px'
                        }}>
                          Booked
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            width: '480px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: '0 0 2px'
                }}>
                  Book Appointment
                </h2>
                <p style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  margin: 0,
                  fontWeight: 500
                }}>
                  {formatDisplayDate(selectedDate)}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowBooking(false)
                  setBookingStatus({ type: null, message: '' })
                  setSelectedSlot('')
                