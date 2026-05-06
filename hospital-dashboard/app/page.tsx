'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Phone, PhoneOff, Loader2, Stethoscope,
  Shield, Activity, Calendar, Users,
  Building, Clock, Sparkles, BarChart3,
  Zap, Languages, CheckCircle, Mic
} from 'lucide-react'

const AGENT_ID = "agent_b7aeab2c389d64e0ae9ec3d999"
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [isCalling, setIsCalling] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [error, setError] = useState('')
  const retellRef = useRef<any>(null)
  const timerRef = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isCalling) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
      setCallDuration(0)
    }
    return () => clearInterval(timerRef.current)
  }, [isCalling])

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const startCall = async () => {
    try {
      setError('')
      setIsLoading(true)
      const response = await fetch(`${API_URL}/create-web-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: AGENT_ID })
      })
      const data = await response.json()
      if (!data.access_token) {
        throw new Error('Failed to connect')
      }
      const { RetellWebClient } = await import('retell-client-js-sdk')
      retellRef.current = new RetellWebClient()
      retellRef.current.on('call_started', () => {
        setIsCalling(true)
        setIsLoading(false)
      })
      retellRef.current.on('call_ended', () => {
        setIsCalling(false)
        setIsLoading(false)
      })
      retellRef.current.on('error', () => {
        setError('Call disconnected')
        setIsCalling(false)
        setIsLoading(false)
      })
      await retellRef.current.startCall({
        accessToken: data.access_token
      })
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setIsLoading(false)
    }
  }

  const stopCall = () => {
    try { retellRef.current?.stopCall() } catch (e) {}
    setIsCalling(false)
    setIsLoading(false)
  }

  if (!mounted) return null

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#09090b',
      color: '#fafafa',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Background Effects */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {/* Top left glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        {/* Bottom right glow */}
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        {/* Center glow */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
      </div>

      {/* Nav */}
      <nav style={{
        position: 'relative',
        zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(9,9,11,0.8)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Stethoscope size={18} color="white" />
            </div>
            <span style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#fafafa',
              letterSpacing: '-0.02em'
            }}>
              Universal Hospital
            </span>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '100px',
              backgroundColor: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#22c55e'
              }}>
                Agent Live
              </span>
            </div>
            <Link href="/dashboard" style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#a1a1aa',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}>
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px 40px'
      }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '100px',
            backgroundColor: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            fontSize: '13px',
            fontWeight: 600,
            color: '#a5b4fc'
          }}>
            <Sparkles size={14} />
            AI-Powered Healthcare Voice Agent
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            margin: '0 auto 24px',
            maxWidth: '800px',
            color: '#fafafa'
          }}
        >
          Build Voice Agents
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #818cf8, #c084fc, #f0abfc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            for Healthcare
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            textAlign: 'center',
            fontSize: '18px',
            lineHeight: 1.7,
            color: '#71717a',
            maxWidth: '560px',
            margin: '0 auto 48px',
            fontWeight: 400
          }}
        >
          Sara handles patient calls, books appointments, and provides
          instant medical guidance — in English and Arabic, around the clock.
        </motion.p>

        {/* Agent Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            maxWidth: '400px',
            margin: '0 auto 80px',
            position: 'relative'
          }}
        >
          {/* Glow behind card */}
          {isCalling && (
            <div style={{
              position: 'absolute',
              inset: '-20px',
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
              borderRadius: '32px',
              filter: 'blur(20px)',
              animation: 'pulse 2s infinite'
            }} />
          )}

          <div style={{
            position: 'relative',
            backgroundColor: 'rgba(24,24,27,0.8)',
            backdropFilter: 'blur(40px)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden'
          }}>

            {/* Gradient line */}
            <div style={{
              height: '2px',
              background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)'
            }} />

            <div style={{ padding: '40px 32px 32px' }}>

              {/* Avatar */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <motion.div
                  animate={isCalling ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: isCalling
                      ? '0 0 40px rgba(99,102,241,0.4)'
                      : '0 0 20px rgba(99,102,241,0.2)'
                  }}
                >
                  {isCalling ? (
                    <Mic size={32} color="white" />
                  ) : (
                    <Stethoscope size={32} color="white" />
                  )}
                </motion.div>

                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#fafafa',
                  margin: '0 0 4px'
                }}>
                  Sara
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#52525b',
                  margin: 0,
                  fontWeight: 500
                }}>
                  Hospital Voice Agent
                </p>
              </div>

              {/* Status */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  backgroundColor: isCalling
                    ? 'rgba(34,197,94,0.1)'
                    : 'rgba(161,161,170,0.1)',
                  border: `1px solid ${isCalling
                    ? 'rgba(34,197,94,0.2)'
                    : 'rgba(161,161,170,0.15)'}`
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isCalling ? '#22c55e' : '#71717a',
                    animation: isCalling ? 'pulse 1s infinite' : 'none'
                  }} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: isCalling ? '#22c55e' : '#71717a'
                  }}>
                    {isCalling ? 'Connected' : isLoading ? 'Connecting...' : 'Ready to talk'}
                  </span>
                </div>
              </div>

              {/* Loading */}
              {isLoading && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px 0',
                  marginBottom: '16px'
                }}>
                  <Loader2
                    size={36}
                    color="#818cf8"
                    style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }}
                  />
                  <p style={{
                    fontSize: '14px',
                    color: '#52525b',
                    marginTop: '12px',
                    fontWeight: 500
                  }}>
                    Allow microphone access...
                  </p>
                </div>
              )}

              {/* Active Call */}
              {isCalling && (
                <div style={{
                  textAlign: 'center',
                  padding: '8px 0 24px'
                }}>
                  <p style={{
                    fontSize: '40px',
                    fontWeight: 800,
                    color: '#fafafa',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.05em',
                    margin: '0 0 20px'
                  }}>
                    {formatDuration(callDuration)}
                  </p>

                  {/* Visualizer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                    height: '40px',
                    marginBottom: '20px'
                  }}>
                    {Array.from({ length: 16 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scaleY: [0.2, 1, 0.4, 1.5, 0.2]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.06,
                          ease: 'easeInOut'
                        }}
                        style={{
                          width: '2px',
                          height: '32px',
                          borderRadius: '2px',
                          background: `linear-gradient(to top,
                            hsl(${240 + i * 6}, 80%, 70%),
                            hsl(${270 + i * 6}, 80%, 75%))`,
                          transformOrigin: 'center',
                          opacity: 0.8
                        }}
                      />
                    ))}
                  </div>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(34,197,94,0.08)',
                    border: '1px solid rgba(34,197,94,0.15)'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      animation: 'pulse 1s infinite'
                    }} />
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#22c55e'
                    }}>
                      Listening
                    </span>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.15)',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <span style={{
                    fontSize: '13px',
                    color: '#f87171',
                    fontWeight: 600
                  }}>
                    {error}
                  </span>
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={isCalling ? stopCall : startCall}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  borderRadius: '14px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  color: 'white',
                  background: isCalling
                    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                    : 'linear-gradient(135deg, #6366f1, #7c3aed)',
                  boxShadow: isCalling
                    ? '0 4px 20px rgba(239,68,68,0.25)'
                    : '0 4px 20px rgba(99,102,241,0.25)',
                  opacity: isLoading ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Connecting...
                  </>
                ) : isCalling ? (
                  <>
                    <PhoneOff size={16} />
                    End Call
                  </>
                ) : (
                  <>
                    <Phone size={16} />
                    Talk to Sara
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            maxWidth: '700px',
            margin: '0 auto 80px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          {[
            { value: '200+', label: 'Doctors', icon: Users },
            { value: '33', label: 'Specialties', icon: Building },
            { value: '24/7', label: 'Availability', icon: Clock },
            { value: '2', label: 'Languages', icon: Languages },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '24px 16px',
              textAlign: 'center',
              backgroundColor: 'rgba(9,9,11,0.9)'
            }}>
              <stat.icon size={16} color="#52525b"
                style={{ margin: '0 auto 8px' }} />
              <p style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#fafafa',
                margin: '0 0 2px',
                letterSpacing: '-0.02em'
              }}>
                {stat.value}
              </p>
              <p style={{
                fontSize: '11px',
                color: '#52525b',
                margin: 0,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            maxWidth: '800px',
            margin: '0 auto 80px'
          }}
        >
          <p style={{
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: '#3f3f46',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '32px'
          }}>
            Capabilities
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            {[
              { icon: Calendar, title: 'Appointment Booking', desc: 'Natural voice scheduling' },
              { icon: Languages, title: 'English & Arabic', desc: 'Bilingual conversations' },
              { icon: Zap, title: 'Smart Routing', desc: 'Symptom-based triage' },
              { icon: Shield, title: 'Secure & Private', desc: 'HIPAA compliant calls' },
              { icon: BarChart3, title: 'Live Analytics', desc: 'Real-time dashboard' },
              { icon: Activity, title: 'Always Online', desc: '24/7 availability' },
            ].map((f, i) => (
              <div key={i} style={{
                padding: '24px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.2s'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'
                }}
              >
                <f.icon size={18} color="#6366f1"
                  style={{ marginBottom: '12px' }} />
                <p style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#e4e4e7',
                  margin: '0 0 4px'
                }}>
                  {f.title}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#52525b',
                  margin: 0,
                  fontWeight: 500
                }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            textAlign: 'center',
            padding: '40px 0 20px',
            borderTop: '1px solid rgba(255,255,255,0.04)'
          }}
        >
          <p style={{
            fontSize: '13px',
            color: '#3f3f46',
            marginBottom: '20px',
            fontWeight: 500
          }}>
            See how Sara manages your hospital workflow
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <button
              onClick={startCall}
              disabled={isLoading || isCalling}
              style={{
                padding: '10px 24px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                color: 'white',
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: (isLoading || isCalling) ? 0.5 : 1
              }}
            >
              <Phone size={14} />
              Try Live Demo
            </button>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '10px 24px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#a1a1aa',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <BarChart3 size={14} />
                View Dashboard
              </button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '20px 24px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '12px',
          color: '#27272a',
          fontWeight: 500
        }}>
          Universal Hospital · Abu Dhabi, UAE · AI Voice Agent Demo
        </p>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}