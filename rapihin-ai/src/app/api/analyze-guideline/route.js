import { NextResponse } from 'next/server'
import mammoth from 'mammoth'

export const runtime = 'nodejs'
export const maxDuration = 30

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const SYSTEM_PROMPT = `Kamu adalah asisten yang bertugas mengekstrak aturan formatting dari author guideline jurnal akademik.

Baca teks author guideline berikut dan ekstrak SEMUA aturan formatting yang bisa ditemukan.

Kembalikan HANYA JSON (tanpa markdown, tanpa backtick, tanpa penjelasan) dengan struktur ini:
{
  "ambiguous": [],
  "rules": {
    "font": { "family": null, "size_pt": null },
    "margins": { "top_cm": null, "bottom_cm": null, "left_cm": null, "right_cm": null, "top_inch": null, "bottom_inch": null, "left_inch": null, "right_inch": null },
    "spacing": { "line_spacing": null, "line_spacing_value": null, "space_after_paragraph_pt": null },
    "paragraph": { "first_line_indent_cm": null, "alignment": null },
    "heading": { "font": null, "size_pt": null, "bold": null, "centered": null, "all_caps": null },
    "columns": null,
    "required_sections": [],
    "optional_sections": [],
    "word_limits": {},
    "citation_style": null,
    "other": []
  }
}

Aturan:
- Isi field dengan nilai yang ditemukan, biarkan null jika tidak disebutkan
- "ambiguous" berisi array string pertanyaan yang perlu ditanyakan ke user jika aturan tidak jelas
- "required_sections" berisi nama section yang wajib ada (misal: ["Abstract", "Keywords", "References"])
- "word_limits" berisi object misal: {"abstract": 250, "total": 8000}
- "citation_style" bisa: "APA", "IEEE", "Vancouver", "Chicago", "Harvard", atau null
- "line_spacing" bisa: "single", "1.5", "double"
- "alignment" bisa: "justified", "left", "center"
- "other" berisi aturan lain yang tidak masuk kategori di atas sebagai array string`

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('guideline')

    if (!file) {
      return NextResponse.json({ error: 'File guideline tidak ditemukan.' }, { status: 400 })
    }

    if (!file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
      return NextResponse.json({ error: 'Guideline harus berupa file .doc atau .docx.' }, { status: 400 })
    }

    // Extract text from guideline docx
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    let result
try {
  result = await mammoth.extractRawText({ buffer })
} catch {
  result = await mammoth.extractRawText({ buffer, options: { styleMap: [] } })
}
    const guidelineText = result.value.trim()

    if (!guidelineText || guidelineText.length < 50) {
      return NextResponse.json({ error: 'Teks guideline terlalu pendek atau tidak terbaca.' }, { status: 400 })
    }

    // Check if API key is set
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY environment variable is not set')
    }

    // Send to Groq
    const groqResponse = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `Berikut teks author guideline:\n\n${guidelineText.slice(0, 12000)}`
          }
        ],
        temperature: 0.1,
        max_tokens: 2048
      })
    })

    if (!groqResponse.ok) {
      const err = await groqResponse.json()
      console.error('Groq API Error Response:', err)
      throw new Error(err.error?.message || 'Groq API error')
    }

    const groqData = await groqResponse.json()
    const rawText = groqData.choices?.[0]?.message?.content || ''
    
    console.log('Raw Groq Response:', rawText.substring(0, 200))

    
// Parse JSON from Groq response
let parsed
try {
  // Extract JSON block dari response (apapun yang ada sebelum/sesudah)
  const jsonMatch = rawText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Tidak ada JSON ditemukan')
  parsed = JSON.parse(jsonMatch[0])
} catch {
  throw new Error('Gagal memparse respons AI. Coba lagi.')
}

    return NextResponse.json({ success: true, extracted: parsed })
  } catch (err) {
    console.error('Analyze guideline error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}