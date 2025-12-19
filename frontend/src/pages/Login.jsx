import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../style/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
    <div className="loginPage">
      <Navbar />
      <main className="loginMain">
        <div className="login-wrapper">
          <div className="login-box">
            <h1>Welcome back</h1>
            <p>Login to your Rapihin.ai account</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="divider">OR</div>

            <button className="google-btn" onClick={() => alert("Google OAuth coming soon!")}>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google icon"
              />
              Sign in with Google
            </button>

            <p className="signup-text">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
