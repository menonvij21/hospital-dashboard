'use client'

import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' // Fallback for debugging

export default function DebugAppointmentsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<any>(null)

  const fetchAppointments = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('🔍 Fetching from:', `${API}/api/appointments?limit=100`)
      
      const res = await axios.get(`${API}/api/appointments?limit=100`, {
        timeout: 10000
      })
      
      console.log('✅ API Response:', res.data)
      setResponse(res.data)
      setData(res.data)
    } catch (err: any) {
      console.error('❌ API Error:', err.response?.data || err.message)
      setError(err.response?.data?.message || err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const testUpdate = async (id: string) => {
    try {
      console.log('🔄 Testing update for ID:', id)
      const res = await axios.patch(`${API}/api/appointments/${id}`, { 
        status: 'confirmed' 
      })
      console.log('✅ Update Response:', res.data)
      await fetchAppointments()
    } catch (err: any) {
      console.error('❌ Update Error:', err.response?.data || err.message)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return (
    <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-xl font-bold text-red-800 mb-4">API Error</h2>
      <pre className="bg-red-100 p-4 rounded text-sm text-red-900">{error}</pre>
      <button 
        onClick={fetchAppointments}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Retry
      </button>
    </div>
  )

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">Debug Info</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>API URL:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{API}</code>
          </div>
          <div>
            <strong>Response Structure:</strong>
            <pre className="text-xs mt-1 bg-blue-100 p-2 rounded">{JSON.stringify(response, null, 2)}</pre>
          </div>
        </div>
        <button 
          onClick={fetchAppointments}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
        >
          🔄 Refresh Data
        </button>
      </div>

      {data?.appointments?.length ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Appointments ({data.appointments.length})</h2>
          {data.appointments.map((apt: any) => (
            <div key={apt.appointment_id} className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <strong>Patient:</strong> {apt.patient_name || 'N/A'}
                </div>
                <div>
                  <strong>Doctor:</strong> {apt.doctor_name || 'N/A'}
                </div>
                <div>
                  <strong>ID:</strong> <code>{apt.appointment_id}</code>
                </div>
                <div>
                  <strong>Status:</strong> <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">{apt.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => testUpdate(apt.appointment_id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                >
                  Test Confirm
                </button>
                <button 
                  onClick={() => testUpdate(apt.appointment_id.replace('confirmed', 'cancelled'))}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                >
                  Test Cancel
                </button>
              </div>
              <details className="mt-4 p-3 bg-gray-50 rounded-lg">
                <summary className="cursor-pointer font-medium text-sm">Full Data</summary>
                <pre className="mt-2 text-xs overflow-auto max-h-40">{JSON.stringify(apt, null, 2)}</pre>
              </details>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📅</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No appointments</h3>
          <p className="text-gray-500 mb-4">Check your API response above</p>
          <p className="text-sm text-gray-400">Response: {JSON.stringify(data)}</p>
        </div>
      )}
    </div>
  )
}
          
