import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  HeadingLevel, convertInchesToTwip,
} from 'docx'

const PRESETS = {
  'National Standard': {
    font: 'Times New Roman', fontSize: 24, lineSpacing: 480,
    margins: { top: convertInchesToTwip(1.18), right: convertInchesToTwip(0.98), bottom: convertInchesToTwip(0.98), left: convertInchesToTwip(1.57) },
  },
  'UI': {
    font: 'Times New Roman', fontSize: 24, lineSpacing: 480,
    margins: { top: convertInchesToTwip(1.18), right: convertInchesToTwip(0.98), bottom: convertInchesToTwip(0.98), left: convertInchesToTwip(1.57) },
  },
  'ITB': {
    font: 'Times New Roman', fontSize: 24, lineSpacing: 360,
    margins: { top: convertInchesToTwip(1.18), right: convertInchesToTwip(0.98), bottom: convertInchesToTwip(0.98), left: convertInchesToTwip(1.57) },
  },
  'UGM': {
    font: 'Times New Roman', fontSize: 24, lineSpacing: 480,
    margins: { top: convertInchesToTwip(1.18), right: convertInchesToTwip(0.98), bottom: convertInchesToTwip(0.98), left: convertInchesToTwip(1.57) },
  },
}

function rulesToConfig(rules) {
  const cmToTwip = (cm) => convertInchesToTwip(cm / 2.54)
  const font = rules.font?.family || 'Times New Roman'
  const fontSize = rules.font?.size_pt ? rules.font.size_pt * 2 : 24

  let lineSpacing = 480
  if (rules.spacing?.line_spacing === 'single') lineSpacing = 240
  else if (rules.spacing?.line_spacing === '1.5') lineSpacing = 360
  else if (rules.spacing?.line_spacing === 'double') lineSpacing = 480

  let margins
  if (rules.margins?.top_cm) {
    margins = {
      top: cmToTwip(rules.margins.top_cm),
      bottom: cmToTwip(rules.margins.bottom_cm || rules.margins.top_cm),
      left: cmToTwip(rules.margins.left_cm || rules.margins.top_cm),
      right: cmToTwip(rules.margins.right_cm || rules.margins.top_cm),
    }
  } else if (rules.margins?.top_inch) {
    margins = {
      top: convertInchesToTwip(rules.margins.top_inch),
      bottom: convertInchesToTwip(rules.margins.bottom_inch || rules.margins.top_inch),
      left: convertInchesToTwip(rules.margins.left_inch || rules.margins.top_inch),
      right: convertInchesToTwip(rules.margins.right_inch || rules.margins.top_inch),
    }
  } else {
    margins = { top: convertInchesToTwip(1.18), bottom: convertInchesToTwip(0.98), left: convertInchesToTwip(1.57), right: convertInchesToTwip(0.98) }
  }

  const indent = rules.paragraph?.first_line_indent_cm
    ? cmToTwip(rules.paragraph.first_line_indent_cm)
    : convertInchesToTwip(0.49)

  const alignment = rules.paragraph?.alignment === 'left' ? AlignmentType.LEFT : AlignmentType.JUSTIFIED

  return { font, fontSize, lineSpacing, margins, indent, alignment }
}

export async function formatDocument(paragraphs, university = 'National Standard', extractedRules = null) {
  let config
  if (extractedRules) {
    config = rulesToConfig(extractedRules)
  } else {
    const preset = PRESETS[university] || PRESETS['National Standard']
    config = {
      font: preset.font, fontSize: preset.fontSize, lineSpacing: preset.lineSpacing,
      margins: preset.margins, indent: convertInchesToTwip(0.49), alignment: AlignmentType.JUSTIFIED,
    }
  }

  const formattedParagraphs = paragraphs.map((para) => {
    const text = para.text || ''
    const isHeading = /^(BAB|CHAPTER|ABSTRACT|ABSTRAK|KEYWORDS|KATA KUNCI|PENDAHULUAN|INTRODUCTION|METHODS|HASIL|RESULTS|DISCUSSION|CONCLUSION|REFERENCES|DAFTAR PUSTAKA)/i.test(text.trim()) && text.length < 100

    if (isHeading) {
      return new Paragraph({
        children: [new TextRun({
          text,
          font: extractedRules?.heading?.font || config.font,
          size: extractedRules?.heading?.size_pt ? extractedRules.heading.size_pt * 2 : 28,
          bold: extractedRules?.heading?.bold !== false,
          allCaps: extractedRules?.heading?.all_caps === true,
        })],
        alignment: extractedRules?.heading?.centered ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 240, line: config.lineSpacing },
      })
    }

    return new Paragraph({
      children: [new TextRun({ text, font: config.font, size: config.fontSize })],
      alignment: config.alignment,
      spacing: { line: config.lineSpacing, after: 0 },
      indent: { firstLine: config.indent },
    })
  })

  const doc = new Document({
    sections: [{
      properties: { page: { margin: config.margins } },
      children: formattedParagraphs.length > 0 ? formattedParagraphs : [new Paragraph({ text: '' })],
    }],
  })

  return Packer.toBuffer(doc)
}

