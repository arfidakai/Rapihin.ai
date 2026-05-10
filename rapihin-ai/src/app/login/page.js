'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase-client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError('Email atau password salah.')
      setLoading(false)
    } else {
      router.push('/upload')
      router.refresh()
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="serif" style={{ fontSize: '1.5rem' }}>rapihin<span style={{ color: '#0F6E56' }}>.ai</span></span>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 500, marginTop: '1.5rem', marginBottom: '0.5rem' }}>Masuk ke akun</h1>
          <p style={{ fontSize: 14, color: '#6b7280', fontWeight: 300 }}>Belum punya akun? <Link href="/register" style={{ color: '#0F6E56' }}>Daftar sekarang</Link></p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem', fontSize: 13 }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Email</label>
              <input
                className="input"
                type="email"
                placeholder="kamu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ justifyContent: 'center', padding: '12px', fontSize: 14, marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Memproses...' : 'Masuk →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
