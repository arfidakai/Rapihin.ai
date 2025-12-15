# Rapihin.ai

🎓 **Automatic Thesis & Academic Document Formatting Tool**

Rapihin.ai helps students format their academic documents (thesis, papers, reports) according to university guidelines automatically. Built during a hackathon to solve the common pain point of academic document formatting.

## 🌟 Features

- 📄 **Automatic Formatting** - Upload .doc/.docx and get formatted documents instantly
- 🎓 **Multiple Templates** - Support for National Standard, ITB, UI, UGM
- 🔐 **User Authentication** - Register, login, and track your formatting history
- 📊 **History Tracking** - See all your previously formatted documents
- 🚀 **Fast & Easy** - Format in seconds, not hours

## 📸 Screenshots

See our project documentation in the attached image for more details about:
- Inspiration & problem we're solving
- How we built it (React.js + FastAPI + python-docx)
- Challenges we faced
- Future improvements planned

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router
- Axios
- Vite

### Backend
- FastAPI (Python)
- python-docx
- JWT Authentication
- JSON-based database (for hackathon, will migrate to PostgreSQL)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- pip

### 1. Clone the repository

```bash
git clone https://github.com/arfidakai/Rapihin.ai.git
cd Rapihin.ai
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Copy .env file
cp .env.example .env

# Run server
python main.py
```

Backend will run on `http://localhost:8000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Open in browser

Visit `http://localhost:5173` and start formatting!

## 📖 Documentation

- **Backend API**: http://localhost:8000/docs (Swagger UI)
- **Frontend README**: [frontend/README.md](frontend/README.md)
- **Backend README**: [backend/README.md](backend/README.md)

## 🎯 How It Works

1. **Upload** - Choose your .doc or .docx file
2. **Select** - Pick document type (Thesis, Paper, etc.) and university template
3. **Format** - Click format and wait a few seconds
4. **Download** - Get your formatted document

## 📊 Formatting Features

- ✅ Automatic margins & spacing
- ✅ Font standardization (Times New Roman 12pt)
- ✅ Line spacing adjustment (1.5 or 2.0)
- ✅ Heading styles formatting
- ✅ Paragraph indentation
- ✅ Justified text alignment

## 🔮 Future Improvements

- [ ] Google OAuth integration
- [ ] AI-based typo detection
- [ ] Word choice improvement suggestions
- [ ] Auto-generate table of contents
- [ ] Support for more universities
- [ ] PostgreSQL database
- [ ] Export to PDF
- [ ] Mobile app version
- [ ] Batch processing
- [ ] Collaboration features

## 💡 Why Rapihin.ai?

As students, we've struggled with formatting academic papers according to university guidelines. From margins to page numbering, it's time-consuming and error-prone. **Rapihin.ai** solves this pain point and helps students focus more on their research rather than formatting.

## 🏆 Hackathon Project

This project was built during a hackathon as our first experience in:
- Building AI-integrated applications
- Connecting frontend with backend
- Using FastAPI effectively
- Working with document manipulation libraries

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this project for learning or building upon it!

## 👥 Team

Built with ❤️ during a hackathon by passionate students who want to help fellow students save time on document formatting.

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**⭐ Star this repo if you find it helpful!**
