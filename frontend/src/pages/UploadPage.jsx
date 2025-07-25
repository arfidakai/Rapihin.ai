import React, { useRef, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../style/upload.css";
import logo from "../assets/rapihin.png";

const UploadPage = () => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("No file selected");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

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
  };

  const handleFormatClick = async () => {
    if (fileInputRef.current.files.length === 0) {
      alert("Please choose a .doc or .docx file first.");
      return;
    }

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setDownloadUrl(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/format-docx/", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
    } catch (error) {
      alert("❌ Gagal memformat file.");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
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
          <select id="jenis">
            <option>Academic Papers</option>
            <option>Thesis</option>
            <option>Internship Report</option>
            <option>Dissertation</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="kampus">Select University/Template</label>
          <select id="kampus">
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
