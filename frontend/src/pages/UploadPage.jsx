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
      setDownloadUrl(null);
    } else {
      alert("Only .doc or .docx files are allowed.");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName("Selected: " + e.target.files[0].name);
      setDownloadUrl(null);
    }
  };

  const handleFormatClick = async () => {
    if (!fileInputRef.current || fileInputRef.current.files.length === 0) {
      setError("Please choose a .doc or .docx file first.");
      return;
    }

    const file = fileInputRef.current.files[0];

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

      const link = document.createElement("a");
      link.href = url;
      link.download = `formatted_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to format document. Please try again.";
      setError(errorMsg);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uploadPage">
      <Navbar />
      {loading && <LoadingSpinner message="Formatting your document..." />}
      <main className="container">
        {!user && (
          <div className="alert alert-warning">
            💡 <strong>Tip:</strong> <a href="/login">Login</a> to save your formatting history!
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            ❌ {error}
          </div>
        )}

        <div
          className="upload-box"
          id="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <span className="material-icons download-icon">📄</span>
          <p>Drag & drop your file here,<br />or</p>
          <label htmlFor="file-upload" className="upload-btn">
            Choose File
          </label>
          <input
            type="file"
            id="file-upload"
            accept=".doc,.docx"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <p>{fileName}</p>
        </div>

        <div className="form-group">
          <label htmlFor="jenis">Select Document Type</label>
          <select
            id="jenis"
            value={documentType}
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

        <button className="submit-btn" onClick={handleFormatClick} disabled={loading}>
          {loading ? "Formatting..." : "Format Now"}
        </button>

        {downloadUrl && (
          <div className="success-box">
            <p><strong>✅ Document formatted successfully!</strong></p>
            <p style={{ fontSize: "0.9rem" }}>File downloaded automatically. If not, click below:</p>
            <a
              href={downloadUrl}
              download="formatted_document.docx"
              className="download-again-btn"
            >
              📥 Download Again
            </a>
            {user && (
              <p style={{ marginTop: "12px", fontSize: "0.9rem" }}>
                📊 Check your <a href="/history">History</a> page
              </p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UploadPage;
