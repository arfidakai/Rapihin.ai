import React from "react";

const LoadingSpinner = ({ message = "Processing..." }) => {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}>
      <div style={{
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        animation: "spin 1s linear infinite",
      }} />
      <p style={{
        color: "white",
        marginTop: "1rem",
        fontSize: "1.1rem",
      }}>{message}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
