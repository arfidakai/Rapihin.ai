# 🚀 Quick Start Guide - Rapihin.ai

## Langkah-Langkah Setup (5 Menit!)

### 1️⃣ Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
source venv/bin/activate  # macOS/Linux
# atau
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Jalankan server
python main.py
```

✅ Backend ready di **http://localhost:8000**

---

### 2️⃣ Setup Frontend (Terminal Baru)

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

✅ Frontend ready di **http://localhost:5173**

---

### 3️⃣ Test Aplikasi

1. Buka browser: `http://localhost:5173`
2. Klik **"Get Started Free"** atau **"Upload"**
3. Upload file .docx kamu
4. Pilih tipe dokumen & universitas
5. Klik **"Format Now"**
6. Download hasilnya! 🎉

---

## 📝 Cara Pakai Lengkap

### Tanpa Login (Guest Mode)
- Upload file ✅
- Format dokumen ✅
- Download hasil ✅
- ❌ Tidak ada history

### Dengan Login
- Upload file ✅
- Format dokumen ✅
- Download hasil ✅
- Lihat history ✅
- Track semua aktivitas ✅

---

## 🔧 Troubleshooting

### Backend tidak bisa jalan?
```bash
# Pastikan Python 3.9+
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend error?
```bash
# Clear cache & reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port sudah dipakai?
- Backend: Edit `main.py`, ubah port 8000 ke port lain
- Frontend: Edit `vite.config.js`, tambahkan config port

### CORS Error?
- Pastikan backend sudah jalan dulu
- Check `.env` di frontend, pastikan `VITE_API_URL=http://localhost:8000`

---

## 🎓 Fitur-Fitur

### ✅ Yang Sudah Jalan
1. Upload & format dokumen (.doc, .docx)
2. 4 tipe dokumen (Academic Papers, Thesis, Internship Report, Dissertation)
3. 4 template universitas (National Standard, ITB, UI, UGM)
4. Authentication (Register, Login, Logout)
5. History tracking untuk user yang login
6. Auto-download hasil format
7. File size validation (max 10MB)
8. Loading spinner & error handling
9. Responsive design

### 🚧 Yang Bisa Ditambahkan
1. Google OAuth
2. AI typo detection
3. Grammar check
4. Auto table of contents
5. Export to PDF
6. Batch upload
7. Dark mode
8. Mobile app
9. Collaboration features
10. Advanced formatting options

---

## 📚 API Docs

Setelah backend jalan, buka:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 💾 Database

Saat ini pakai **JSON files** di folder `backend/database/`:
- `users.json` - Data user
- `history.json` - Riwayat formatting

Untuk production, ganti dengan PostgreSQL atau MongoDB.

---

## 🎯 Tips untuk Development

1. **Backend first** - Selalu jalankan backend dulu
2. **Check logs** - Lihat terminal untuk error messages
3. **API testing** - Pakai Postman atau Swagger UI untuk test API
4. **Browser DevTools** - Check Network tab untuk debugging
5. **Git branches** - Bikin branch baru untuk setiap feature

---

## 📞 Need Help?

- Check `README.md` di folder backend & frontend
- Lihat code comments di setiap file
- Test API via Swagger: http://localhost:8000/docs
- Check browser console untuk frontend errors

---

## 🎉 Happy Coding!

Semoga Rapihin.ai bermanfaat untuk mahasiswa Indonesia! 🇮🇩

Star ⭐ repo ini kalau helpful ya!
