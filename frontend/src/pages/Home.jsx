
import React, { useState, useEffect } from 'react';
import { Settings, Star, Menu, X } from 'lucide-react';
import styles from './Home.module.css';

export default function BaphinLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({
    'section-hero': true,
    'section-solution': true,
    'section-join': true,
    'section-reviews': true
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const Section = ({ id, children, delay = 0 }) => (
    <div
      id={id}
      className={styles.section}
      style={{
        opacity: isVisible[id] ? 1 : 0,
        transform: isVisible[id] ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.8s ease-out ${delay}s`
      }}
    >
      {children}
    </div>
  );

  const Button = ({ children, primary, onClick, style }) => (
    <button
      onClick={onClick}
      className={[
        styles.button,
        primary ? styles.buttonPrimary : styles.buttonSecondary
      ].join(' ')}
      style={style}
    >
      {children}
    </button>
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Rapihin.ai</h1>
          
          {/* Desktop Nav */}
          <nav className={styles.nav}>
            <a href="#section-hero" className={styles.navLink}>Home</a>
            <a href="#section-join" className={styles.navLink}>How it Works</a>
            <a href="#section-reviews" className={styles.navLink}>Reviews</a>
            <Button primary style={{ padding: '0.6rem 1.2rem' }}>Login</Button>
            <Button style={{ padding: '0.6rem 1.2rem' }}>Get Started</Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className={styles.mobileMenuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <a href="#section-hero" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#section-join" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>How it Works</a>
            <a href="#section-reviews" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Reviews</a>
            <Button primary style={{ width: '100%', marginTop: '1rem' }}>Login</Button>
            <Button style={{ width: '100%', marginTop: '0.5rem' }}>Get Started</Button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <Section id="section-hero">
        <div className={styles.hero}>
          <div className={styles.badge}>✨ Free 14 DAYS TRIAL</div>
          <h2 className={styles.heroTitle}>
            Effortless formatting for academic papers.
          </h2>
          <p className={styles.subtitle}>
            Streamline your document creation process with AI-powered formatting tools.
          </p>
          <div className={styles.buttonGroup}>
            <Button primary>Get started</Button>
            <Button>Learn more</Button>
          </div>
          <p style={{ color: '#808080', fontSize: '0.9rem' }}>
            Loved by 10,000+ students and institutions worldwide
          </p>
        </div>
      </Section>

      {/* Smart Solution */}
      <Section id="section-solution" delay={0.2}>
        <div className={styles.card}>
          <div className={styles.iconBox}>🚀</div>
          <h3 className={styles.cardTitle} style={{ textAlign: 'center' }}>
            Discover a smart solution
          </h3>
          <p className={styles.subtitle} style={{ textAlign: 'center' }}>
            Join us and enhance your academic experience with AI-powered tools!
          </p>
          <div style={{ textAlign: 'center' }}>
            <Button primary>Start now</Button>
          </div>
        </div>
      </Section>

      {/* How to Join */}
      <Section id="section-join" delay={0.3}>
        <div className={styles.card}>
          <div className={styles.iconBox}>📋</div>
          <h3 className={styles.cardTitle} style={{ textAlign: 'center' }}>
            How to join our platform
          </h3>
          <p className={styles.subtitle} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            Follow these 3 easy steps to get started.
          </p>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {[
              { step: 'Step 1', text: 'Sign up and create your account quickly.' },
              { step: 'Step 2', text: 'Choose your formatting preferences and upload your document.' },
              { step: 'Step 3', text: 'Receive your formatted document in seconds.' }
            ].map((item, i) => (
              <div
                key={i}
                className={styles.stepCard}
                style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}
              >
                <h4 style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  {item.step}
                </h4>
                <p style={{ color: '#a0a0a0', lineHeight: '1.6' }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Button primary>Join us now</Button>
          </div>
        </div>
      </Section>

      {/* Reviews */}
      <Section id="section-reviews" delay={0.4}>
        <div className={styles.reviewsContainer}>
          <h3 className={styles.reviewsTitle}>User Reviews</h3>
          <p className={styles.reviewsSubtitle}>
            Our users appreciate the efficiency and ease of use.
          </p>
          
          <div className={styles.reviewsGrid}>
            {[
              { name: 'Sarah Johnson', initial: 'SJ', role: 'PhD Student', quote: 'Rapihin.ai transformed my thesis writing process completely!' },
              { name: 'Michael Chen', initial: 'MC', role: 'Graduate Student', quote: 'The AI-powered formatting saved me hours of tedious work.' },
              { name: 'Emma Williams', initial: 'EW', role: 'Research Assistant', quote: 'Best tool for academic document formatting. Highly recommended!' }
            ].map((review, i) => (
              <div key={i} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewAvatar}>{review.initial}</div>
                  <div className={styles.reviewInfo}>
                    <p className={styles.reviewName}>{review.name}</p>
                    <p className={styles.reviewRole}>{review.role}</p>
                  </div>
                </div>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={18}
                      fill="#fbbf24"
                      color="#fbbf24"
                    />
                  ))}
                </div>
                <p className={styles.reviewQuote}>"{review.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚙️</div>
          <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Rapihin.ai</h4>
          <p style={{ color: '#808080', marginBottom: '2rem' }}>
            AI-powered document formatting for academic excellence.
          </p>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.navLink}>Product</a>
            <a href="#" className={styles.navLink}>Features</a>
            <a href="#" className={styles.navLink}>Support</a>
            <a href="#" className={styles.navLink}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
