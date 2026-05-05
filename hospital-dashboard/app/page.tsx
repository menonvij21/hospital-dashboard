'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Phone, Clock, Shield, Award, Globe, 
  Heart, Users, Stethoscope, Calendar, 
  Sparkles, Brain, Eye, Target, CheckCircle, 
  MessageCircle, Languages, Building, Menu, X, 
  Activity, ChevronRight, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

const specialties = [
  { name: 'Cardiology', icon: Heart, color: 'from-rose-500 to-red-600', shadow: 'shadow-red-500/20' },
  { name: 'Neurology', icon: Brain, color: 'from-violet-500 to-fuchsia-600', shadow: 'shadow-violet-500/20' },
  { name: 'Orthopedics', icon: Activity, color: 'from-blue-500 to-cyan-600', shadow: 'shadow-blue-500/20' },
  { name: 'Pediatrics', icon: Users, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
  { name: 'Dermatology', icon: Sparkles, color: 'from-pink-500 to-rose-500', shadow: 'shadow-pink-500/20' },
  { name: 'Dentistry', icon: Shield, color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/20' },
  { name: 'Ophthalmology', icon: Eye, color: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-500/20' },
  { name: 'General Medicine', icon: Stethoscope, color: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/20' },
]

const stats = [
  { value: '200+', label: 'Expert Doctors', icon: Users },
  { value: '33', label: 'Specialties', icon: Building },
  { value: '50K+', label: 'Happy Patients', icon: Heart },
  { value: '24/7', label: 'Emergency Care', icon: Clock },
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 selection:bg-indigo-500/30 overflow-hidden">
      
      {/* Background Ambient Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 w-full bg-[#030712]/80 backdrop-blur-xl 
          border-b border-white/10 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr 
                from-indigo-500 to-fuchsia-500 flex items-center 
                justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              <Stethoscope className="w-5 h-5 text-white" />
            </motion.div>
            <div className="hidden md:block">
              {/* ✅ FIX: was group-hover only, now always visible white */}
              <p className="font-bold text-lg tracking-tight text-white 
                group-hover:text-indigo-400 transition-colors">
                Universal Hospital
              </p>
              <p className="text-xs text-slate-400">Abu Dhabi, UAE</p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'Specialties', 'Doctors', 'About'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                /* ✅ FIX: bumped from slate-300 to slate-100 for contrast */
                className="text-sm font-medium text-slate-100 
                  hover:text-white transition-colors relative group py-2"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 
                  bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                  group-hover:w-full transition-all duration-300 ease-out" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hidden md:block">
              {/* ✅ FIX: text-slate-100 instead of slate-300 */}
              <Button variant="ghost" 
                className="text-slate-100 hover:text-white 
                  hover:bg-white/10 rounded-full px-6">
                Patient Portal
              </Button>
            </Link>
            <Button 
              className="bg-white text-slate-950 hover:bg-slate-200 
                font-semibold rounded-full px-6 
                shadow-[0_0_20px_rgba(255,255,255,0.2)] 
                transition-all hover:scale-105 hidden sm:flex">
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Button>
            
            {/* Mobile Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white bg-white/10 
                rounded-lg hover:bg-white/20 transition"
            >
              {mobileMenuOpen 
                ? <X className="w-5 h-5" /> 
                : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#0a0f1c] border-t border-white/10 
                px-6 py-4 space-y-3"
            >
              {['Home', 'Specialties', 'Doctors', 'About'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  /* ✅ FIX: full white text in mobile menu */
                  className="block text-white font-medium py-2 
                    hover:text-indigo-400 transition-colors"
                >
                  {link}
                </a>
              ))}
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" 
                  className="w-full text-white hover:bg-white/10 
                    rounded-full mt-2">
                  Patient Portal
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─────────────── HERO SECTION ─────────────── */}
      <section className="relative min-h-[100dvh] flex items-center 
        pt-24 pb-12 z-10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Left Content */}
            <div className="space-y-8 relative z-20">
              <motion.div variants={item}>
                <Badge className="bg-indigo-500/20 text-indigo-200 
                  border border-indigo-500/40 px-4 py-2 text-sm 
                  font-medium rounded-full flex items-center w-fit gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 
                    animate-pulse" />
                  {/* ✅ FIX: text-indigo-200 instead of indigo-300 */}
                  AI-Powered Healthcare
                </Badge>
              </motion.div>

              <motion.h1 
                variants={item} 
                /* ✅ FIX: explicit text-white so it is never invisible */
                className="text-6xl lg:text-7xl font-bold tracking-tighter 
                  leading-[1.1] text-white"
              >
                World-Class <br />
                <span className="text-transparent bg-clip-text 
                  bg-gradient-to-r from-indigo-400 via-fuchsia-400 
                  to-rose-400">
                  Healthcare
                </span><br />
                in Abu Dhabi
              </motion.h1>

              {/* ✅ FIX: slate-300 → slate-200 for better contrast */}
              <motion.p variants={item} 
                className="text-lg text-slate-200 max-w-xl leading-relaxed">
                Experience exceptional medical care with our team of{' '}
                <span className="text-white font-semibold">
                  200+ expert doctors
                </span>{' '}
                across{' '}
                <span className="text-white font-semibold">
                  33 specialties
                </span>. Now powered by Sara, your intelligent AI 
                voice assistant.
              </motion.p>

              <motion.div 
                variants={item} 
                className="flex flex-col sm:flex-row items-center 
                  gap-4 pt-2"
              >
                <Button 
                  className="w-full sm:w-auto bg-gradient-to-r 
                    from-indigo-500 to-fuchsia-500 
                    hover:from-indigo-400 hover:to-fuchsia-400 
                    text-white text-base h-14 px-8 rounded-full 
                    shadow-[0_0_30px_rgba(99,102,241,0.3)] 
                    transition-all 
                    hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </Button>
                
                {/* ✅ FIX: explicit text-white on outline button */}
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto h-14 px-8 rounded-full 
                    border-white/20 bg-white/5 hover:bg-white/10 
                    text-white backdrop-blur-md transition-all">
                  <Zap className="w-5 h-5 mr-2 text-fuchsia-400" />
                  Talk to Sara AI
                </Button>
              </motion.div>

              {/* Trust Badges */}
              {/* ✅ FIX: removed opacity-80 that was dimming the text */}
              <motion.div 
                variants={item} 
                className="flex items-center gap-6 pt-6 flex-wrap"
              >
                {[ 
                  { icon: Shield, text: 'JCI Accredited',  color: 'text-emerald-400' },
                  { icon: Award,  text: 'Award Winning',   color: 'text-amber-400'   },
                  { icon: Globe,  text: 'International',   color: 'text-blue-400'    }
                ].map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <badge.icon className={`w-5 h-5 ${badge.color}`} />
                    {/* ✅ FIX: text-white instead of slate-300 */}
                    <span className="text-sm font-medium text-white">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right - Hero Visual (Glassmorphic HUD) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, type: "spring" }}
              className="relative hidden lg:block"
            >
              <motion.div 
                animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }} 
                transition={{ duration: 6, repeat: Infinity, 
                  ease: "easeInOut" }}
                className="absolute -top-10 -right-10 w-32 h-32 
                  bg-gradient-to-br from-fuchsia-500/20 to-rose-500/20 
                  rounded-full blur-2xl"
              />

              <div className="relative bg-[#0a0f1c]/90 backdrop-blur-2xl 
                rounded-[2rem] p-8 border border-white/10 
                shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
                
                {/* Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr 
                  from-white/0 via-white/5 to-white/0 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full 
                      bg-indigo-500/20 flex items-center justify-center 
                      border border-indigo-500/30">
                      <Activity className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      {/* ✅ FIX: font-bold + explicit text-white */}
                      <h3 className="text-white font-bold text-base">
                        Live Hospital Status
                      </h3>
                      <p className="text-sm text-emerald-400 
                        flex items-center gap-1 mt-0.5">
                        <span className="w-2 h-2 rounded-full 
                          bg-emerald-400 animate-pulse" />
                        Optimal Operations
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} 
                      className="bg-white/5 rounded-2xl p-5 
                        border border-white/10 hover:bg-white/10 
                        transition-colors">
                      <stat.icon className="w-6 h-6 text-indigo-400 mb-3" />
                      {/* ✅ FIX: text-white font-bold */}
                      <p className="text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </p>
                      {/* ✅ FIX: slate-300 instead of slate-400 */}
                      <p className="text-sm text-slate-300">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── SPECIALTIES SECTION ─────────────── */}
      <section id="specialties" 
        className="py-32 relative z-10 bg-[#050b14]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="bg-fuchsia-500/20 text-fuchsia-200 
              border border-fuchsia-500/30 px-4 py-2 text-sm mb-6 
              font-medium rounded-full inline-flex items-center gap-2">
              <Target className="w-4 h-4" />
              Centers of Excellence
            </Badge>
            {/* ✅ FIX: explicit text-white */}
            <h2 className="text-4xl md:text-5xl font-bold text-white 
              mb-6 tracking-tight">
              33 Medical Specialties
            </h2>
            {/* ✅ FIX: slate-300 instead of slate-400 */}
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Comprehensive healthcare across every medical discipline, 
              equipped with state-of-the-art technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 
            lg:grid-cols-4 gap-6">
            {specialties.map((specialty, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-[#0d1424] rounded-3xl border border-white/10 
                  p-8 group cursor-pointer hover:border-indigo-500/40 
                  transition-all duration-300 
                  hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.3)] 
                  relative overflow-hidden"
              >
                {/* Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br 
                  ${specialty.color} opacity-0 group-hover:opacity-10 
                  transition-opacity duration-500`} />

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br 
                  ${specialty.color} flex items-center justify-center mb-6 
                  shadow-lg ${specialty.shadow} 
                  group-hover:scale-110 transition-transform duration-300`}>
                  <specialty.icon className="w-7 h-7 text-white" />
                </div>

                {/* ✅ FIX: plain text-white, remove the transparent hover 
                    trick that made text disappear on some browsers */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {specialty.name}
                </h3>

                <p className="text-sm text-slate-400 mb-4">
                  Expert care & advanced treatment
                </p>

                <div className="flex items-center text-sm 
                  text-indigo-400 font-medium opacity-0 -translate-x-4 
                  group-hover:opacity-100 group-hover:translate-x-0 
                  transition-all duration-300">
                  Explore Care 
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── AI SARA SECTION ─────────────── */}
      <section className="py-32 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b 
          from-[#050b14] to-[#030712] pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 
          w-[500px] h-[500px] bg-indigo-600/10 rounded-full 
          blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 
            gap-16 items-center">
            
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 z-10"
            >
              <Badge className="bg-cyan-500/20 text-cyan-200 
                border border-cyan-500/30 px-4 py-2 text-sm w-fit 
                font-medium rounded-full flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Meet Sara
              </Badge>
              
              {/* ✅ FIX: text-white on heading */}
              <h2 className="text-4xl md:text-5xl font-bold text-white 
                tracking-tight leading-[1.1]">
                Your Personal AI <br />
                <span className="text-transparent bg-clip-text 
                  bg-gradient-to-r from-cyan-400 to-indigo-400">
                  Health Assistant
                </span>
              </h2>

              {/* ✅ FIX: slate-200 for body copy */}
              <p className="text-lg text-slate-200 leading-relaxed">
                Say goodbye to waiting on hold. Sara is our conversational 
                AI trained to understand your symptoms, book appointments 
                instantly, and guide you to the right department in seconds.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  { title: "24/7 Availability", 
                    desc: "Book or reschedule appointments anytime.", 
                    icon: Clock },
                  { title: "Symptom Triage", 
                    desc: "Get matched with the exact specialist you need.", 
                    icon: Activity },
                  { title: "Multi-Lingual", 
                    desc: "Fluent in Arabic, English, Hindi, and more.", 
                    icon: Languages }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 p-4 rounded-2xl 
                      bg-white/[0.04] border border-white/10 
                      hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full 
                      bg-indigo-500/20 flex items-center justify-center 
                      shrink-0 border border-indigo-500/30">
                      <feature.icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      {/* ✅ FIX: font-semibold + text-white */}
                      <h4 className="text-white font-semibold mb-1">
                        {feature.title}
                      </h4>
                      {/* ✅ FIX: slate-300 */}
                      <p className="text-sm text-slate-300">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-6">
                <Button 
                  className="bg-indigo-500 hover:bg-indigo-400 
                    text-white font-semibold rounded-full px-8 h-12 
                    shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat with Sara
                </Button>
              </div>
            </motion.div>

            {/* Right - AI Voice Wave Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-[500px] flex items-center 
                justify-center"
            >
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  animate={{ 
                    scale: [1, 1.5, 1], 
                    opacity: [0.15, 0.4, 0.15] 
                  }}
                  transition={{ 
                    duration: 3, delay: ring * 0.5, 
                    repeat: Infinity, ease: "easeInOut" 
                  }}
                  className="absolute rounded-full 
                    border border-cyan-500/40"
                  style={{ 
                    width: `${ring * 120}px`, 
                    height: `${ring * 120}px` 
                  }}
                />
              ))}

              {/* Central AI Core */}
              <div className="relative w-32 h-32 bg-gradient-to-br 
                from-cyan-400 to-indigo-600 rounded-full flex items-center 
                justify-center shadow-[0_0_60px_rgba(34,211,238,0.5)] 
                z-10 cursor-pointer group">
                <motion.div 
                  animate={{ scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 2, repeat: Infinity, 
                    ease: "easeInOut" }}
                  className="absolute inset-0 bg-white/20 
                    rounded-full blur-md"
                />
                <Activity className="w-12 h-12 text-white z-10 
                  group-hover:scale-110 transition-transform" />
              </div>

              {/* Voice Waves */}
              <div className="absolute flex items-center gap-2 
                z-20 top-[62%]">
                {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                  <motion.div
                    key={bar}
                    animate={{ 
                      height: [10, Math.random() * 40 + 20, 10] 
                    }}
                    transition={{ 
                      duration: 1.5, repeat: Infinity, 
                      ease: "easeInOut", delay: bar * 0.1 
                    }}
                    className="w-1.5 bg-cyan-400 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────── CTA SECTION ─────────────── */}
      <section className="py-20 relative z-10 border-t border-white/10 
        bg-[#030712]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* ✅ FIX: text-white explicitly set */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to prioritize your health?
          </h2>
          {/* ✅ FIX: slate-300 */}
          <p className="text-slate-300 mb-8 max-w-xl mx-auto text-lg">
            Join 50,000+ patients who trust Universal Hospital for their 
            medical care. Booking an appointment takes less than 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center 
            justify-center gap-4">
            <Button 
              className="w-full sm:w-auto bg-white text-slate-950 
                hover:bg-slate-200 h-14 px-8 rounded-full font-semibold 
                text-base transition-all hover:scale-105">
              Book Your Visit
            </Button>
            {/* ✅ FIX: explicit text-white on outline button */}
            <Button 
              variant="outline" 
              className="w-full sm:w-auto h-14 px-8 rounded-full 
                border-white/20 hover:bg-white/10 text-white 
                transition-all">
              View Doctors
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}