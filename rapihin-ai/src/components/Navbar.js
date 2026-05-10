'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase-client'

export default function Navbar() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user)
        setName(data.user.user_metadata?.full_name || data.user.email)
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null)
      setName(session?.user?.user_metadata?.full_name || session?.user?.email || '')
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="navbar">
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="serif" style={{ fontSize: '1.25rem', color: '#1a1a1a', letterSpacing: '-0.02em' }}>
          rapihin<span style={{ color: '#0F6E56' }}>.ai</span>
        </span>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>
          Beranda
        </Link>
        <Link href="/upload" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>
          Upload
        </Link>
        {user ? (
          <>
            <Link href="/history" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>
              Riwayat
            </Link>
            <span style={{ fontSize: 13, color: '#9ca3af' }}>
              {name?.split(' ')[0]}
            </span>
            <button onClick={handleLogout} className="btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }}>
              Keluar
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>
              Masuk
            </Link>
            <Link href="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>
              Daftar
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
