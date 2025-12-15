import React, { useRef, useState } from "react";
import { documentAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import "../style/upload.css";

const UploadPage = () => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("No file selected");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [documentType, setDocumentType] = useState("Academic Papers");
  const [university, setUniversity] = useState("National Standard");
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".doc") || file.name.endsWith(".docx"))) {
      fileInputRef.current.files = e.dataTransfer.files;
      setFileName("Selected: " + file.name);
      setDownloadUrl(null); // reset kalau ada sebelumnya
    } else {
      alert("Only .doc or .docx files are allowed.");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName("Selected: " + e.target.files[0].name);
      setDownloadUrl(null); // reset juga
    }
  const handleFormatClick = async () => {
    if (fileInputRef.current.files.length === 0) {
      setError("Please choose a .doc or .docx file first.");
      return;
    }

    const file = fileInputRef.current.files[0];
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setLoading(true);
    setDownloadUrl(null);
    setError("");

    try {
      const response = await documentAPI.formatDocument(file, documentType, university);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      
      // Auto-download
      const link = document.createElement('a');
      link.href = url;
      link.download = `formatted_${file.name}`;
      document.body.appendChild(link);
  return (
    <>
      <Navbar />
      {loading && <LoadingSpinner message="Formatting your document..." />}
      <main className="container">
        {!user && (
          <div style={{
            backgroundColor: "#fff3cd",
            color: "#856404",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            textAlign: "center",
          }}>
            💡 <strong>Tip:</strong> <a href="/login" style={{ color: "#856404", textDecoration: "underline" }}>Login</a> to save your formatting history!
          </div>
        )}
        
        {error && (
          <div style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            textAlign: "center",
          }}>
            ❌ {error}
          </div>
        )}
        
        <div
          className="upload-box"
          id="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
  };  setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div
          className="upload-box"
          id="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <span className="material-icons download-icon">download</span>
          <p>Drag & drop your file here,<br />or</p>
          <label htmlFor="file-upload" className="upload-btn">
        <button className="submit-btn" onClick={handleFormatClick} disabled={loading}>
          {loading ? "Formatting..." : "Format Now"}
        </button>

        {downloadUrl && (
          <div style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "1rem",
            borderRadius: "8px",
            marginTop: "1rem",
            textAlign: "center",
          }}>
            <p style={{ marginBottom: "0.5rem" }}>✅ Document formatted successfully!</p>
            <p style={{ fontSize: "0.9rem" }}>File downloaded automatically. If not, click below:</p>
            <a 
              href={downloadUrl} 
              download="formatted_document.docx" 
              style={{
                display: "inline-block",
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#28a745",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
              }}
            >
              📥 Download Again
            </a>
            {user && (
              <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                📊 Check your <a href="/history" style={{ color: "#155724", textDecoration: "underline" }}>History</a> page
              </p>
            )}
          </div>
        )}  value={documentType} 
            onChange={(e) => setDocumentType(e.target.value)}
          >
            <option>Academic Papers</option>
            <option>Thesis</option>
            <option>Internship Report</option>
            <option>Dissertation</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="kampus">Select University/Template</label>
          <select 
            id="kampus" 
            value={university} 
            onChange={(e) => setUniversity(e.target.value)}
          >
            <option>National Standard</option>
            <option>ITB</option>
            <option>UI</option>
            <option>UGM</option>
          </select>
        </div>

        <button className="submit-btn" onClick={handleFormatClick}>
          {loading ? "Formatting..." : "Format Now"}
        </button>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Formatting document...</p>
          </div>
        )}

        {downloadUrl && (
          <div className="download-result">
            <a href={downloadUrl} download="hasil_format.docx" className="text-green-600 underline">
              📥 Unduh File Hasil
            </a>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default UploadPage;
