# Rapihin.ai Backend

Backend API untuk Rapihin.ai - Automatic thesis and academic document formatting.

## Features

- 📄 **Document Formatting**: Format Word documents (.doc, .docx) sesuai standar akademik
- 🎓 **Multiple Templates**: Support untuk National Standard, ITB, UI, UGM
- 🔐 **Authentication**: Register, login, dan JWT-based authentication
- 📊 **History Tracking**: Simpan riwayat formatting untuk user yang login
- 🚀 **Fast & Easy**: Built with FastAPI untuk performa tinggi

## Tech Stack

- **FastAPI**: Modern Python web framework
- **python-docx**: Library untuk manipulasi Word documents
- **JWT**: Token-based authentication
- **Uvicorn**: ASGI server

## Installation

### 1. Clone repository

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Setup environment variables

```bash
cp .env.example .env
```

Edit `.env` dan ubah `SECRET_KEY` dengan random string yang aman.

### 5. Run the server

```bash
python main.py
```

Server akan berjalan di `http://localhost:8000`

## API Documentation

Setelah server berjalan, buka:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Document Formatting

- `POST /format-docx/` - Upload dan format dokumen
  - Parameters:
    - `file`: File .doc atau .docx
    - `document_type`: Tipe dokumen (Academic Papers, Thesis, Internship Report, Dissertation)
    - `university`: Template universitas (National Standard, ITB, UI, UGM)

### History & Templates

- `GET /api/history` - Get user formatting history (requires auth)
- `GET /api/templates` - Get available templates

## Formatting Rules

Backend menggunakan formatting rules yang berbeda untuk setiap universitas:

### National Standard & ITB & UGM
- Font: Times New Roman 12pt
- Line spacing: 1.5
- Margins: Top 1.18", Bottom 1.18", Left 1.57", Right 1.18"
- Paragraph spacing: 6pt after
- First line indent: 0.5"

### UI
- Font: Times New Roman 12pt
- Line spacing: 2.0 (double space)
- Margins: Top 1.18", Bottom 1.18", Left 1.57", Right 1.18"
- No paragraph spacing
- First line indent: 0.5"

## Project Structure

```
backend/
├── main.py                 # FastAPI application & endpoints
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── app/
│   ├── __init__.py
│   ├── document_formatter.py  # Document formatting logic
│   ├── auth.py               # Authentication & JWT
│   └── database.py           # Simple JSON database
├── uploads/              # Temporary upload directory
├── outputs/              # Formatted documents output
└── database/            # JSON database files
    ├── users.json
    └── history.json
```

## Development

### Test API dengan curl

```bash
# Upload & format document
curl -X POST "http://localhost:8000/format-docx/" \
  -F "file=@your-document.docx" \
  -F "document_type=Thesis" \
  -F "university=ITB" \
  --output formatted.docx

# Register user
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User"}'

# Login
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Notes

- Database saat ini menggunakan simple JSON files. Untuk production, ganti dengan PostgreSQL/MongoDB
- Upload directory (`uploads/`) dan output directory (`outputs/`) akan dibuat otomatis
- Files di `uploads/` akan dihapus setelah processing selesai
- Files di `outputs/` disimpan untuk download

## Future Improvements

- [ ] Add PostgreSQL/MongoDB support
- [ ] Implement Google OAuth
- [ ] Add AI-based typo detection
- [ ] Add word choice improvement
- [ ] Auto-generate table of contents
- [ ] Support for more university templates
- [ ] File size limits and validation
- [ ] Rate limiting
- [ ] Caching for better performance

## License

MIT License
