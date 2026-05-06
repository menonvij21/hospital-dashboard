'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, PhoneOff, Loader2, X } from 'lucide-react'

const AGENT_ID = "agent_b7aeab2c389d64e0ae9ec3d999"
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function SaraVoiceAgent() {
  const [isCalling, setIsCalling] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [error, setError] = useState('')
  const retellRef = useRef<any>(null)
  const timerRef = useRef<any>(null)

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
      console.log('Web call response:', data)

      if (!data.access_token) {
        throw new Error('No access token received from server')
      }

      const { RetellWebClient } = await import('retell-client-js-sdk')

      retellRef.current = new RetellWebClient()

      retellRef.current.on('call_started', () => {
        console.log('✅ Call started')
        setIsCalling(true)
        setIsLoading(false)
      })

      retellRef.current.on('call_ended', () => {
        console.log('✅ Call ended')
        setIsCalling(false)
        setIsLoading(false)
      })

      retellRef.current.on('error', (e: any) => {
        console.error('❌ Call error:', e)
        setError('Call failed. Please try again.')
        setIsCalling(false)
        setIsLoading(false)
      })

      await retellRef.current.startCall({
        accessToken: data.access_token
      })

    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Something went wrong')
      setIsLoading(false)
    }
  }

  const stopCall = () => {
    try {
      retellRef.current?.stopCall()
    } catch (e) {
      console.error(e)
    }
    setIsCalling(false)
    setIsLoading(false)
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      zIndex: 99999
    }}>

      {/* Floating Button */}
      {!isOpen && (
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundColor: 'rgba(99, 102, 241, 0.4)',
            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
          }} />

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: 'relative',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)',
              color: 'white'
            }}
          >
            <Phone size={28} />
          </motion.button>

          <div style={{
            position: 'absolute',
            right: '75px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#1e293b',
            color: 'white',
            padding: '8px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255,255,255,0.1)',
            pointerEvents: 'none'
          }}>
            💬 Talk to Sara AI
          </div>
        </div>
      )}

      {/* Call Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              width: '320px',
              backgroundColor: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.2)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  🤖
                </div>
                <div>
                  <p style={{
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '20px',
                    margin: 0,
                    lineHeight: 1.2
                  }}>
                    Sara AI
                  </p>
                  <p style={{
                    color: 'rgba(196, 181, 253, 0.9)',
                    fontSize: '12px',
                    margin: 0,
                    marginTop: '2px',
                    fontWeight: 600
                  }}>
                    {isCalling ? '🟢 In Call' : 'Universal Hospital'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (isCalling) stopCall()
                  setIsOpen(false)
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>

              {/* Idle */}
              {!isCalling && !isLoading && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '18px',
                    textAlign: 'center',
                    margin: '0 0 8px 0'
                  }}>
                    How can Sara help you?
                  </p>
                  <p style={{
                    color: '#94a3b8',
                    fontSize: '14px',
                    textAlign: 'center',
                    margin: '0 0 20px 0',
                    lineHeight: 1.6
                  }}>
                    Book appointments, find doctors,
                    get help in English or Arabic
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    {[
                      { icon: '📅', text: 'Book Appointment' },
                      { icon: '👨‍⚕️', text: 'Find Doctor' },
                      { icon: '🚨', text: 'Emergency Help' },
                      { icon: '🌐', text: 'Arabic & English' },
                    ].map((feat, i) => (
                      <div key={i} style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        fontWeight: 700
                      }}>
                        <span style={{ fontSize: '16px' }}>{feat.icon}</span>
                        {feat.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading */}
              {isLoading && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px 0',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(99,102,241,0.2)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto'
                  }}>
                    <Loader2
                      size={32}
                      style={{
                        color: '#818cf8',
                        animation: 'spin 1s linear infinite'
                      }}
                    />
                  </div>
                  <p style={{
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '18px',
                    margin: '0 0 6px 0'
                  }}>
                    Connecting to Sara...
                  </p>
                  <p style={{
                    color: '#64748b',
                    fontSize: '13px',
                    margin: 0
                  }}>
                    Please allow microphone access
                  </p>
                </div>
              )}

              {/* Active Call */}
              {isCalling && (
                <div style={{
                  textAlign: 'center',
                  padding: '10px 0',
                  marginBottom: '20px'
                }}>
                  <p style={{
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '36px',
                    margin: '0 0 16px 0',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {formatDuration(callDuration)}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    height: '50px',
                    marginBottom: '16px'
                  }}>
                    {[1,2,3,4,5,6,7,8,9].map(i => (
                      <motion.div
                        key={i}
                        animate={{ scaleY: [0.4, 2, 0.4] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.08,
                          ease: 'easeInOut'
                        }}
                        style={{
                          width: '4px',
                          height: '40px',
                          borderRadius: '4px',
                          background: 'linear-gradient(to top, #6366f1, #a855f7)',
                          transformOrigin: 'center'
                        }}
                      />
                    ))}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    borderRadius: '12px',
                    padding: '8px 16px'
                  }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      animation: 'pulse 1s infinite'
                    }} />
                    <p style={{
                      color: '#22c55e',
                      fontWeight: 800,
                      fontSize: '14px',
                      margin: 0
                    }}>
                      Sara is listening...
                    </p>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}>
                  <p style={{
                    color: '#f87171',
                    fontWeight: 700,
                    fontSize: '13px',
                    margin: 0
                  }}>
                    ❌ {error}
                  </p>
                </div>
              )}

              {/* Main Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={isCalling ? stopCall : startCall}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  background: isCalling
                    ? 'linear-gradient(135deg, #ef4444, #ec4899)'
                    : 'linear-gradient(135deg, #6366f1, #a855f7)',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: isCalling
                    ? '0 0 30px rgba(239,68,68,0.4)'
                    : '0 0 30px rgba(99,102,241,0.4)',
                  opacity: isLoading ? 0.7 : 1,
                  marginBottom: '12px'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Connecting...
                  </>
                ) : isCalling ? (
                  <>
                    <PhoneOff size={20} />
                    End Call
                  </>
                ) : (
                  <>
                    <Phone size={20} />
                    Start Talking to Sara
                  </>
                )}
              </motion.button>

              <p style={{
                color: '#475569',
                fontSize: '11px',
                textAlign: 'center',
                margin: 0
              }}>
                🔒 Secure · Powered by Universal Hospital AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
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