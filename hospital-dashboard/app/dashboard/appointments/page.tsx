'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Calendar, Search,
  CheckCircle, XCircle,
  RefreshCw, Trash2
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API}/api/appointments?limit=100`)
      setAppointments(res.data.appointments)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`${API}/api/appointments/${id}`, { status })
      fetchAppointments()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteAppointment = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await axios.delete(`${API}/api/appointments/${id}`)
      fetchAppointments()
    } catch (error) {
      console.error('Error:', error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12
          border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Appointments
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {appointments.length} total appointments
          </p>
        </div>
        <button
          onClick={fetchAppointments}
          className="flex items-center gap-2 bg-blue-500
            text-white px-4 py-2 rounded-xl text-sm
            font-medium hover:bg-blue-600 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm
        border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400
              absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient, doctor, specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200
                rounded-xl text-sm focus:outline-none focus:ring-2
                focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'confirmed', 'pending', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium
                  capitalize transition
                  ${filter === s
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm
        border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-medium text-lg">No appointments found</p>
            <p className="text-sm mt-2">
              Appointments will appear here when
              the AI agent books them
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['ID', 'Patient', 'Doctor', 'Specialty',
                    'Date & Time', 'Language', 'Type',
                    'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left p-4 text-xs
                      font-semibold text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((apt: any, index: number) => (
                  <tr key={index}
                    className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <span className="text-xs font-mono text-gray-500">
                        {apt.appointment_id}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full
                          bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-xs">
                            {apt.patient_name?.charAt(0) || 'P'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {apt.patient_name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {apt.patient_phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {apt.doctor_name}
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1
                        bg-blue-50 text-blue-700 rounded-full">
                        {apt.specialty}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-700">{apt.date}</p>
                      <p className="text-xs text-gray-400">{apt.time}</p>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full
                        ${apt.language === 'Arabic'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                        }`}>
                        {apt.language}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full
                        ${apt.call_type === 'inbound'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-purple-50 text-purple-700'
                        }`}>
                        {apt.call_type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1
                        rounded-full font-medium
                        ${apt.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : apt.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                        }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateStatus(
                            apt.appointment_id, 'confirmed'
                          )}
                          className="p-1.5 rounded-lg bg-green-50
                            text-green-600 hover:bg-green-100"
                          title="Confirm"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(
                            apt.appointment_id, 'cancelled'
                          )}
                          className="p-1.5 rounded-lg bg-red-50
                            text-red-600 hover:bg-red-100"
                          title="Cancel"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAppointment(
                            apt.appointment_id
                          )}
                          className="p-1.5 rounded-lg bg-gray-50
                            text-gray-600 hover:bg-gray-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}