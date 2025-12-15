import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import UploadPage from "./pages/UploadPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;



// import { useState } from "react";
// import axios from "axios";

// function App() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     setLoading(true);
//     setDownloadUrl(null);

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/format-docx/", formData, {
//         responseType: "blob", // karena file
//       });
//       // Buat URL download dari blob
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       setDownloadUrl(url);
//     } catch (error) {
//   alert("❌ Gagal memproses file!");
//   console.error("Error saat upload:", error);

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto text-center">
//       <h1 className="text-2xl font-bold mb-4">Upload File DOCX</h1>
//       <input
//         type="file"
//         accept=".docx"
//         onChange={(e) => setSelectedFile(e.target.files[0])}
//         className="mb-4"
//       />
//       <br />
//       <button
//         onClick={handleUpload}
//         disabled={loading || !selectedFile}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         {loading ? "Memproses..." : "Upload dan Format"}
//       </button>

//       {downloadUrl && (
//         <div className="mt-4">
//           <a
//             href={downloadUrl}
//             download="hasil_format.docx"
//             className="text-green-600 underline"
//           >
//             📥 Unduh File Hasil
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
