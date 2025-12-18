import React from "react";
import Navbar from "../components/Navbar";
import "../style/home.css";


const StarRow = ({ count = 5 }) => (
  <div className="stars" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="star" aria-hidden="true">★</span>
    ))}
  </div>
);

const Header = () => {
  return (
    <header className="header">
      <div className="container headerInner">
        <div className="brand">Rapihin.ai</div>

        <button className="iconBtn" aria-label="Settings">
          {/* simple gear svg */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
              stroke="currentColor" strokeWidth="1.8"
            />
            <path
              d="M19.4 15a8.6 8.6 0 0 0 .1-1l2-1.5-2-3.5-2.4.8a8 8 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5c-.6.3-1.2.6-1.7 1L4.5 9l-2 3.5 2 1.5a8.6 8.6 0 0 0 .1 1 8.6 8.6 0 0 0-.1 1l-2 1.5 2 3.5 2.4-.8c.5.4 1.1.7 1.7 1l.4 2.5h4l.4-2.5c.6-.3 1.2-.6 1.7-1l2.4.8 2-3.5-2-1.5a8.6 8.6 0 0 0-.1-1Z"
              stroke="currentColor" strokeWidth="1.4" opacity="0.9"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

const Hero = () => {
  return (
    <section className="hero">
      <div className="container heroGrid">
        <div className="heroArt" aria-hidden="true">
          {/* placeholder artwork area – replace with your image later */}
          <div className="artBlob" />
          <div className="artCard" />
          <div className="artDot d1" />
          <div className="artDot d2" />
          <div className="artDot d3" />
        </div>

        <div className="heroCopy">
          <div className="kicker">- Free 14 DAYS TRIAL</div>
          <h1 className="h1">
            Effortless formatting for academic papers.
          </h1>
          <p className="sub">
            Streamline your document creation process.
          </p>

          <div className="ctaRow">
            <button className="btn primary">Get started</button>
            <button className="btn secondary">Learn more</button>
          </div>

          <p className="note">
            Loved by students and institutions worldwide
          </p>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ title, desc, button, variant = "a" }) => {
  return (
    <div className={`card featureCard v-${variant}`}>
      <div className="cardMedia" aria-hidden="true">
        {/* placeholder media */}
        <div className="mediaCircle" />
        <div className="mediaSmall s1" />
        <div className="mediaSmall s2" />
      </div>

      <div className="cardBody">
        <h2 className="h2">{title}</h2>
        <p className="p">{desc}</p>
        <button className="btn primary small">{button}</button>
      </div>
    </div>
  );
};

const StepsCard = () => {
  return (
    <div className="card stepsCard">
      <div className="cardMedia tall" aria-hidden="true">
        {/* placeholder media */}
        <div className="mediaPanel" />
      </div>

      <div className="cardBody">
        <h2 className="h2">How to join our platform</h2>
        <p className="p">Follow these 3 easy steps to get started.</p>

        <div className="steps">
          <div className="step">
            <div className="stepTitle">Step 1</div>
            <div className="stepDesc">Sign up and create your account quickly.</div>
          </div>
          <div className="step">
            <div className="stepTitle">Step 2</div>
            <div className="stepDesc">Choose your formatting preferences and upload your document.</div>
          </div>
          <div className="step">
            <div className="stepTitle">Step 3</div>
            <div className="stepDesc">Receive your formatted document in seconds.</div>
          </div>
        </div>

        <button className="btn primary">Join us now</button>
      </div>
    </div>
  );
};

const Reviews = () => {
  return (
    <section className="reviews">
      <div className="container">
        <h2 className="sectionTitle">User Reviews</h2>
        <p className="sectionSub">
          Our users appreciate the efficiency and ease of use.
        </p>

        <div className="card reviewCard">
          <p className="quote">
            <strong>Rapihin.ai</strong> transformed my thesis writing process!
          </p>

          <StarRow />

          <div className="reviewer">
            <div className="name">Jordan Smith</div>
            <div className="role">Graduate Student, University</div>
          </div>

          <div className="dots" aria-label="Carousel indicators">
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footerInner">
        <div className="footerBrand">Brand Logo</div>

        <nav className="footerNav" aria-label="Footer navigation">
          <a href="#home">Home</a>
          <a href="#services">Servi</a>
          <a href="#contact">Contact</a>
        </nav>

        <button className="footerDropdown" aria-label="Footer dropdown">
          Dropdown
        </button>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="homePage" id="home">
      <Navbar />
      <main>
        <Hero />

        <section className="cardsSection">
          <div className="container cardsGrid">
            <FeatureCard
              variant="a"
              title="Discover a smart solution"
              desc="Join us and enhance your academic experience!"
              button="Start now"
            />
            <StepsCard />
          </div>
        </section>

        <Reviews />
      </main>
      <Footer />
    </div>
  );
}
