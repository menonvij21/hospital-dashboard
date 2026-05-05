'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
  Users, Calendar, Phone, CheckCircle,
  Activity, Clock, ArrowUpRight, Stethoscope,
  RefreshCw, TrendingUp, Zap, Star,
  Building, Globe, Award, Shield, Heart,
  Brain, Eye, Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

const API = process.env.NEXT_PUBLIC_API_URL

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100 }
  }
}

const iconMap: any = {
  Users, Calendar, Phone, CheckCircle, Activity,
  Clock, Stethoscope, TrendingUp, Heart, Brain, Eye
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('')

  const fetchData = async () => {
    try {
      const [s, a, c] = await Promise.all([
        axios.get(`${API}/api/dashboard/stats`),
        axios.get(`${API}/api/appointments?limit=5`),
        axios.get(`${API}/api/calls?limit=5`),
      ])
      setStats(s.data)
      setAppointments(a.data.appointments)
      setCalls(c.data.calls)
      setLastUpdated(
        new Date().toLocaleTimeString('en-AE', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Dubai'
        })
      )
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchData()
    const t = setInterval(fetchData, 30000)
    return () => clearInterval(t)
  }, [])

  const statCards = [
    {
      title: 'Total Appointments',
      value: stats?.total_appointments ?? 0,
      sub: `${stats?.todays_appointments ?? 0} booked today`,
      icon: 'Calendar',
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      lightBg: 'bg-blue-50',
      darkBg: 'bg-blue-500/10',
      textColor: 'text-blue-600',
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: 'Total Patients',
      value: stats?.total_patients ?? 0,
      sub: 'Registered in system',
      icon: 'Users',
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      lightBg: 'bg-emerald-50',
      darkBg: 'bg-emerald-500/10',
      textColor: 'text-emerald-600',
      trend: '+8.2%',
      trendUp: true
    },
    {
      title: 'AI Calls Handled',
      value: stats?.total_calls ?? 0,
      sub: `${stats?.todays_calls ?? 0} calls today`,
      icon: 'Phone',
      gradient: 'from-violet-500 via-purple-600 to-fuchsia-600',
      lightBg: 'bg-violet-50',
      darkBg: 'bg-violet-500/10',
      textColor: 'text-violet-600',
      trend: '+24.1%',
      trendUp: true
    },
    {
      title: 'Confirmed',
      value: stats?.confirmed ?? 0,
      sub: `${stats?.pending ?? 0} pending review`,
      icon: 'CheckCircle',
      gradient: 'from-orange-500 via-amber-600 to-yellow-600',
      lightBg: 'bg-orange-50',
      darkBg: 'bg-orange-500/10',
      textColor: 'text-orange-600',
      trend: '+5.3%',
      trendUp: true
    },
  ]

  if (!mounted) return null

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-8"
    >

      {/* Premium Page Header */}
      <motion.div variants={item}>
        <div className="flex flex-col md:flex-row md:items-center 
          md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br
                from-blue-500 to-purple-600 flex items-center
                justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r
                  from-gray-900 via-gray-800 to-gray-900
                  bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Real-time insights powered by AI
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <div className="flex items-center gap-2 bg-white
                border border-gray-200 rounded-xl px-4 py-2
                shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full
                  animate-pulse" />
                <span className="text-xs font-medium text-gray-600">
                  Updated {lastUpdated}
                </span>
              </div>
            )}
            <Button
              onClick={fetchData}
              className="bg-gradient-to-r from-blue-500 to-purple-600
                hover:from-blue-600 hover:to-purple-700 text-white
                shadow-lg shadow-blue-500/30 rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Ultra-Premium Stats Grid */}
      <motion.div variants={item}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = iconMap[card.icon]
          return (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="group"
            >
              <div className="relative overflow-hidden bg-white
                rounded-3xl border border-gray-100 shadow-sm
                hover:shadow-2xl hover:border-gray-200
                transition-all duration-300">
                
                {/* Gradient Border on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r
                  opacity-0 group-hover:opacity-100 transition-opacity
                  duration-300 rounded-3xl p-[1px] -z-10"
                  style={{
                    background: `linear-gradient(135deg, 
                      var(--tw-gradient-stops))`
                  }} />

                {/* Top Gradient Bar */}
                <div className={`h-1.5 bg-gradient-to-r ${card.gradient}`} />

                <div className="p-6">
                  {/* Icon and Trend */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl
                      ${card.lightBg} flex items-center justify-center
                      group-hover:scale-110 transition-transform
                      duration-300 shadow-sm`}>
                      <Icon className={`w-7 h-7 ${card.textColor}`} />
                    </div>
                    <div className="flex items-center gap-1.5
                      bg-green-50 text-green-700 px-2.5 py-1
                      rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">
                        {card.trend}
                      </span>
                    </div>
                  </div>

                  {/* Value */}
                  {loading ? (
                    <Skeleton className="h-10 w-24 mb-2" />
                  ) : (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <h3 className="text-4xl font-bold bg-gradient-to-br
                        from-gray-900 to-gray-600 bg-clip-text
                        text-transparent mb-1">
                        {card.value.toLocaleString()}
                      </h3>
                    </motion.div>
                  )}

                  {/* Title and Subtitle */}
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {card.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {card.sub}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-4 h-1.5 bg-gray-100 rounded-full
                    overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      className={`h-full bg-gradient-to-r ${card.gradient}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* AI Agent Status - Premium Card */}
      <motion.div variants={item}>
        <div className="relative overflow-hidden bg-gradient-to-br
          from-gray-900 via-blue-900 to-purple-900 rounded-3xl
          p-8 shadow-2xl">
          
          {/* Animated Background Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96
            bg-blue-500/20 rounded-full blur-3xl
            animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80
            bg-purple-500/20 rounded-full blur-3xl
            animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="relative grid grid-cols-1 lg:grid-cols-2
            gap-8 items-center">
            
            {/* Left: Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-3xl bg-blue-500/20
                    backdrop-blur-xl flex items-center justify-center
                    border border-white/10">
                    <Stethoscope className="w-8 h-8 text-blue-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5
                    bg-green-500 rounded-full border-4
                    border-gray-900 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Sara AI Agent
                  </h3>
                  <p className="text-blue-300 text-sm">
                    Voice Assistant • Active 24/7
                  </p>
                </div>
              </div>

              <p className="text-blue-200 leading-relaxed">
                Your AI-powered voice assistant is actively handling
                patient calls, booking appointments, and providing
                instant support in both English and Arabic.
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full
                    animate-pulse" />
                  <span className="text-white text-sm font-medium">
                    Online
                  </span>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <span className="text-blue-300 text-sm">
                  {stats?.todays_calls ?? 0} calls today
                </span>
                <div className="h-4 w-px bg-white/20" />
                <span className="text-blue-300 text-sm">
                  {stats?.todays_appointments ?? 0} appointments booked
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button className="bg-white text-gray-900
                  hover:bg-gray-100 shadow-lg">
                  <Zap className="w-4 h-4 mr-2" />
                  Configure Agent
                </Button>
                <Button variant="outline" className="border-white/20
                  text-white hover:bg-white/10">
                  View Analytics
                </Button>
              </div>
            </div>

            {/* Right: Live Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: 'Calls Today',
                  value: stats?.todays_calls ?? 0,
                  icon: Phone,
                  color: 'from-green-400 to-emerald-500'
                },
                {
                  label: 'Booked',
                  value: stats?.todays_appointments ?? 0,
                  icon: Calendar,
                  color: 'from-blue-400 to-cyan-500'
                },
                {
                  label: 'Avg Duration',
                  value: '3:24',
                  icon: Clock,
                  color: 'from-purple-400 to-pink-500'
                },
                {
                  label: 'Success Rate',
                  value: '98%',
                  icon: TrendingUp,
                  color: 'from-orange-400 to-amber-500'
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-xl
                    rounded-2xl p-5 border border-white/10
                    hover:bg-white/15 transition"
                >
                  <div className={`w-10 h-10 rounded-xl
                    bg-gradient-to-br ${stat.color}
                    flex items-center justify-center mb-3
                    shadow-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-blue-300 text-xs font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity - Ultra Modern Tables */}
      <motion.div variants={item}
        className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Appointments */}
        <div className="bg-white rounded-3xl border border-gray-100
          shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100
            flex items-center justify-between bg-gradient-to-r
            from-blue-50/50 to-purple-50/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900
                flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Recent Appointments
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Booked via Sara AI
              </p>
            </div>
            <Button variant="ghost" size="sm"
              className="text-blue-600 hover:text-blue-700
                hover:bg-blue-50 rounded-xl">
              View All
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : appointments.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl
                  flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-blue-400" />
                </div>
                <p className="font-semibold text-gray-900 mb-2">
                  No appointments yet
                </p>
                <p className="text-sm text-gray-500">
                  Appointments will appear here when Sara books them
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 rounded-2xl
                      bg-gray-50 hover:bg-gray-100 transition
                      border border-gray-100 hover:border-gray-200
                      cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl
                      bg-gradient-to-br from-blue-500 to-purple-600
                      flex items-center justify-center text-white
                      font-bold text-lg shadow-lg shadow-blue-500/30
                      flex-shrink-0">
                      {apt.patient_name?.charAt(0) || 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm
                        truncate">
                        {apt.patient_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {apt.doctor_name} • {apt.specialty}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline"
                          className="text-xs rounded-lg">
                          {apt.date}
                        </Badge>
                        <Badge variant="outline"
                          className="text-xs rounded-lg">
                          {apt.time}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={`text-xs rounded-lg
                          ${apt.status === 'confirmed'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : apt.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                            : 'bg-red-100 text-red-700 hover:bg-red-100'
                          }`}>
                        {apt.status}
                      </Badge>
                      <ArrowUpRight className="w-4 h-4 text-gray-400
                        group-hover:text-blue-600 transition" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Calls */}
        <div className="bg-white rounded-3xl border border-gray-100
          shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100
            flex items-center justify-between bg-gradient-to-r
            from-purple-50/50 to-pink-50/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900
                flex items-center gap-2">
                <Phone className="w-5 h-5 text-purple-600" />
                Recent AI Calls
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Sara Voice Activity
              </p>
            </div>
            <Button variant="ghost" size="sm"
              className="text-purple-600 hover:text-purple-700
                hover:bg-purple-50 rounded-xl">
              View All
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : calls.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-20 h-20 bg-purple-50 rounded-3xl
                  flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-10 h-10 text-purple-400" />
                </div>
                <p className="font-semibold text-gray-900 mb-2">
                  No calls yet
                </p>
                <p className="text-sm text-gray-500">
                  Call logs will appear here after first interaction
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {calls.map((call: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 rounded-2xl
                      bg-gray-50 hover:bg-gray-100 transition
                      border border-gray-100 hover:border-gray-200
                      cursor-pointer group"
                  >
                    <div className={`w-12 h-12 rounded-2xl
                      flex items-center justify-center shadow-lg
                      flex-shrink-0
                      ${call.call_type === 'inbound'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30'
                        : 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/30'
                      }`}>
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm
                        truncate">
                        {call.caller_phone || 'Unknown Number'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {call.outcome}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400
                          flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {call.duration || '--:--'}
                        </span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">
                          {call.language}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={`text-xs rounded-lg
                          ${call.call_type === 'inbound'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                          }`}>
                        {call.call_type}
                      </Badge>
                      {call.appointment_booked && (
                        <Badge className="text-xs rounded-lg
                          bg-emerald-100 text-emerald-700
                          hover:bg-emerald-100">
                          ✓ Booked
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bottom Quick Metrics */}
      <motion.div variants={item}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Today Appointments',
            value: stats?.todays_appointments ?? 0,
            icon: 'Calendar',
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-50'
          },
          {
            label: 'Today Calls',
            value: stats?.todays_calls ?? 0,
            icon: 'Activity',
            color: 'from-purple-500 to-pink-500',
            bg: 'bg-purple-50'
          },
          {
            label: 'Confirmed',
            value: stats?.confirmed ?? 0,
            icon: 'CheckCircle',
            color: 'from-green-500 to-emerald-500',
            bg: 'bg-green-50'
          },
          {
            label: 'Total Patients',
            value: stats?.total_patients ?? 0,
            icon: 'Users',
            color: 'from-orange-500 to-amber-500',
            bg: 'bg-orange-50'
          },
        ].map((metric, i) => {
          const Icon = iconMap[metric.icon]
          return (
            <motion.div
              key={i}
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white rounded-2xl border border-gray-100
                shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className={`h-1 bg-gradient-to-r ${metric.color}`} />
              <div className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${metric.bg}
                  flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  {loading ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.value}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {metric.label}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

    </motion.div>
  )
}