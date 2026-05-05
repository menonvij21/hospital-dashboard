'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Users,
  Phone, Bell, Settings, Activity,
  Stethoscope, LogOut, Search,
  ChevronLeft, TrendingUp, Zap
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const menuItems = [
  {
    title: 'OVERVIEW',
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        badge: null,
        color: 'text-blue-400'
      },
      {
        name: 'Analytics',
        href: '/dashboard/analytics',
        icon: TrendingUp,
        badge: 'New',
        color: 'text-purple-400'
      },
    ]
  },
  {
    title: 'PATIENT MANAGEMENT',
    items: [
      {
        name: 'Appointments',
        href: '/dashboard/appointments',
        icon: Calendar,
        badge: null,
        color: 'text-green-400'
      },
      {
        name: 'Patients',
        href: '/dashboard/patients',
        icon: Users,
        badge: null,
        color: 'text-orange-400'
      },
      {
        name: 'Call Logs',
        href: '/dashboard/calls',
        icon: Phone,
        badge: 'Live',
        color: 'text-pink-400'
      },
    ]
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-AE', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Dubai'
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 
      via-blue-50/30 to-purple-50/20 overflow-hidden">

      {/* Premium Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        className="relative bg-white border-r border-gray-100
          shadow-xl flex flex-col z-20 flex-shrink-0"
      >
        {/* Gradient Top Bar */}
        <div className="h-1 bg-gradient-to-r from-blue-500 
          via-purple-500 to-pink-500" />

        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br
                from-blue-600 via-blue-500 to-purple-600
                flex items-center justify-center flex-shrink-0
                shadow-lg shadow-blue-500/50"
            >
              <Stethoscope className="w-6 h-6 text-white" />
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <p className="font-bold text-gray-900 text-base">
                    Universal Hospital
                  </p>
                  <p className="text-xs text-gray-500">
                    Admin Dashboard
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Stats Card */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-4 my-4"
            >
              <div className="bg-gradient-to-br from-blue-500 
                to-purple-600 rounded-2xl p-4 text-white
                shadow-lg shadow-blue-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4" />
                  <p className="text-xs font-semibold uppercase
                    tracking-wider">
                    System Status
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-90">
                      AI Agent
                    </span>
                    <Badge className="bg-green-400/20 text-green-200
                      hover:bg-green-400/30 text-xs">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-90">
                      Database
                    </span>
                    <Badge className="bg-green-400/20 text-green-200
                      hover:bg-green-400/30 text-xs">
                      Connected
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-8">
          {menuItems.map((section) => (
            <div key={section.title}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-bold text-gray-400
                      uppercase tracking-widest px-3 mb-3"
                  >
                    {section.title}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.name} href={item.href}>
                      <motion.div
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex items-center gap-3
                          px-3 py-3 rounded-xl cursor-pointer
                          transition-all duration-200 group
                          ${isActive
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                            : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <item.icon className={`w-5 h-5 flex-shrink-0
                          ${isActive ? 'text-white' : item.color}`} />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center
                                justify-between flex-1 min-w-0"
                            >
                              <span className="text-sm font-medium
                                truncate">
                                {item.name}
                              </span>
                              {item.badge && (
                                <Badge className={`text-[10px] px-2
                                  py-0.5
                                  ${isActive
                                    ? 'bg-white/20 text-white hover:bg-white/30'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  }`}>
                                  {item.badge}
                                </Badge>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`flex items-center gap-3 p-3 rounded-xl
              bg-gray-50 hover:bg-gray-100 cursor-pointer
              transition ${collapsed ? 'justify-center' : ''}`}
          >
            <Avatar className="w-10 h-10 flex-shrink-0
              ring-2 ring-blue-500/30">
              <AvatarFallback className="bg-gradient-to-br
                from-blue-500 to-purple-600 text-white
                text-sm font-bold">
                A
              </AvatarFallback>
            </Avatar>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-semibold text-gray-900
                    truncate">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Super Admin
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Settings className="w-4 h-4 text-gray-400
                    hover:text-gray-600 transition" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Collapse Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6
            bg-white rounded-full flex items-center
            justify-center shadow-lg border border-gray-200
            hover:border-blue-300 transition z-30"
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          </motion.div>
        </motion.button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Premium Header */}
        <header className="h-16 bg-white/80 backdrop-blur-xl
          border-b border-gray-100 flex items-center
          justify-between px-6 flex-shrink-0 shadow-sm">

          {/* Search */}
          <div className="relative w-96">
            <Search className="w-4 h-4 text-gray-400
              absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search anything..."
              className="pl-10 bg-gray-50 border-gray-200
                focus:bg-white rounded-xl text-sm h-10
                focus:ring-2 focus:ring-blue-500/20
                focus:border-blue-300"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Time */}
            <div className="hidden md:flex items-center gap-2
              bg-gray-50 rounded-xl px-4 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full
                animate-pulse" />
              <span className="text-sm font-medium text-gray-600">
                {currentTime}
              </span>
            </div>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 rounded-xl
                bg-gray-50 flex items-center justify-center
                hover:bg-gray-100 transition"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5
                w-2 h-2 bg-red-500 rounded-full animate-pulse
                ring-2 ring-white" />
            </motion.button>

            {/* Quick Actions */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2
                bg-gradient-to-r from-blue-500 to-purple-600
                text-white font-medium px-4 py-2.5 rounded-xl
                text-sm shadow-lg shadow-blue-500/30
                hover:shadow-xl transition"
            >
              <Zap className="w-4 h-4" />
              Quick Action
            </motion.button>

            {/* Avatar */}
            <Avatar className="w-10 h-10 cursor-pointer
              ring-2 ring-blue-500/20 hover:ring-blue-500/40
              transition">
              <AvatarFallback className="bg-gradient-to-br
                from-blue-500 to-purple-600 text-white
                text-sm font-bold">
                A
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content with Breadcrumb */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}