# Rapihin.ai — Next.js + Supabase

Format dokumen akademik otomatis sesuai panduan universitas.

## Stack
- **Next.js 14** (App Router)
- **Supabase** (Auth + PostgreSQL)
- **Vercel** (Deploy)
- **docx + mammoth** (Document processing, gantiin python-docx)

## Setup Lokal

```bash
# 1. Clone dan install
git clone https://github.com/arfidakai/Rapihin.ai.git
cd Rapihin.ai
npm install

# 2. Buat file .env.local (sudah ada templatenya)
# Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Jalankan
npm run dev
```

Buka http://localhost:3000

## Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables di Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Struktur Project

```
src/
├── app/
│   ├── api/format/route.js   ← Document formatting API
│   ├── upload/page.js        ← Upload page
│   ├── history/page.js       ← History page
│   ├── login/page.js         ← Login
│   ├── register/page.js      ← Register
│   ├── page.js               ← Landing page
│   ├── layout.js             ← Root layout
│   └── globals.css           ← Global styles
├── components/
│   └── Navbar.js
└── lib/
    ├── supabase-client.js    ← Browser Supabase client
    ├── supabase-server.js    ← Server Supabase client
    └── formatter.js          ← Document formatting logic
```

## Fitur
- Upload .doc/.docx dengan drag & drop
- Format otomatis: margin, font, spasi, heading, indent
- Template: National Standard, UI, ITB, UGM
- Auth dengan Supabase (register/login/logout)
- Riwayat format tersimpan di Supabase
- Deploy siap di Vercel
