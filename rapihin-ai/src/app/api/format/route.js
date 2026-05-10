import { NextResponse } from 'next/server'
import mammoth from 'mammoth'
import { formatDocument, generateFeedback } from '../../../lib/formatter'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const university = formData.get('university') || 'National Standard'
    const extractedRulesRaw = formData.get('extracted_rules')
    const extractedRules = extractedRulesRaw ? JSON.parse(extractedRulesRaw) : null

    if (!file) return NextResponse.json({ error: 'File tidak ditemukan.' }, { status: 400 })

    const filename = file.name || ''
    if (!filename.endsWith('.doc') && !filename.endsWith('.docx')) {
      return NextResponse.json({ error: 'Hanya file .doc atau .docx.' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const result = await mammoth.extractRawText({ buffer })
    const lines = result.value.split('\n').filter(l => l.trim())
    const paragraphs = lines.map(text => ({ text, style: '' }))

    const outputBuffer = await formatDocument(paragraphs, university, extractedRules)
    const feedback = extractedRules ? generateFeedback(paragraphs, extractedRules) : null

    // Return formatted file as base64 + feedback JSON together
    const base64 = outputBuffer.toString('base64')

    return NextResponse.json({
      file: base64,
      filename: `formatted_${filename}`,
      feedback,
    })
  } catch (err) {
    console.error('Format error:', err)
    return NextResponse.json({ error: 'Gagal memformat: ' + err.message }, { status: 500 })
  }
}