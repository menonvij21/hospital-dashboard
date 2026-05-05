'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Phone, Search, RefreshCw,
  PhoneIncoming, PhoneOutgoing
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCall, setSelectedCall] = useState<any>(null)

  const fetchCalls = async () => {
    try {
      const res = await axios.get(`${API}/api/calls?limit=100`)
      setCalls(res.data.calls)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCalls()
  }, [])

  const filtered = calls.filter(call =>
    call.caller_phone?.toLowerCase().includes(search.toLowerCase()) ||
    call.outcome?.toLowerCase().includes(search.toLowerCase())
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
            Call Logs
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {calls.length} total calls by Sara AI Agent
          </p>
        </div>
        <button
          onClick={fetchCalls}
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
            placeholder="Search by phone or outcome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200
              rounded-xl text-sm focus:outline-none focus:ring-2
              focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Calls List */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm
          border border-gray-100 overflow-hidden">

          {filtered.length === 0 ? (
            <div className="p-16 text-center text-gray-400">
              <Phone className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium text-lg">No calls yet</p>
              <p className="text-sm mt-2">
                Calls will appear here when patients
                call the AI agent
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((call: any, index: number) => (
                <div
                  key={index}
                  onClick={() => setSelectedCall(call)}
                  className={`p-4 hover:bg-gray-50 transition
                    cursor-pointer
                    ${selectedCall?.call_id === call.call_id
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : ''
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full
                        flex items-center justify-center
                        ${call.call_type === 'inbound'
                          ? 'bg-green-100'
                          : 'bg-blue-100'
                        }`}>
                        {call.call_type === 'inbound'
                          ? <PhoneIncoming className="w-4 h-4
                              text-green-600" />
                          : <PhoneOutgoing className="w-4 h-4
                              text-blue-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {call.caller_phone || 'Unknown Number'}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {call.outcome}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {new Date(call.created_at)
                            .toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-medium text-gray-700">
                        {call.duration || '--:--'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full
                        ${call.call_type === 'inbound'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-blue-50 text-blue-600'
                        }`}>
                        {call.call_type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {call.language}
                      </span>
                      {call.appointment_booked && (
                        <span className="text-xs px-2 py-0.5
                          rounded-full bg-green-100 text-green-700">
                          ✓ Booked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call Details */}
        <div className="bg-white rounded-2xl shadow-sm
          border border-gray-100 overflow-hidden h-fit">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Call Details</h2>
          </div>

          {selectedCall ? (
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase
                  font-semibold">Call ID</p>
                <p className="text-sm font-mono text-gray-700 mt-1">
                  {selectedCall.call_id}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase
                  font-semibold">Phone</p>
                <p className="text-sm text-gray-700 mt-1">
                  {selectedCall.caller_phone || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase
                  font-semibold">Type</p>
                <span className={`text-xs px-2 py-1 rounded-full
                  ${selectedCall.call_type === 'inbound'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                  }`}>
                  {selectedCall.call_type}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase
                  font-semibold">Duration</p>
                <p className="text-sm text-gray-700 mt-1">
                  {selectedCall.duration || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase
                  font-semibold">Outcome</p>
                <p className="text-sm text-gray-700 mt-1">
                  {selectedCall.outcome}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase
                  font-semibold">Language</p>
                <p className="text-sm text-gray-700 mt-1">
                  {selectedCall.language}
                </p>
              </div>
              {selectedCall.appointment_booked && (
                <div>
                  <p className="text-xs text-gray-500 uppercase
                    font-semibold">Appointment</p>
                  <span className="text-xs px-2 py-1 rounded-full
                    bg-green-100 text-green-700 mt-1 inline-block">
                    ✓ Booked - {selectedCall.appointment_id}
                  </span>
                </div>
              )}
              {selectedCall.transcript && (
                <div>
                  <p className="text-xs text-gray-500 uppercase
                    font-semibold mb-2">Transcript</p>
                  <div className="bg-gray-50 rounded-xl p-3
                    max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {selectedCall.transcript}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400">
              <Phone className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Click a call to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}