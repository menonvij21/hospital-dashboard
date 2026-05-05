'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Users, Search, RefreshCw } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API}/api/patients?limit=100`)
      setPatients(res.data.patients)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.toLowerCase().includes(search.toLowerCase())
  )

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
            Patients
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {patients.length} registered patients
          </p>
        </div>
        <button
          onClick={fetchPatients}
          className="flex items-center gap-2 bg-blue-500
            text-white px-4 py-2 rounded-xl text-sm
            font-medium hover:bg-blue-600 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm
        border border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400
            absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200
              rounded-xl text-sm focus:outline-none focus:ring-2
              focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Patients Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 shadow-sm
          border border-gray-100 text-center text-gray-400">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="font-medium text-lg">No patients yet</p>
          <p className="text-sm mt-2">
            Patient records will appear here when
            the AI agent books appointments
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2
          xl:grid-cols-3 gap-6">
          {filtered.map((patient: any, index: number) => (
            <div key={index}
              className="bg-white rounded-2xl p-6 shadow-sm
                border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-100
                  flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-xl">
                    {patient.name?.charAt(0) || 'P'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {patient.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {patient.phone}
                  </p>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Total Visits
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {patient.total_visits || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Last Visit
                  </span>
                  <span className="text-sm text-gray-700">
                    {patient.last_visit
                      ? new Date(patient.last_visit)
                          .toLocaleDateString()
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Appointments
                  </span>
                  <span className="text-sm font-medium text-blue-600">
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