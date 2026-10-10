import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const scrollToSection = (id) => {
    setMenuOpen(false);

    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  return (
    <div className={darkMode ? "home-page dark" : "home-page"}>

      {/* ================= HEADER ================= */}

      <header className="home-header">

        <div
          className="home-logo"
          onClick={() => goTo("/")}
        >
          <div className="logo-icon">
            &lt;/&gt;
          </div>

          <div>
            <h2>CodeIT</h2>
            <span>STUDENT PLACEMENT PORTAL</span>
          </div>
        </div>

        <nav className={menuOpen ? "home-nav open" : "home-nav"}>

          <button
            type="button"
            onClick={() => goTo("/")}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("features")}
          >
            Features
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("about")}
          >
            About
          </button>

          <button
            type="button"
            className="login-nav-button"
            onClick={() => goTo("/login")}
          >
            Login →
          </button>

        </nav>

        <div className="header-actions">

          <button
            type="button"
            className="theme-button"
            onClick={toggleTheme}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

        </div>

      </header>

      {/* ================= HERO ================= */}

      <main>

        <section className="hero-section">

          <div className="hero-left">

            <div className="hero-badge">
              <span>●</span>
              Smart Student Placement Platform
            </div>

            <h1>
              Build Your
              <br />

              <span className="gradient-text">
                Career
              </span>

              <br />

              With Confidence
            </h1>

            <p>
              CodeIT is a modern student placement platform
              designed for engineering students to prepare,
              practice, track performance, and build their
              career with confidence.
            </p>

            <div className="hero-buttons">

              <button
                type="button"
                className="primary-button"
                onClick={() => goTo("/register")}
              >
                🚀 Get Started →
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => goTo("/login")}
              >
                ▶ Explore Platform
              </button>

            </div>

          </div>

          {/* ================= DASHBOARD PREVIEW ================= */}

          <div className="hero-right">

            <div className="dashboard-preview">

              <div className="preview-top">

                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <span>CodeIT Dashboard</span>

                <strong>● LIVE</strong>

              </div>

              <div className="preview-content">

                <div className="preview-title">

                  <div className="preview-avatar">
                    CI
                  </div>

                  <div>
                    <h3>Student Dashboard</h3>
                    <p>Welcome back 👋</p>
                  </div>

                </div>

                <div className="preview-cards">

                  <div>
                    <span>📚</span>
                    <small>Applications</small>
                    <strong>12</strong>
                  </div>

                  <div>
                    <span>💻</span>
                    <small>Coding Score</small>
                    <strong>86%</strong>
                  </div>

                  <div>
                    <span>🎯</span>
                    <small>Preparation</small>
                    <strong>78%</strong>
                  </div>

                </div>

                <div className="performance-card">

                  <div className="performance-heading">
                    <div>
                      <small>Performance Overview</small>
                      <strong>+18.6%</strong>
                    </div>

                    <span>This Month</span>
                  </div>

                  <div className="fake-chart">
                    <div className="chart-line"></div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ================= FEATURES ================= */}

        <section
          id="features"
          className="features-section"
        >

          <div className="section-heading">

            <span>FEATURES</span>

            <h2>
              Everything You Need to
              <br />
              <strong>Prepare for Your Career</strong>
            </h2>

            <p>
              Practice coding, attend exams and track your
              progress in one place.
            </p>

          </div>

          <div className="feature-grid">

            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Coding Practice</h3>
              <p>
                Solve programming problems and improve your
                coding skills.
              </p>

              <button
                type="button"
                onClick={() => goTo("/coding-practice")}
              >
                Practice Now →
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Online Exams</h3>
              <p>
                Attend coding and MCQ exams created by faculty.
              </p>

              <button
                type="button"
                onClick={() => goTo("/login")}
              >
                Attend Exam →
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Performance</h3>
              <p>
                Monitor your exam results and coding progress.
              </p>

              <button
                type="button"
                onClick={() => goTo("/login")}
              >
                View Performance →
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Placement Preparation</h3>
              <p>
                Build skills and prepare for your placement
                journey.
              </p>

              <button
                type="button"
                onClick={() => goTo("/register")}
              >
                Get Started →
              </button>
            </div>

          </div>

        </section>

        {/* ================= ABOUT ================= */}

        <section
          id="about"
          className="about-section"
        >

          <div className="about-content">

            <span className="section-label">
              ABOUT CODEIT
            </span>

            <h2>
              Learn. Practice.
              <span> Improve.</span>
            </h2>

            <p>
              CodeIT provides students with a single platform
              for coding practice, online assessments and
              performance tracking.
            </p>

            <p>
              Faculty can create exams and questions while
              students can attend exams and view their results.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => goTo("/register")}
            >
              Create Account →
            </button>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="home-footer">

        <div>
          <strong>CodeIT</strong>
          <p>
            Student Placement Portal
          </p>
        </div>

        <div className="footer-links">

          <button
            type="button"
            onClick={() => goTo("/")}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("features")}
          >
            Features
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("about")}
          >
            About
          </button>

          <button
            type="button"
            onClick={() => goTo("/login")}
          >
            Login
          </button>

        </div>

        <p>
          © 2026 CodeIT. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Home;