export function generateFeedback(paragraphs, extractedRules) {
  const autoFixed = []
  const needsAttention = []
  const rules = extractedRules || {}

  if (rules.font?.family) autoFixed.push(`Font → ${rules.font.family} ${rules.font.size_pt}pt`)
  if (rules.margins?.top_cm || rules.margins?.top_inch) {
    const m = rules.margins
    const unit = m.top_cm ? 'cm' : 'inch'
    autoFixed.push(`Margin → ${m.top_cm||m.top_inch}-${m.bottom_cm||m.bottom_inch}-${m.left_cm||m.left_inch}-${m.right_cm||m.right_inch} ${unit}`)
  }
  if (rules.spacing?.line_spacing) {
    const labels = { single: 'Single (1.0)', '1.5': '1.5 spasi', double: 'Double (2.0)' }
    autoFixed.push(`Spasi baris → ${labels[rules.spacing.line_spacing] || rules.spacing.line_spacing}`)
  }
  if (rules.paragraph?.alignment) autoFixed.push(`Alignment → ${rules.paragraph.alignment}`)
  if (rules.paragraph?.first_line_indent_cm) autoFixed.push(`Indent paragraf → ${rules.paragraph.first_line_indent_cm}cm`)

  const fullText = paragraphs.map(p => p.text).join(' ')
  const wordCount = fullText.split(/\s+/).filter(Boolean).length

  const sectionKeywords = {
    'Abstract': ['abstract', 'abstrak'],
    'Keywords': ['keywords', 'kata kunci'],
    'Introduction': ['introduction', 'pendahuluan'],
    'References': ['references', 'daftar pustaka'],
    'Conclusion': ['conclusion', 'kesimpulan'],
  }

  if (rules.required_sections?.length > 0) {
    rules.required_sections.forEach(section => {
      const kws = sectionKeywords[section] || [section.toLowerCase()]
      const found = paragraphs.some(p => kws.some(kw => p.text.toLowerCase().includes(kw)))
      if (!found) {
        needsAttention.push({ type: 'missing_section', message: `Section "${section}" tidak ditemukan (wajib ada)`, severity: 'error' })
      }
    })
  }

  if (rules.word_limits?.abstract) {
    const absIdx = paragraphs.findIndex(p => /abstract|abstrak/i.test(p.text))
    if (absIdx >= 0) {
      const absText = paragraphs.slice(absIdx + 1, absIdx + 10).map(p => p.text).join(' ')
      const absWords = absText.split(/\s+/).filter(Boolean).length
      if (absWords > rules.word_limits.abstract) {
        needsAttention.push({ type: 'word_limit', message: `Abstract: ${absWords} kata (maks ${rules.word_limits.abstract}, kurangi ${absWords - rules.word_limits.abstract} kata)`, severity: 'warning' })
      }
    }
  }

  if (rules.word_limits?.total && wordCount > rules.word_limits.total) {
    needsAttention.push({ type: 'word_limit', message: `Total dokumen: ${wordCount} kata (maks ${rules.word_limits.total})`, severity: 'warning' })
  }

  if (rules.citation_style) {
    needsAttention.push({ type: 'citation', message: `Pastikan format sitasi menggunakan style ${rules.citation_style}`, severity: 'info' })
  }

  if (rules.columns === 2) {
    needsAttention.push({ type: 'layout', message: `Jurnal ini menggunakan layout 2 kolom — cek layout setelah diformat`, severity: 'info' })
  }

  rules.other?.forEach(rule => {
    needsAttention.push({ type: 'other', message: rule, severity: 'info' })
  })

  return { autoFixed, needsAttention }
}