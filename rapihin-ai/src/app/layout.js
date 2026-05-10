import './globals.css'

export const metadata = {
  title: 'Rapihin.ai — Format Dokumen Akademik Otomatis',
  description: 'Upload dokumen skripsi atau makalahmu, pilih template universitasmu, dan dapatkan dokumen terformat dalam hitungan detik.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
