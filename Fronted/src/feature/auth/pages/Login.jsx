import React, { useState } from 'react'
import { Link,useNavigate, Navigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'
 

/* ─── Teal accent ─────────────────────────────────── */
const TEAL = '#20e3b2'

/* ─── Reusable field wrapper ──────────────────────── */
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-zinc-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {label}
    </label>
    {children}
  </div>
)

/* ─── Eye icons ───────────────────────────────────── */
const EyeOff = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
)
const EyeOn = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

/* ─── Main component ──────────────────────────────── */
const Login = () => {
  const [formData, setFormData]     = useState({ identifier: '', password: '' })
  const [showPassword, setShowPw]   = useState(false)
  const [isLoading, setLoading]     = useState(false)
  const [focused, setFocused]       = useState('')

  const {user,loading} = useSelector((state) => state.auth);




  const navigate = useNavigate();

  const {handleLogin} = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);

    const payload = {
      identifier:formData.identifier,
      password:formData.password
    }

    try {
      await handleLogin(payload);
      navigate("/");
    } catch (err) {
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (name) => ({
    background: '#18181b',
    border: `1px solid ${focused === name ? TEAL : '#3f3f46'}`,
    boxShadow: focused === name ? `0 0 0 3px ${TEAL}22` : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    color: '#fff',
    outline: 'none',
  })

  if (!loading && user) {
    return <Navigate to="/" />
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0c0c0f', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ══ LEFT PANEL ══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-14 overflow-hidden"
           style={{ background: '#0f0f12' }}>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }} />

        {/* Animated orb */}
        <div className="anim-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
             style={{ background: `radial-gradient(circle, ${TEAL}30 0%, ${TEAL}08 50%, transparent 70%)`, filter: 'blur(40px)' }} />

        {/* Rotating ring */}
        <div className="anim-spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full pointer-events-none"
             style={{ border: `1px solid ${TEAL}18` }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${TEAL}20`, border: `1px solid ${TEAL}40` }}>
            <svg className="w-5 h-5" fill="none" stroke={TEAL} strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-white text-lg tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Perplexity</span>
        </div>

        {/* Center copy */}
        <div className="relative z-10 space-y-5">
          <div className="w-10 h-0.5 rounded-full" style={{ background: TEAL }} />
          <h2 className="text-4xl font-bold text-white leading-snug" style={{ fontFamily: "'Syne', sans-serif" }}>
            The knowledge you need,<br />
            <span style={{ color: TEAL }}>exactly when you need it.</span>
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
            Ask anything. Get instant, accurate answers backed by the live web — no fluff, just truth.
          </p>
        </div>

        {/* Stats row */}
        <div className="relative z-10 flex gap-8">
          {[
            { value: '10M+', label: 'Users' },
            { value: '1B+',  label: 'Answers' },
            { value: '4.9★', label: 'Rating' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{s.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ RIGHT PANEL ═════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 sm:px-12">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${TEAL}20`, border: `1px solid ${TEAL}40` }}>
            <svg className="w-5 h-5" fill="none" stroke={TEAL} strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-white text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>Perplexity</span>
        </div>

        {/* Form card */}
        <div className="anim-fade-up w-full max-w-[380px]">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Sign in</h1>
            <p className="text-zinc-500 text-sm mt-1.5">Enter your credentials to continue</p>
          </div>

          {/* Social buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button type="button"
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-medium text-zinc-200 transition-all duration-150 hover:text-white active:scale-[0.98]"
              style={{ background: '#1e1e22', border: '1px solid #3f3f46' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#52525b'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#3f3f46'}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button type="button"
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-medium text-zinc-200 transition-all duration-150 hover:text-white active:scale-[0.98]"
              style={{ background: '#1e1e22', border: '1px solid #3f3f46' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#52525b'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#3f3f46'}
            >
              <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-600">or sign in with email</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <Field label="Username or Email">
              <input
                type="text" name="identifier" id="identifier"
                value={formData.identifier} onChange={handleChange}
                placeholder="your@email.com" required autoComplete="username"
                onFocus={() => setFocused('identifier')} onBlur={() => setFocused('')}
                className="w-full rounded-xl px-4 py-2.5 text-sm placeholder-zinc-600"
                style={inputStyle('identifier')}
              />
            </Field>

            <Field label="Password">
              <div className="flex items-center justify-end mb-0.5">
                <a href="#" className="text-xs transition-colors" style={{ color: TEAL }}
                   onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                   onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} name="password" id="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="••••••••" required autoComplete="current-password"
                  onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                  className="w-full rounded-xl px-4 py-2.5 pr-11 text-sm placeholder-zinc-600"
                  style={inputStyle('password')}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#52525b' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
                  onMouseLeave={e => e.currentTarget.style.color = '#52525b'}>
                  {showPassword ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
            </Field>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mt-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: TEAL, color: '#051a14', boxShadow: `0 4px 20px ${TEAL}35` }}
              onMouseEnter={e => !isLoading && (e.currentTarget.style.boxShadow = `0 6px 28px ${TEAL}55`)}
              onMouseLeave={e => e.currentTarget.style.boxShadow = `0 4px 20px ${TEAL}35`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-zinc-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium transition-colors" style={{ color: TEAL }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;