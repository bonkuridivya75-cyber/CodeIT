import React, { useEffect, useState } from "react";
import "./Home.css";

function Home({ darkMode, toggleTheme, onLogin }) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      icon: "🎯",
      title: "Placement Preparation",
      text: "Prepare smarter with organized resources and placement-focused tools.",
    },
    {
      icon: "💻",
      title: "Coding Practice",
      text: "Improve your programming skills through regular coding practice.",
    },
    {
      icon: "📊",
      title: "Performance Tracking",
      text: "Track your learning progress and understand your strengths.",
    },
    {
      icon: "👤",
      title: "Student Profile",
      text: "Keep your academic and career information organized in one place.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((current) => (current + 1) % features.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const scrollToFeatures = () => {
    document
      .getElementById("features")
      ?.scrollIntoView({ behavior: "smooth" });

    setMenuOpen(false);
  };

  const scrollToAbout = () => {
    document
      .getElementById("about")
      ?.scrollIntoView({ behavior: "smooth" });

    setMenuOpen(false);
  };

  const goLogin = () => {
    setMenuOpen(false);

    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className={`home-page ${darkMode ? "theme-dark" : "theme-light"}`}>
      <div className="home-background">
        <div className="home-grid"></div>

        <div className="home-orb home-orb-one"></div>
        <div className="home-orb home-orb-two"></div>
        <div className="home-orb home-orb-three"></div>

        <span className="floating-code code-one">{"</>"}</span>
        <span className="floating-code code-two">{"{}"}</span>
        <span className="floating-code code-three">{"=>"}</span>
      </div>

      <header className="home-navbar">
        <button
          className="home-brand"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="home-brand-icon">{"</>"}</div>

          <div className="home-brand-text">
            <strong>CodeIT</strong>
            <span>STUDENT PLACEMENT PORTAL</span>
          </div>
        </button>

        <nav className={`home-nav ${menuOpen ? "nav-open" : ""}`}>
          <button
            className="home-nav-link active"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setMenuOpen(false);
            }}
          >
            Home
          </button>

          <button className="home-nav-link" onClick={scrollToFeatures}>
            Features
          </button>

          <button className="home-nav-link" onClick={scrollToAbout}>
            About
          </button>

          <button className="home-login-button" onClick={goLogin}>
            Login <span>→</span>
          </button>
        </nav>

        <div className="home-navbar-actions">
          <button
            className="home-theme-button"
            onClick={toggleTheme}
          >
            <span>{darkMode ? "☀️" : "🌙"}</span>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            className="home-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-hero-content">
            <div className="home-badge">
              <span className="home-badge-dot"></span>
              Smart Student Placement Platform
            </div>

            <h1 className="home-hero-title">
              Build Your <span>Career</span>
              <br />
              With Confidence
            </h1>

            <p className="home-hero-description">
              CodeIT is a modern student placement platform designed for
              engineering students to prepare, practice, track performance,
              and build their career with confidence.
            </p>

            <div className="home-hero-actions">
              <button
                className="home-primary-button"
                onClick={goLogin}
              >
                🚀 Get Started <span>→</span>
              </button>

              <button
                className="home-secondary-button"
                onClick={scrollToFeatures}
              >
                ▶ Explore Platform
              </button>
            </div>

            <div className="home-trust">
              <div className="home-trust-avatars">
                <span>👨‍💻</span>
                <span>👩‍💻</span>
                <span>👨‍🎓</span>
                <span>👩‍🎓</span>
              </div>

              <div className="home-trust-text">
                <strong>Built for Engineering Students</strong>
                <span>Learn • Practice • Perform • Get Placed</span>
              </div>
            </div>
          </div>

          <div className="home-preview-wrapper">
            <div className="preview-glow"></div>

            <div className="home-code-card">
              <div className="home-code-header">
                <div className="home-code-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <span className="home-code-title">CodeIT Dashboard</span>
                <span className="home-code-status">● LIVE</span>
              </div>

              <div className="preview-profile">
                <div className="preview-avatar">CI</div>

                <div className="preview-profile-text">
                  <strong>Student Dashboard</strong>
                  <span>Welcome back 👋</span>
                </div>
              </div>

              <div className="home-code-stats">
                <div className="home-code-stat">
                  <div className="preview-stat-icon purple">📚</div>
                  <div>
                    <span>Applications</span>
                    <strong>12</strong>
                  </div>
                </div>

                <div className="home-code-stat">
                  <div className="preview-stat-icon blue">💻</div>
                  <div>
                    <span>Coding Score</span>
                    <strong>86%</strong>
                  </div>
                </div>

                <div className="home-code-stat">
                  <div className="preview-stat-icon green">🎯</div>
                  <div>
                    <span>Preparation</span>
                    <strong>78%</strong>
                  </div>
                </div>
              </div>

              <div className="preview-chart-card">
                <div className="chart-heading">
                  <div>
                    <span>Performance Overview</span>
                    <strong>+18.6%</strong>
                  </div>
                  <small>This Month</small>
                </div>

                <div className="fake-chart">
                  <div className="chart-lines">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>

              <div className="preview-bottom">
                <div className="mini-card">
                  <div className="mini-card-icon">💡</div>
                  <div>
                    <span>Daily Practice</span>
                    <strong>4 / 5 completed</strong>
                  </div>
                </div>

                <div className="mini-card">
                  <div className="mini-card-icon">🏆</div>
                  <div>
                    <span>Current Streak</span>
                    <strong>14 Days 🔥</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="home-features-section">
          <div className="home-section-heading">
            <span className="home-section-label">POWERFUL FEATURES</span>

            <h2>
              Everything You Need <span>In One Place</span>
            </h2>

            <p>
              Prepare for your placement journey with powerful tools designed
              for engineering students.
            </p>
          </div>

          <div className="home-features-container">
            <div className="home-feature-list">
              {features.map((feature, index) => (
                <button
                  key={feature.title}
                  className={`home-feature-item ${
                    activeFeature === index ? "feature-active" : ""
                  }`}
                  onClick={() => setActiveFeature(index)}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="home-feature-icon">{feature.icon}</div>

                  <div className="home-feature-content">
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </div>

                  <span className="home-feature-arrow">→</span>
                </button>
              ))}
            </div>

            <div className="home-feature-showcase">
              <div className="showcase-orbit orbit-a"></div>
              <div className="showcase-orbit orbit-b"></div>

              <div className="showcase-center">
                <div className="showcase-icon">
                  {features[activeFeature].icon}
                </div>

                <h3>{features[activeFeature].title}</h3>
                <p>{features[activeFeature].text}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="home-about-section">
          <div className="home-about-card">
            <div className="home-about-content">
              <span className="home-section-label">ABOUT CODEIT</span>

              <h2>
                Your Placement Journey,
                <span> Simplified.</span>
              </h2>

              <p>
                CodeIT brings student preparation, performance tracking,
                coding practice, and career management together in one
                simple platform.
              </p>

              <div className="home-about-points">
                <div>
                  <span>✓</span>
                  <p>Organize your placement preparation</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>Practice technical and coding skills</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>Track your personal performance</p>
                </div>
              </div>

              <button
                className="home-about-button"
                onClick={goLogin}
              >
                Start Your Journey <span>→</span>
              </button>
            </div>

            <div className="home-about-visual">
              <div className="about-circle circle-large"></div>
              <div className="about-circle circle-medium"></div>
              <div className="about-circle circle-small"></div>

              <div className="about-trophy">🏆</div>
            </div>
          </div>
        </section>

        <section className="home-cta-section">
          <div className="home-cta-glow"></div>

          <div className="home-cta-content">
            <div className="home-cta-icon">🚀</div>

            <span className="home-section-label">START TODAY</span>

            <h2>
              Ready to Start Your <span>Placement Journey?</span>
            </h2>

            <p>
              Login to CodeIT and start preparing for your dream career.
            </p>

            <button className="home-cta-button" onClick={goLogin}>
              Login to CodeIT <span>→</span>
            </button>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-footer-brand">
          <div className="home-footer-logo">{"</>"}</div>

          <div>
            <strong>CodeIT</strong>
            <span>Student Placement Portal</span>
          </div>
        </div>

        <p>© 2026 CodeIT. Built for Engineering Students.</p>
      </footer>
    </div>
  );
}

export default Home;