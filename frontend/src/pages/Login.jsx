import React from "react";
import "../style/login.css";

const Login = () => {
  return (
    <>
      <main className="login-page">
        <div className="login-wrapper">
          <div className="login-box">
            <h1>Welcome back</h1>
            <p>Login to your Rapihin.ai account</p>

            <form action="#" method="POST">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
              />

              <button type="submit" className="login-btn">
                Log In
              </button>
            </form>

            <div className="divider">OR</div>

            <a href="#" className="google-btn">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google icon"
              />
              Sign in with Google
            </a>

            <p className="signup-text">
              Don't have an account? <a href="#">Sign up</a>
            </p>
          </div>
        </div>
      </main>

    </>
  );
};

export default Login;
