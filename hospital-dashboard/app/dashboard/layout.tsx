'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, Users,
  Phone, Bell, Search, Settings,
  Stethoscope, LogOut, ChevronLeft,
  Activity, BarChart3, Menu
} from 'lucide-react'

const navItems = [
  {
    label: 'OVERVIEW',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ]
  },
  {
    label: 'MANAGEMENT',
    items: [
      { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
      { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
      { name: 'Patients', href: '/dashboard/patients', icon: Users },
      { name: 'Call Logs', href: '/dashboard/calls', icon: Phone },
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
  const [time, setTime] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }))
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  const sidebarW = collapsed ? '72px' : '260px'

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>

      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside style={{
        width: sidebarW,
        minWidth: sidebarW,
        height: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 30,
        borderRight: '1px solid rgba(255,255,255,0.06)'
      }}>

        {/* ── Logo ── */}
        <div style={{
          padding: collapsed ? '20px 16px' : '20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          height: '72px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 20px rgba(99,102,241,0.3)'
          }}>
            <Stethoscope size={18} color="white" />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'white',
                margin: 0,
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em'
              }}>
                Universal Hospital
              </p>
              <p style={{
                fontSize: '11px',
                color: '#475569',
                margin: '1px 0 0',
                fontWeight: 500,
                whiteSpace: 'nowrap'
              }}>
                Admin Dashboard
              </p>
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav style={{
          flex: 1,
          padding: '16px 12px',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {navItems.map((section, sIdx) => (
            <div key={sIdx} style={{
              marginBottom: '24px'
            }}>
              {!collapsed && (
                <p style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#475569',
                  margin: '0 0 8px 12px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  {section.label}
                </p>
              )}

              {section.items.map((item) => {
                const active = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: collapsed ? '10px 0' : '10px 12px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        borderRadius: '10px',
                        marginBottom: '2px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: active
                          ? 'rgba(99,102,241,0.15)'
                          : 'transparent',
                        position: 'relative'
                      }}
                      onMouseEnter={e => {
                        if (!active) {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!active) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }
                      }}
                    >
                      {/* Active indicator */}
                      {active && (
                        <div style={{
                          position: 'absolute',
                          left: collapsed ? '50%' : '0',
                          transform: collapsed ? 'translateX(-50%)' : 'none',
                          top: collapsed ? 'auto' : '50%',
                          bottom: collapsed ? '-4px' : 'auto',
                          marginTop: collapsed ? '0' : '-10px',
                          width: collapsed ? '20px' : '3px',
                          height: collapsed ? '3px' : '20px',
                          borderRadius: '10px',
                          backgroundColor: '#6366f1',
                          boxShadow: '0 0 8px rgba(99,102,241,0.5)'
                        }} />
                      )}

                      <item.icon
                        size={18}
                        color={active ? '#818cf8' : '#64748b'}
                        style={{
                          flexShrink: 0,
                          transition: 'color 0.2s'
                        }}
                      />

                      {!collapsed && (
                        <span style={{
                          fontSize: '13px',
                          fontWeight: active ? 700 : 500,
                          color: active ? '#e0e7ff' : '#94a3b8',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          transition: 'color 0.2s'
                        }}>
                          {item.name}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* ── User Profile ── */}
        <div style={{
          padding: '16px 12px',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: collapsed ? '8px 0' : '8px 10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
            onMouseEnter={e =>
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e =>
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '12px',
              flexShrink: 0
            }}>
              A
            </div>
            {!collapsed && (
              <div style={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden'
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#e2e8f0',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  Admin
                </p>
                <p style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  color: '#64748b',
                  margin: '1px 0 0',
                  whiteSpace: 'nowrap'
                }}>
                  Super Admin
                </p>
              </div>
            )}
            {!collapsed && (
              <LogOut size={14} color="#475569" style={{ flexShrink: 0 }} />
            )}
          </div>
        </div>

        {/* ── Collapse Toggle ── */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute',
            right: '-14px',
            top: '28px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#1e293b',
            border: '2px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 40,
            transition: 'all 0.2s',
            color: '#94a3b8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#6366f1'
            e.currentTarget.style.borderColor = '#6366f1'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#1e293b'
            e.currentTarget.style.borderColor = '#334155'
            e.currentTarget.style.color = '#94a3b8'
          }}
        >
          <ChevronLeft
            size={14}
            style={{
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s'
            }}
          />
        </button>
      </aside>

      {/* ═══════════ MAIN ═══════════ */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0
      }}>

        {/* ── Top Bar ── */}
        <header style={{
          height: '72px',
          backgroundColor: 'white',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          flexShrink: 0
        }}>
          {/* Search */}
          <div style={{
            position: 'relative',
            width: '320px'
          }}>
            <Search
              size={15}
              color="#94a3b8"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
            <input
              placeholder="Search patients, doctors..."
              style={{
                width: '100%',
                padding: '9px 14px 9px 38px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0f172a',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#6366f1'
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#e2e8f0'
                e.currentTarget.style.backgroundColor = '#f8fafc'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Right */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {/* Time */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #f1f5f9',
              fontSize: '12px',
              fontWeight: 600,
              color: '#475569'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#22c55e'
              }} />
              {time}
            </div>

            {/* Notification */}
            <button style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: '1px solid #f1f5f9',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f8fafc'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = '#f1f5f9'
              }}
            >
              <Bell size={16} color="#64748b" />
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                border: '2px solid white'
              }} />
            </button>

            {/* Avatar */}
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(99,102,241,0.25)'
            }}>
              A
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: '28px',
          backgroundColor: '#f8fafc'
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}