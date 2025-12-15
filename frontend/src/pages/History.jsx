import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { documentAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../style/style.css";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await documentAPI.getHistory();
        setHistory(response.data.history);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem", minHeight: "70vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ marginBottom: "2rem" }}>My Formatting History</h1>

          {loading ? (
            <p>Loading history...</p>
          ) : history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <p style={{ fontSize: "1.2rem", color: "#666" }}>
                You haven't formatted any documents yet.
              </p>
              <a href="/upload" className="btn" style={{ marginTop: "1rem", display: "inline-block" }}>
                Format Your First Document
              </a>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                    <th style={{ padding: "1rem", textAlign: "left" }}>Date</th>
                    <th style={{ padding: "1rem", textAlign: "left" }}>File Name</th>
                    <th style={{ padding: "1rem", textAlign: "left" }}>Document Type</th>
                    <th style={{ padding: "1rem", textAlign: "left" }}>University</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "1rem" }}>{formatDate(item.formatted_at)}</td>
                      <td style={{ padding: "1rem" }}>{item.original_filename}</td>
                      <td style={{ padding: "1rem" }}>{item.document_type}</td>
                      <td style={{ padding: "1rem" }}>{item.university}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default History;
