import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./Auth.module.css";
import { useGoogleLogin } from '@react-oauth/google'; // Import library google

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // FUNGSI GOOGLE LOGIN
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login Google Sukses:", tokenResponse);
      // Langsung arahkan ke dashboard
      navigate("/upload");
    },
    onError: () => {
      setError("Google Login Failed. Please try again.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/upload");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className={styles.authPage}>
      <Navbar />
      <main className={styles.authMain}>
        <div className={styles.authWrapper}>
          <div className={styles.authBox}>
            <div className={styles.authHeader}>
              <h1 className={styles.title}>Welcome back</h1>
              <p className={styles.subtitle}>Login to your Rapihin.ai account</p>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            {/* TOMBOL GOOGLE SUDAH AKTIF */}
            <button className={styles.googleBtn} onClick={() => googleLogin()}>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google icon"
                className={styles.googleIcon}
              />
              Sign in with Google
            </button>

            <p className={styles.footerText}>
              Don't have an account? <Link to="/register" className={styles.link}>Sign up</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
