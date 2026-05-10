import Link from 'next/link'
import Navbar from '../components/Navbar'

const STEPS = [
  { n: '01', title: 'Upload dokumen', desc: 'Drag & drop file .docx kamu ke halaman upload.' },
  { n: '02', title: 'Pilih template', desc: 'Pilih jenis dokumen dan template universitas yang sesuai.' },
  { n: '03', title: 'Download hasil', desc: 'Dokumenmu terformat otomatis dan siap didownload dalam detik.' },
]

const FEATURES = [
  { icon: '✦', title: 'Margin & spasi otomatis', desc: 'Margin 4-3-3-3 cm, spasi 2.0, indent paragraf — semua disesuaikan sesuai panduan.' },
  { icon: '✦', title: 'Font standar akademik', desc: 'Times New Roman 12pt diaplikasikan ke seluruh dokumen termasuk heading.' },
  { icon: '✦', title: 'Template universitas', desc: 'UI, ITB, UGM, dan Standar Nasional — format berbeda untuk setiap institusi.' },
  { icon: '✦', title: 'Riwayat formatting', desc: 'Login untuk menyimpan semua dokumen yang pernah kamu format.' },
]

const UNIVERSITIES = ['Universitas Indonesia', 'ITB', 'UGM', 'Standar Nasional', 'UNPAD', 'ITS', 'UNDIP', 'UNAIR']

export default function Home() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 2.5rem 4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div className="fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#E1F5EE', color: '#0F6E56', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20, marginBottom: '1.5rem', letterSpacing: '0.06em' }}>
            ✦ HACKATHON PROJECT 2025
          </div>
          <h1 className="serif" style={{ fontSize: '3.4rem', lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: '1.25rem' }}>
            Format skripsi<br />dalam <em style={{ color: '#0F6E56' }}>hitungan<br />detik.</em>
          </h1>
          <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.75, marginBottom: '2rem', fontWeight: 300, maxWidth: 420 }}>
            Upload dokumen, pilih template universitas, dan biarkan AI yang urus margin, heading, spasi, dan semua aturan format yang bikin pusing.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/upload" className="btn-primary" style={{ fontSize: 15, padding: '12px 26px' }}>
              Upload Sekarang →
            </Link>
            <Link href="#cara-kerja" className="btn-ghost" style={{ fontSize: 14 }}>
              Cara Kerja
            </Link>
          </div>
        </div>

        {/* Before/After visual */}
        <div className="fade-up delay-2" style={{ background: '#f9fafb', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.09)', padding: '1.5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -12, right: 16, background: '#0F6E56', color: '#E1F5EE', fontSize: 11, fontWeight: 500, padding: '4px 12px', borderRadius: 20 }}>
            ⚡ Sedang memformat...
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '0.5px solid rgba(0,0,0,0.09)' }}>
            <div style={{ width: 32, height: 32, background: '#E1F5EE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📄</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Bab_I_Pendahuluan.docx</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Universitas Indonesia · Format S1</div>
            </div>
          </div>
          {[
            ['Font & ukuran', 'Arial 11pt', 'Times New Roman 12pt'],
            ['Margin halaman', '2cm semua sisi', '4-3-3-3 cm'],
            ['Spasi baris', 'Single (1.0)', 'Double (2.0)'],
            ['Heading style', 'Manual bold', 'Heading 1 caps 14pt'],
            ['Indent paragraf', 'Tidak ada', '1.25cm pertama'],
          ].map(([label, before, after]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: 12, color: '#6b7280', flex: 1 }}>{label}</span>
              <span style={{ fontSize: 11, color: '#991B1B', background: '#FEF2F2', padding: '2px 8px', borderRadius: 4, textDecoration: 'line-through' }}>{before}</span>
              <span style={{ fontSize: 11, color: '#6b7280' }}>→</span>
              <span style={{ fontSize: 11, color: '#0F6E56', background: '#E1F5EE', padding: '2px 8px', borderRadius: 4 }}>{after}</span>
            </div>
          ))}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '0.5px solid rgba(0,0,0,0.09)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>5 aturan diperbaiki otomatis</span>
            <span style={{ fontSize: 12, color: '#0F6E56', fontWeight: 500 }}>✓ Selesai dalam 3 detik</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.09)', borderBottom: '0.5px solid rgba(0,0,0,0.09)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
        {[
          ['4+', 'Template universitas'],
          ['< 5s', 'Waktu format rata-rata'],
          ['100%', 'Sesuai panduan resmi'],
        ].map(([num, label]) => (
          <div key={label} style={{ padding: '2rem 2.5rem', borderRight: '0.5px solid rgba(0,0,0,0.09)' }}>
            <div className="serif" style={{ fontSize: '2.5rem', color: '#0F6E56', marginBottom: '0.25rem' }}>{num}</div>
            <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 300 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <section id="cara-kerja" style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 2.5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 className="serif" style={{ fontSize: '2.2rem', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Cara kerja</h2>
          <p style={{ color: '#6b7280', fontWeight: 300 }}>Tiga langkah mudah untuk dokumen yang rapi.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(0,0,0,0.09)' }}>
          {STEPS.map(({ n, title, desc }) => (
            <div key={n} style={{ background: '#fff', padding: '2rem' }}>
              <div className="serif" style={{ fontSize: '3rem', color: '#E1F5EE', marginBottom: '1rem', lineHeight: 1 }}>{n}</div>
              <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: '#f9fafb', borderTop: '0.5px solid rgba(0,0,0,0.09)', borderBottom: '0.5px solid rgba(0,0,0,0.09)', padding: '5rem 2.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <h2 className="serif" style={{ fontSize: '2.2rem', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Fitur utama</h2>
            <p style={{ color: '#6b7280', fontWeight: 300 }}>Semua yang kamu butuhkan untuk dokumen akademik yang sempurna.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 36, height: 36, background: '#E1F5EE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F6E56', flexShrink: 0 }}>{icon}</div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: '0.4rem' }}>{title}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65, fontWeight: 300 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Universities */}
      <section style={{ padding: '3rem 2.5rem', borderBottom: '0.5px solid rgba(0,0,0,0.09)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '1.25rem' }}>Template universitas yang didukung</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {UNIVERSITIES.map(u => (
              <span key={u} style={{ fontSize: 13, color: '#6b7280', background: '#f9fafb', padding: '6px 16px', borderRadius: 20, border: '0.5px solid rgba(0,0,0,0.09)' }}>{u}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 2.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 className="serif" style={{ fontSize: '2.8rem', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.1 }}>
            Mulai format<br /><em style={{ color: '#0F6E56' }}>sekarang.</em>
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem', fontWeight: 300, lineHeight: 1.7 }}>
            Gratis untuk semua mahasiswa. Tidak perlu install apapun. Upload dan download dalam detik.
          </p>
          <Link href="/upload" className="btn-primary" style={{ fontSize: 15, padding: '14px 32px' }}>
            Upload Dokumen →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid rgba(0,0,0,0.09)', padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="serif" style={{ fontSize: '1rem' }}>rapihin<span style={{ color: '#0F6E56' }}>.ai</span></span>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>Dibuat saat hackathon · 2025</span>
      </footer>
    </div>
  )
}
