'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import axios, { AxiosError } from 'axios'
import {
  Calendar, Search, CheckCircle,
  XCircle, RefreshCw, Trash2,
  Clock, ArrowUpRight, Filter, AlertCircle
} from 'lucide-react'
import { toast } from 'sonner' // or your preferred toast library

const API = process.env.NEXT_PUBLIC_API_URL

// Types
interface Appointment {
  appointment_id: string
  patient_name: string
  patient_phone?: string
  doctor_name: string
  specialty: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

interface ApiResponse {
  appointments: Appointment[]
}

interface ApiError {
  message: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')
  const [mounted, setMounted] = useState(false)
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())

  // Status colors
  const statusColors = useMemo(() => ({
    confirmed: { bg: '#ecfdf5', color: '#059669', border: '#d1fae5' },
    pending: { bg: '#fffbeb', color: '#d97706', border: '#fef3c7' },
    cancelled: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
  }), [])

  const filters = useMemo(() => ['all', 'pending', 'confirmed', 'cancelled'], [])

  // Debounced search
  const debouncedSearch = useMemo(() => search.toLowerCase(), [search])

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get<ApiResponse>(`${API}/api/appointments?limit=100`, {
        timeout: 10000
      })
      setAppointments(res.data.appointments)
    } catch (error) {
      const err = error as AxiosError<ApiError>
      const message = err.response?.data?.message || err.message || 'Failed to fetch appointments'
      setError(message)
      toast.error('Failed to load appointments', { description: message })
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: Appointment['status']) => {
    if (updatingIds.has(id)) return
    
    setUpdatingIds(prev => new Set(prev).add(id))
    try {
      await axios.patch(`${API}/api/appointments/${id}`, { status }, {
        timeout: 5000
      })
      toast.success('Appointment updated successfully')
      await fetchAppointments()
    } catch (error) {
      const err = error as AxiosError<ApiError>
      const message = err.response?.data?.message || 'Failed to update appointment'
      toast.error('Update failed', { description: message })
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }, [updatingIds, fetchAppointments])

  const deleteAppointment = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) return
    
    try {
      await axios.delete(`${API}/api/appointments/${id}`, {
        timeout: 5000
      })
      toast.success('Appointment deleted successfully')
      await fetchAppointments()
    } catch (error) {
      const err = error as AxiosError<ApiError>
      const message = err.response?.data?.message || 'Failed to delete appointment'
      toast.error('Delete failed', { description: message })
    }
  }, [fetchAppointments])

  // Filtering logic
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchSearch =
        apt.patient_name.toLowerCase().includes(debouncedSearch) ||
        apt.doctor_name.toLowerCase().includes(debouncedSearch) ||
        apt.specialty.toLowerCase().includes(debouncedSearch)
      
      const matchFilter = filter === 'all' || apt.status === filter
      return matchSearch && matchFilter
    })
  }, [appointments, debouncedSearch, filter])

  // Effects
  useEffect(() => {
    setMounted(true)
    fetchAppointments()
  }, [fetchAppointments])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'r') {
          e.preventDefault()
          fetchAppointments()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fetchAppointments])

  if (!mounted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6 font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">
              Appointments
            </h1>
            <p className="text-sm font-medium text-slate-500">
              {appointments.length.toLocaleString()} total · {filteredAppointments.length.toLocaleString()} showing
            </p>
          </div>
          <button
            onClick={fetchAppointments}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            title="Refresh (Ctrl+R)"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search patient, doctor, specialty..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className="px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-100 capitalize
                  data-[active=true]:bg-white data-[active=true]:text-slate-900 data-[active=true]:shadow-sm data-[active=true]:ring-1 data-[active=true]:ring-indigo-500"
                data-active={filter === f}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-rose-900">{error}</p>
                <button
                  onClick={fetchAppointments}
                  className="mt-1 text-xs font-semibold text-rose-700 hover:text-rose-900 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-100 rounded-xl mb-4">
                <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
              </div>
              <p className="text-sm font-medium text-slate-500">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No appointments found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                {search || filter !== 'all' 
                  ? 'Try adjusting your search or filter' 
                  : 'Appointments will appear when patients book them'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[1.5fr_1.2fr_1fr_0.8fr_0.7fr_0.6fr_0.7fr] divide-y divide-slate-100">
                {/* Header */}
                <div className="grid grid-cols-[1.5fr_1.2fr_1fr_0.8fr_0.7fr_0.6fr_0.7fr] bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0 z-10">
                  {['Patient', 'Doctor', 'Specialty', 'Date', 'Time', 'Status', 'Actions'].map((header) => (
                    <div
                      key={header}
                      className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 first:pl-8 last:pr-8"
                    >
                      {header}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {filteredAppointments.map((apt, index) => {
                  const statusColor = statusColors[apt.status] || statusColors.pending
                  const isUpdating = updatingIds.has(apt.appointment_id)

                  return (
                    <div
                      key={apt.appointment_id}
                      className="grid grid-cols-[1.5fr_1.2fr_1fr_0.8fr_0.7fr_0.6fr_0.7fr] items-center hover:bg-slate-50/50 transition-all duration-150 group"
                    >
                      {/* Patient */}
                      <div className="flex items-center gap-3 px-6 py-4 first:pt-6 last:pb-6 first:pl-8 last:pr-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                          {apt.patient_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600">
                            {apt.patient_name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {apt.patient_phone || 'No phone'}
                          </p>
                        </div>
                      </div>

                      {/* Doctor */}
                      <div className="px-6 py-4 text-sm font-semibold text-slate-900 first:pl-8 last:pr-8 truncate">
                        {apt.doctor_name}
                      </div>

                      {/* Specialty */}
                      <div className="px-6 py-4 first:pl-8 last:pr-8">
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                          {apt.specialty}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="px-6 py-4 text-sm font-medium text-slate-700 first:pl-8 last:pr-8">
                        {apt.date || 'TBC'}
                      </div>

                      {/* Time */}
                      <div className="px-6 py-4 first:pl-8 last:pr-8">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{apt.time || 'TBC'}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="px-6 py-4 first:pl-8 last:pr-8">
                        <span
                          className="text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
                          style={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.color,
                          }}
                        >
                          {apt.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="px-6 py-4 first:pl-8 last:pr-8 flex gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateStatus(apt.appointment_id, 'confirmed')
                          }}
                          disabled={isUpdating}
                          className="w-9 h-9 rounded-lg border border-emerald-200 bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md group"
                          title="Confirm appointment"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateStatus(apt.appointment_id, 'cancelled')
                          }}
                          disabled={isUpdating}
                          className="w-9 h-9 rounded-lg border border-rose-200 bg-rose-50 flex items-center justify-center hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md group"
                          title="Cancel appointment"
                        >
                          <XCircle className="w-4 h-4 text-rose-600 group-hover:scale-110" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteAppointment(apt.appointment_id)
                          }}
                          disabled={isUpdating}
                          className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md group"
                          title="Delete appointment"
                        >
                          <Trash2 className="w-4 h-4 text-slate-600 group-hover:scale-110" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
