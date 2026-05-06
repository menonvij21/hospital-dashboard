'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Users,
  Phone, ChevronLeft, ChevronRight,
  Bell, Activity, Stethoscope,
  LogOut, Moon, Sun, Search
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'

const menuItems = [
  {
    title: 'MAIN',
    items: [
      {
        name: 'Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
        badge: null
      },
      {
        name: 'Analytics',
        href: '/dashboard',
        icon: Activity,
        badge: 'Live'
      },
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      {
        name: 'Appointments',
        href: '/dashboard/appointments',
        icon: Calendar,
        badge: null
      },
      {
        name: 'Patients',
        href: '/dashboard/patients',
        icon: Users,
        badge: null
      },
      {
        name: 'Call Logs',
        href: '/dashboard/calls',
        icon: Phone,
        badge: null
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
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    setCurrentDate(
      new Date().toLocaleDateString('en-AE', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Dubai'
      })
    )
  }, [])

  return (
    <div className={`flex h-screen overflow-hidden
      ${darkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative flex flex-col h-full
          bg-gradient-to-b from-[#0f172a] to-[#1e293b]
          border-r border-white/5 shadow-2xl z-20 flex-shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6
          border-b border-white/10">
          <div className="w-10 h-10 rounded-2xl
            bg-gradient-to-br from-blue-500 to-blue-700
            flex items-center justify-center flex-shrink-0
            shadow-lg shadow-blue-500/30">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-white font-bold text-sm leading-tight">
                  Universal Hospital
                </p>
                <p className="text-blue-400 text-xs">Abu Dhabi, UAE</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {menuItems.map((section) => (
            <div key={section.title}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-bold text-slate-500
                      uppercase tracking-widest px-3 mb-2"
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
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.97 }}
                        className={`relative flex items-center gap-3
                          px-3 py-2.5 rounded-xl cursor-pointer
                          transition-all duration-200
                          ${isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center
                                justify-between flex-1 min-w-0"
                            >
                              <span className="text-sm font-medium truncate">
                                {item.name}
                              </span>
                              {item.badge && (
                                <span className="text-[10px] px-1.5
                                  py-0.5 rounded-full bg-blue-400/20
                                  text-blue-300 font-medium">
                                  {item.badge}
                                </span>
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

        {/* Bottom User */}
        <div className="p-3 border-t border-white/10">
          <div className={`flex items-center gap-3 p-2 rounded-xl
            hover:bg-white/10 cursor-pointer transition
            ${collapsed ? 'justify-center' : ''}`}>
            <Avatar className="w-9 h-9 flex-shrink-0
              ring-2 ring-blue-500/50">
              <AvatarFallback className="bg-blue-600 text-white
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
                  <p className="text-white text-sm font-medium truncate">
                    Admin
                  </p>
                  <p className="text-slate-400 text-xs truncate">
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
                  <LogOut className="w-4 h-4 text-slate-400
                    hover:text-white transition" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6
            bg-blue-600 rounded-full flex items-center
            justify-center shadow-lg border-2 border-[#0f172a]
            hover:bg-blue-500 transition z-30"
        >
          {collapsed
            ? <ChevronRight className="w-3 h-3 text-white" />
            : <ChevronLeft className="w-3 h-3 text-white" />
          }
        </button>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200
          flex items-center justify-between px-6
          flex-shrink-0 shadow-sm">

          {/* Search */}
          <div className="relative w-80">
            <Search className="w-4 h-4 text-gray-400
              absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search patients, doctors..."
              className="pl-10 bg-gray-50 border-gray-200
                focus:bg-white rounded-xl text-sm h-9"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-xl bg-gray-100
                flex items-center justify-center
                hover:bg-gray-200 transition"
            >
              {darkMode
                ? <Sun className="w-4 h-4 text-gray-600" />
                : <Moon className="w-4 h-4 text-gray-600" />
              }
            </button>

            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-xl
              bg-gray-100 flex items-center justify-center
              hover:bg-gray-200 transition">
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="absolute top-1.5 right-1.5
                w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* Date */}
            {mounted && (
              <div className="hidden md:flex items-center gap-2
                bg-gray-100 rounded-xl px-3 py-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">
                  {currentDate}
                </span>
              </div>
            )}

            {/* Avatar */}
            <Avatar className="w-9 h-9 cursor-pointer
              ring-2 ring-blue-500/30 hover:ring-blue-500 transition">
              <AvatarFallback className="bg-blue-600
                text-white text-sm font-bold">
                A
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}