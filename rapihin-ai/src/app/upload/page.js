'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../lib/supabase-client'
import Navbar from '../../components/Navbar'

const DOC_TYPES = ['Academic Papers', 'Thesis', 'Internship Report', 'Dissertation']
const UNIVERSITIES = ['National Standard', 'UI', 'ITB', 'UGM']

const SEVERITY_STYLE = {
  error:   { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA', icon: '✕' },
  warning: { bg: '#FFFBEB', color: '#92400E', border: '#FDE68A', icon: '⚠' },
  info:    { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE', icon: 'ℹ' },
}

export default function UploadPage() {
  const fileRef = useRef(null)
  const guidelineRef = useRef(null)

  const [file, setFile] = useState(null)
  const [guideline, setGuideline] = useState(null)
  const [mode, setMode] = useState('preset') // 'preset' | 'guideline'
  const [docType, setDocType] = useState('Academic Papers')
  const [university, setUniversity] = useState('National Standard')

  const [step, setStep] = useState('idle') // idle | analyzing | formatting | done
  const [extractedRules, setExtractedRules] = useState(null)
  const [ambiguous, setAmbiguous] = useState([])
  const [ambiguousAnswers, setAmbiguousAnswers] = useState({})
  const [feedback, setFeedback] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [downloadName, setDownloadName] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [draggingGuide, setDraggingGuide] = useState(false)

  const pickFile = (f, type) => {
    if (!f) return
    if (!f.name.endsWith('.doc') && !f.name.endsWith('.docx')) {
      setError('Hanya file .doc atau .docx yang diterima.')
      return
    }
    setError('')
    if (type === 'doc') { setFile(f); setDownloadUrl(null); setFeedback(null) }
    else { setGuideline(f) }
  }

  // Step 1: Analyze guideline with Gemini
  const handleAnalyze = async () => {
    if (!guideline) { setError('Upload file guideline terlebih dahulu.'); return }
    setStep('analyzing')
    setError('')
    setExtractedRules(null)
    setAmbiguous([])

    try {
      const fd = new FormData()
      fd.append('guideline', guideline)
      const res = await fetch('/api/analyze-guideline', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setExtractedRules(data.extracted.rules)
      if (data.extracted.ambiguous?.length > 0) {
        setAmbiguous(data.extracted.ambiguous)
        setStep('clarify')
      } else {
        setStep('ready')
      }
    } catch (err) {
      setError(err.message)
      setStep('idle')
    }
  }

  // Step 2: Format document
  const handleFormat = async () => {
    if (!file) { setError('Upload dokumen terlebih dahulu.'); return }
    if (mode === 'guideline' && !extractedRules) { setError('Analisis guideline dulu.'); return }

    setStep('formatting')
    setError('')

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('university', university)
      if (extractedRules) fd.append('extracted_rules', JSON.stringify(extractedRules))

      const res = await fetch('/api/format', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Decode base64 to blob
      const byteChars = atob(data.file)
      const byteArr = new Uint8Array(byteChars.length)
      for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i)
      const blob = new Blob([byteArr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      const url = URL.createObjectURL(blob)

      setDownloadUrl(url)
      setDownloadName(data.filename)
      setFeedback(data.feedback)
      setStep('done')

      // Auto download
      const a = document.createElement('a')
      a.href = url; a.download = data.filename
      document.body.appendChild(a); a.click(); document.body.removeChild(a)

      // Save history
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('format_history').insert({
          user_id: user.id,
          original_filename: file.name,
          document_type: docType,
          university: mode === 'guideline' ? `Guideline: ${guideline.name}` : university,
        })
      }
    } catch (err) {
      setError(err.message)
      setStep(mode === 'guideline' ? 'ready' : 'idle')
    }
  }

  const isLoading = step === 'analyzing' || step === 'formatting'

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '3.5rem 2rem 5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="serif" style={{ fontSize: '2.4rem', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Upload dokumen<em style={{ color: '#0F6E56' }}>.</em>
          </h1>
          <p style={{ color: '#6b7280', fontWeight: 300, lineHeight: 1.7 }}>
            Format otomatis sesuai panduan universitas atau author guideline jurnalmu.
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 0, marginBottom: '2rem', border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: 10, overflow: 'hidden' }}>
          {[
            { key: 'preset', label: '🎓 Template Universitas', desc: 'UI, ITB, UGM, Nasional' },
            { key: 'guideline', label: '📄 Upload Guideline', desc: 'Untuk jurnal / konferensi' },
          ].map(({ key, label, desc }) => (
            <button
              key={key}
              onClick={() => { setMode(key); setStep('idle'); setExtractedRules(null); setAmbiguous([]); setFeedback(null); setError('') }}
              style={{
                flex: 1, padding: '14px 16px', border: 'none', cursor: 'pointer',
                background: mode === key ? '#0F6E56' : '#fff',
                color: mode === key ? '#E1F5EE' : '#6b7280',
                transition: 'all 0.18s', textAlign: 'left',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{desc}</div>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <span>⚠</span> {error}
          </div>
        )}

        {/* Doc upload */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 8 }}>
            Dokumen kamu (.docx)
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); pickFile(e.dataTransfer.files[0], 'doc') }}
            style={{
              border: `1.5px dashed ${dragging ? '#0F6E56' : file ? '#9FE1CB' : 'rgba(0,0,0,0.15)'}`,
              borderRadius: 10, padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
              background: dragging ? '#E1F5EE' : file ? '#f0fdf8' : '#fafafa',
              transition: 'all 0.18s',
            }}
          >
            <input ref={fileRef} type="file" accept=".doc,.docx" style={{ display: 'none' }}
              onChange={(e) => pickFile(e.target.files[0], 'doc')} />
            <div style={{ fontSize: 24, marginBottom: 6 }}>{file ? '📄' : '⬆'}</div>
            {file ? (
              <>
                <p style={{ fontWeight: 500, fontSize: 13 }}>{file.name}</p>
                <p style={{ fontSize: 11, color: '#9ca3af' }}>{(file.size/1024).toFixed(0)} KB · klik untuk ganti</p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 500, fontSize: 13 }}>Drag & drop atau klik untuk pilih</p>
                <p style={{ fontSize: 11, color: '#9ca3af' }}>.doc / .docx · Maks 10MB</p>
              </>
            )}
          </div>
        </div>

        {/* PRESET MODE */}
        {mode === 'preset' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Jenis Dokumen</label>
                <select className="select" value={docType} onChange={e => setDocType(e.target.value)}>
                  {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Template Universitas</label>
                <select className="select" value={university} onChange={e => setUniversity(e.target.value)}>
                  {UNIVERSITIES.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleFormat} disabled={isLoading || !file} className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 15, opacity: (!file || isLoading) ? 0.6 : 1, cursor: (!file || isLoading) ? 'not-allowed' : 'pointer' }}>
              {step === 'formatting' ? <Spinner label="Memformat dokumen..." /> : 'Format Sekarang →'}
            </button>
          </>
        )}

        {/* GUIDELINE MODE */}
        {mode === 'guideline' && (
          <>
            {/* Guideline upload */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 8 }}>
                Author Guideline / Template Jurnal (.docx)
              </label>
              <div
                onClick={() => guidelineRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDraggingGuide(true) }}
                onDragLeave={() => setDraggingGuide(false)}
                onDrop={(e) => { e.preventDefault(); setDraggingGuide(false); pickFile(e.dataTransfer.files[0], 'guideline') }}
                style={{
                  border: `1.5px dashed ${draggingGuide ? '#0F6E56' : guideline ? '#9FE1CB' : 'rgba(0,0,0,0.15)'}`,
                  borderRadius: 10, padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
                  background: draggingGuide ? '#E1F5EE' : guideline ? '#f0fdf8' : '#fafafa',
                  transition: 'all 0.18s',
                }}
              >
                <input ref={guidelineRef} type="file" accept=".doc,.docx" style={{ display: 'none' }}
                  onChange={(e) => pickFile(e.target.files[0], 'guideline')} />
                <div style={{ fontSize: 24, marginBottom: 6 }}>{guideline ? '📋' : '📑'}</div>
                {guideline ? (
                  <>
                    <p style={{ fontWeight: 500, fontSize: 13 }}>{guideline.name}</p>
                    <p style={{ fontSize: 11, color: '#9ca3af' }}>{(guideline.size/1024).toFixed(0)} KB · klik untuk ganti</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontWeight: 500, fontSize: 13 }}>Upload author guideline dari jurnal</p>
                    <p style={{ fontSize: 11, color: '#9ca3af' }}>File .docx dengan instruksi formatting jurnal</p>
                  </>
                )}
              </div>
            </div>

            {/* Analyze button */}
            {!extractedRules && step !== 'clarify' && (
              <button onClick={handleAnalyze} disabled={isLoading || !guideline} className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 14, marginBottom: '1rem', opacity: (!guideline || isLoading) ? 0.6 : 1, cursor: (!guideline || isLoading) ? 'not-allowed' : 'pointer' }}>
                {step === 'analyzing' ? <Spinner label="AI sedang membaca guideline..." /> : '🔍 Analisis Guideline'}
              </button>
            )}

            {/* Ambiguous questions */}
            {step === 'clarify' && ambiguous.length > 0 && (
              <div className="card" style={{ marginBottom: '1.25rem', background: '#FFFBEB', borderColor: '#FDE68A' }}>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: '1rem', color: '#92400E' }}>
                  ⚠ Ada beberapa aturan yang tidak jelas di guideline. Tolong jawab dulu:
                </p>
                {ambiguous.map((q, i) => (
                  <div key={i} style={{ marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: 12, color: '#374151', display: 'block', marginBottom: 4 }}>{q}</label>
                    <input className="input" style={{ fontSize: 13 }} placeholder="Jawaban kamu..."
                      value={ambiguousAnswers[i] || ''}
                      onChange={e => setAmbiguousAnswers(prev => ({ ...prev, [i]: e.target.value }))} />
                  </div>
                ))}
                <button onClick={() => setStep('ready')} className="btn-primary" style={{ fontSize: 13, padding: '8px 16px', marginTop: 8 }}>
                  Lanjut →
                </button>
              </div>
            )}

            {/* Extracted rules preview */}
            {extractedRules && (step === 'ready' || step === 'done') && (
              <div className="card" style={{ marginBottom: '1.25rem', background: '#f0fdf8', borderColor: '#9FE1CB' }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#085041', marginBottom: '0.75rem' }}>
                  ✓ Guideline berhasil dianalisis — aturan yang ditemukan:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {extractedRules.font?.family && <Tag>{extractedRules.font.family} {extractedRules.font.size_pt}pt</Tag>}
                  {extractedRules.spacing?.line_spacing && <Tag>Spasi {extractedRules.spacing.line_spacing}</Tag>}
                  {extractedRules.margins?.top_cm && <Tag>Margin {extractedRules.margins.top_cm}cm</Tag>}
                  {extractedRules.margins?.top_inch && <Tag>Margin {extractedRules.margins.top_inch}"</Tag>}
                  {extractedRules.citation_style && <Tag>Sitasi {extractedRules.citation_style}</Tag>}
                  {extractedRules.columns && <Tag>{extractedRules.columns} kolom</Tag>}
                  {extractedRules.required_sections?.map(s => <Tag key={s}>§ {s}</Tag>)}
                </div>
              </div>
            )}

            {/* Format button (guideline mode) */}
            {(step === 'ready' || step === 'done') && (
              <button onClick={handleFormat} disabled={step === 'formatting' || !file} className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 15, opacity: (!file || step === 'formatting') ? 0.6 : 1, cursor: (!file || step === 'formatting') ? 'not-allowed' : 'pointer' }}>
                {step === 'formatting' ? <Spinner label="Memformat dokumen..." /> : 'Format Sekarang →'}
              </button>
            )}
          </>
        )}

        {/* Success + Feedback */}
        {step === 'done' && downloadUrl && (
          <div style={{ marginTop: '1.5rem' }}>
            <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
              <span>✓</span>
              <span>
                Dokumen berhasil diformat!{' '}
                <a href={downloadUrl} download={downloadName} style={{ color: '#0F6E56', textDecoration: 'underline' }}>
                  Download lagi
                </a>
              </span>
            </div>

            {feedback && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Auto-fixed */}
                {feedback.autoFixed?.length > 0 && (
                  <div className="card">
                    <p style={{ fontSize: 12, fontWeight: 500, color: '#065F46', marginBottom: '0.75rem' }}>
                      ✅ Auto-fixed ({feedback.autoFixed.length} item)
                    </p>
                    {feedback.autoFixed.map((item, i) => (
                      <div key={i} style={{ fontSize: 13, color: '#374151', padding: '4px 0', borderBottom: i < feedback.autoFixed.length - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none' }}>
                        • {item}
                      </div>
                    ))}
                  </div>
                )}

                {/* Needs attention */}
                {feedback.needsAttention?.length > 0 && (
                  <div className="card">
                    <p style={{ fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: '0.75rem' }}>
                      ⚠️ Perlu perhatianmu ({feedback.needsAttention.length} item)
                    </p>
                    {feedback.needsAttention.map((item, i) => {
                      const s = SEVERITY_STYLE[item.severity] || SEVERITY_STYLE.info
                      return (
                        <div key={i} style={{ fontSize: 13, padding: '8px 10px', borderRadius: 6, background: s.bg, color: s.color, border: `0.5px solid ${s.border}`, marginBottom: i < feedback.needsAttention.length - 1 ? 6 : 0 }}>
                          {s.icon} {item.message}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: '1.5rem' }}>
          <Link href="/login" style={{ color: '#0F6E56' }}>Login</Link> untuk menyimpan riwayat formatmu
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    </div>
  )
}

function Spinner({ label }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #9FE1CB', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      {label}
    </span>
  )
}

function Tag({ children }) {
  return (
    <span style={{ fontSize: 11, background: '#E1F5EE', color: '#085041', padding: '3px 10px', borderRadius: 12, fontWeight: 500 }}>
      {children}
    </span>
  )
}