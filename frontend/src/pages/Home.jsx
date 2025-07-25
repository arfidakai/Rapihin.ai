import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import homeImage from "../assets/home.png";
import "../style/home.css";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="scroll-container">
        <section className="hero">
          <div className="hero-text">
            <h1>
              Effortless Thesis Formatting with <span>Rapihin.ai</span>
            </h1>
            <p>
              Focus on your research—we'll handle the formatting. Instantly
              convert your thesis into a campus-approved structure with just a few
              clicks.
            </p>
            <a href="/upload" className="btn">Get Started Free</a>
            <p>*Login with Google to save your activity history</p>
          </div>
          <div className="hero-image">
            <img src={homeImage} alt="Rapihin.ai preview" />
          </div>
        </section>

        <section className="benefits">
          <h2>Why Choose Rapihin.ai?</h2>
          <div className="steps">
            <div className="step">
              <div className="icon">⚡</div>
              <h4>Instant Conversion</h4>
              <p>
                Format your thesis in seconds—no more manual edits or wasting
                hours.
              </p>
            </div>
            <div className="step">
              <div className="icon">🎓</div>
              <h4>University Standard and National Standard</h4>
              <p>
                Supports popular thesis guidelines used by top universities in
                Indonesia.
              </p>
            </div>
            <div className="step">
              <div className="icon">🔒</div>
              <h4>Secure & Private</h4>
              <p>
                Your documents are safe. We never store your files without
                permission.
              </p>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps-container">
            <div className="step-box">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create an account with your email address to enjoy personalized features, including your activity history.</p>
            </div>
            <div className="step-box">
              <div className="step-number">2</div>
              <h3>Upload Your File and Select University</h3>
              <p>Select from various university standard to match your report type.</p>
            </div>
            <div className="step-box">
              <div className="step-number">3</div>
              <h3>Generate</h3>
              <p>Our AI helps generate structured content automatically. And you can download it.</p>
            </div>
          </div>
        </section>

        <section className="fitur">
          <div className="fitur-container">
            <div className="fitur-title">
              <h1>Key</h1>
              <h1>Features</h1>
            </div>
            <ul className="fitur-list">
              <li><i className="fas fa-check-circle"></i> Automatic margins & spacing</li>
              <li><i className="fas fa-check-circle"></i> Auto-generated table of contents</li>
              <li><i className="fas fa-magic"></i> Smart typo detection and correction</li>
              <li><i className="fas fa-pen-nib"></i> Improved word choice for better flow</li>
              <li><i className="fas fa-brain"></i> AI formatting suggestions (academic rules)</li>
            </ul>
          </div>
          <div className="footer-container">
            <Footer />
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
