'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../lib/supabase-client'
import Navbar from '../../components/Navbar'

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('format_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      setHistory(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '3.5rem 2rem 5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="serif" style={{ fontSize: '2.4rem', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Riwayat format<em style={{ color: '#0F6E56' }}>.</em>
          </h1>
          <p style={{ color: '#6b7280', fontWeight: 300 }}>Semua dokumen yang pernah kamu format.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af', fontSize: 14 }}>Memuat riwayat...</div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '0.5px dashed rgba(0,0,0,0.15)', borderRadius: 12 }}>
            <div style={{ fontSize: 32, marginBottom: '1rem' }}>📄</div>
            <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Belum ada riwayat</p>
            <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: '1.5rem' }}>Format dokumen pertamamu sekarang.</p>
            <Link href="/upload" className="btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}>
              Upload Dokumen →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(0,0,0,0.09)', borderRadius: 12, overflow: 'hidden' }}>
            {history.map((item, i) => (
              <div
                key={item.id}
                style={{ background: '#fff', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 14 }}
              >
                <div style={{ width: 36, height: 36, background: '#E1F5EE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
                  📄
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.original_filename}
                  </p>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                    {item.document_type} · {item.university}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>{formatDate(item.created_at)}</p>
                  <span style={{ fontSize: 11, color: '#0F6E56', background: '#E1F5EE', padding: '2px 8px', borderRadius: 10, marginTop: 4, display: 'inline-block' }}>
                    ✓ Terformat
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
