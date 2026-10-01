import React, { useRef, useState } from "react";
import { aiAPI, documentAPI } from "../services/api";
import { useAuth } from "../context/AuthContextValue";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "./Upload.module.css";

const UploadPage = () => {
  const fileInputRef = useRef(null);
  const templateInputRef = useRef(null);
  const [fileName, setFileName] = useState("No file selected");
  const [templateName, setTemplateName] = useState("No template selected");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [documentType, setDocumentType] = useState("Academic Papers");
  const [university, setUniversity] = useState("National Standard");
  const [error, setError] = useState("");
  const [proofreadText, setProofreadText] = useState("");
  const [proofreadResult, setProofreadResult] = useState("");
  const [proofreadLoading, setProofreadLoading] = useState(false);
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

  const handleTemplateChange = (e) => {
    if (e.target.files.length > 0) {
      setTemplateName("Selected: " + e.target.files[0].name);
      setDownloadUrl(null);
    }
  };

  const handleFormatClick = async () => {
    if (!fileInputRef.current || fileInputRef.current.files.length === 0) {
      setError("Please choose the article you want to format first.");
      return;
    }

    if (!templateInputRef.current || templateInputRef.current.files.length === 0) {
      setError("Please choose an article template first.");
      return;
    }

    const file = fileInputRef.current.files[0];
    const templateFile = templateInputRef.current.files[0];

    if (file.size > 10 * 1024 * 1024 || templateFile.size > 10 * 1024 * 1024) {
      setError("Each file must be less than 10MB");
      return;
    }

    setLoading(true);
    setDownloadUrl(null);
    setError("");

    try {
      const response = await documentAPI.formatDocument(
        file,
        documentType,
        university,
        templateFile
      );
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

  const handleProofreadClick = async () => {
    if (!proofreadText.trim()) {
      setError("Please enter text to proofread first.");
      return;
    }

    setProofreadLoading(true);
    setError("");

    try {
      const response = await aiAPI.proofread(proofreadText);
      setProofreadResult(response.data.result || proofreadText);
    } catch (err) {
      setError(err.response?.data?.detail || "AI proofreading is unavailable right now.");
    } finally {
      setProofreadLoading(false);
    }
  };

  return (
    <div className={styles.uploadPage}>
      <Navbar />
      {loading && <LoadingSpinner message="Formatting your document..." />}
      <main className={styles.container}>
        {!user && (
          <div className={styles.alert}>
            <span className={styles.alertIcon}>💡</span>
            <span><strong>Tip:</strong> <a href="/login" className={styles.alertLink}>Login</a> to save your formatting history!</span>
          </div>
        )}

        {error && (
          <div className={`${styles.alert} ${styles.alertError}`}>
            <span className={styles.alertIcon}>❌</span>
            <span>{error}</span>
          </div>
        )}

        <div className={styles.uploadSection}>
          <h1 className={styles.title}>Upload Your Document</h1>
          <p className={styles.subtitle}>
            Upload your academic document and let AI format it perfectly
          </p>

          <div className={styles.proofreadSection}>
            <h2 className={styles.proofreadTitle}>AI Proofreading</h2>
            <p className={styles.proofreadSubtitle}>
              Check grammar and clarity before formatting your document.
            </p>
            <textarea
              className={styles.textarea}
              value={proofreadText}
              onChange={(e) => {
                setProofreadText(e.target.value);
                setProofreadResult("");
              }}
              placeholder="Paste a paragraph to proofread..."
              rows={6}
              disabled={proofreadLoading}
            />
            <button
              className={styles.secondaryBtn}
              onClick={handleProofreadClick}
              disabled={proofreadLoading}
            >
              {proofreadLoading ? "Proofreading..." : "Proofread with AI"}
            </button>
            {proofreadResult && (
              <div className={styles.proofreadResult}>
                <span className={styles.label}>Improved text</span>
                <p>{proofreadResult}</p>
              </div>
            )}
          </div>

          <div className={styles.templateUpload}>
            <label htmlFor="template-upload" className={styles.label}>
              Article Template
            </label>
            <p className={styles.uploadHint}>
              Upload the .doc or .docx file whose formatting should be copied.
            </p>
            <label htmlFor="template-upload" className={styles.uploadBtn}>
              Choose Template
            </label>
            <input
              type="file"
              id="template-upload"
              accept=".doc,.docx"
              style={{ display: "none" }}
              ref={templateInputRef}
              onChange={handleTemplateChange}
            />
            <p className={styles.fileName}>{templateName}</p>
          </div>

          <div
            className={styles.uploadBox}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className={styles.uploadIcon}>📄</div>
            <p className={styles.uploadText}>Article to format</p>
            <p className={styles.uploadHint}>Drag & drop your unsorted article here, or choose a file.</p>
            <p className={styles.uploadOr}>or</p>
            <label htmlFor="file-upload" className={styles.uploadBtn}>
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
            <p className={styles.fileName}>{fileName}</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="jenis" className={styles.label}>Select Document Type</label>
            <select
              id="jenis"
              className={styles.select}
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option>Academic Papers</option>
              <option>Thesis</option>
              <option>Internship Report</option>
              <option>Dissertation</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="kampus" className={styles.label}>Select University/Template</label>
            <select
              id="kampus"
              className={styles.select}
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            >
              <option>National Standard</option>
              <option>ITB</option>
              <option>UI</option>
              <option>UGM</option>
            </select>
          </div>

          <button className={styles.submitBtn} onClick={handleFormatClick} disabled={loading}>
            {loading ? "Formatting..." : "Format Now"}
          </button>

          {downloadUrl && (
            <div className={`${styles.alert} ${styles.alertSuccess}`}>
              <span className={styles.alertIcon}>✅</span>
              <span>
                Document formatted successfully! File downloaded automatically.
                {user && (
                  <>
                    {" "}📊 Check your <a href="/history">History</a> page
                  </>
                )}
                {" "}
                <a
                  href={downloadUrl}
                  download="formatted_document.docx"
                  className={styles.alertLink}
                  style={{ marginLeft: 8 }}
                >
                  (Download Again)
                </a>
              </span>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadPage;
