'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase-client'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    if (password.length < 6) { setError('Password minimal 6 karakter.'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (err) {
      setError(err.message)
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 500, marginTop: '1.5rem', marginBottom: '0.5rem' }}>Buat akun baru</h1>
          <p style={{ fontSize: 14, color: '#6b7280', fontWeight: 300 }}>Sudah punya akun? <Link href="/login" style={{ color: '#0F6E56' }}>Masuk</Link></p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem', fontSize: 13 }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Nama Lengkap</label>
              <input
                className="input"
                type="text"
                placeholder="Nama kamu"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
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
                placeholder="Minimal 6 karakter"
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
              {loading ? 'Membuat akun...' : 'Daftar Sekarang →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
