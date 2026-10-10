import React from "react";
import { useNavigate } from "react-router-dom";
import "./MyPerformance.css";

function MyPerformance() {
  const navigate = useNavigate();

  return (
    <div className="performance-page">

      {/* Background */}
      <div className="performance-glow performance-glow-one"></div>
      <div className="performance-glow performance-glow-two"></div>

      {/* Navbar */}
      <nav className="performance-navbar">
        <div className="performance-logo">
          <span>&lt;</span>CODE<span>IT</span><b>/&gt;</b>
        </div>

        <button
          className="performance-back"
          onClick={() => navigate("/student-dashboard")}
        >
          ← Dashboard
        </button>
      </nav>

      {/* Main */}
      <main className="performance-main">

        <div className="performance-heading">
          <p>STUDENT ANALYTICS</p>
          <h1>
            My <span>Performance</span>
          </h1>
          <div className="performance-line"></div>
          <p className="performance-description">
            Track your coding progress, problem-solving skills and
            overall learning performance.
          </p>
        </div>

        {/* Overall Stats */}
        <section className="performance-stats">

          <div className="performance-stat-card">
            <div className="performance-stat-icon">🎯</div>
            <div>
              <small>Overall Score</small>
              <strong>82%</strong>
              <span className="positive">↑ 8% this month</span>
            </div>
          </div>

          <div className="performance-stat-card">
            <div className="performance-stat-icon">💻</div>
            <div>
              <small>Problems Solved</small>
              <strong>128</strong>
              <span>of 200 problems</span>
            </div>
          </div>

          <div className="performance-stat-card">
            <div className="performance-stat-icon">🔥</div>
            <div>
              <small>Current Streak</small>
              <strong>12 Days</strong>
              <span className="positive">Keep going!</span>
            </div>
          </div>

          <div className="performance-stat-card">
            <div className="performance-stat-icon">🏆</div>
            <div>
              <small>Rank</small>
              <strong>#24</strong>
              <span>Among students</span>
            </div>
          </div>

        </section>

        {/* Progress */}
        <section className="performance-grid">

          <div className="performance-panel">
            <div className="panel-header">
              <div>
                <p>PROGRESS</p>
                <h2>Coding Progress</h2>
              </div>
              <span className="panel-badge">2026</span>
            </div>

            <div className="progress-chart">

              <div className="chart-bars">
                <div className="bar" style={{ height: "35%" }}>
                  <span>35</span>
                </div>

                <div className="bar" style={{ height: "48%" }}>
                  <span>48</span>
                </div>

                <div className="bar" style={{ height: "42%" }}>
                  <span>42</span>
                </div>

                <div className="bar" style={{ height: "65%" }}>
                  <span>65</span>
                </div>

                <div className="bar" style={{ height: "72%" }}>
                  <span>72</span>
                </div>

                <div className="bar" style={{ height: "82%" }}>
                  <span>82</span>
                </div>
              </div>

              <div className="chart-labels">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>

            </div>
          </div>

          {/* Difficulty */}
          <div className="performance-panel">
            <div className="panel-header">
              <div>
                <p>PROBLEM SOLVING</p>
                <h2>Difficulty Level</h2>
              </div>
            </div>

            <div className="difficulty-item">
              <div>
                <span>Easy</span>
                <strong>72 solved</strong>
              </div>
              <div className="difficulty-track">
                <div
                  className="difficulty-fill easy"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>

            <div className="difficulty-item">
              <div>
                <span>Medium</span>
                <strong>43 solved</strong>
              </div>
              <div className="difficulty-track">
                <div
                  className="difficulty-fill medium"
                  style={{ width: "55%" }}
                ></div>
              </div>
            </div>

            <div className="difficulty-item">
              <div>
                <span>Hard</span>
                <strong>13 solved</strong>
              </div>
              <div className="difficulty-track">
                <div
                  className="difficulty-fill hard"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>
          </div>

        </section>

        {/* Languages */}
        <section className="performance-panel languages-panel">

          <div className="panel-header">
            <div>
              <p>SKILLS</p>
              <h2>Programming Languages</h2>
            </div>
          </div>

          <div className="language-grid">

            <div className="language-card">
              <div className="language-top">
                <span>☕</span>
                <strong>Java</strong>
                <b>85%</b>
              </div>

              <div className="language-track">
                <div style={{ width: "85%" }}></div>
              </div>
            </div>

            <div className="language-card">
              <div className="language-top">
                <span>🐍</span>
                <strong>Python</strong>
                <b>78%</b>
              </div>

              <div className="language-track">
                <div style={{ width: "78%" }}></div>
              </div>
            </div>

            <div className="language-card">
              <div className="language-top">
                <span>©️</span>
                <strong>C</strong>
                <b>72%</b>
              </div>

              <div className="language-track">
                <div style={{ width: "72%" }}></div>
              </div>
            </div>

            <div className="language-card">
              <div className="language-top">
                <span>🌐</span>
                <strong>JavaScript</strong>
                <b>65%</b>
              </div>

              <div className="language-track">
                <div style={{ width: "65%" }}></div>
              </div>
            </div>

          </div>
        </section>

        {/* Recent Activity */}
        <section className="performance-panel">

          <div className="panel-header">
            <div>
              <p>ACTIVITY</p>
              <h2>Recent Coding Activity</h2>
            </div>
          </div>

          <div className="performance-activity">

            <div className="activity-row">
              <span className="activity-icon success">✓</span>

              <div>
                <strong>Two Sum</strong>
                <small>Array • Easy</small>
              </div>

              <span className="activity-score">+10 XP</span>
            </div>

            <div className="activity-row">
              <span className="activity-icon success">✓</span>

              <div>
                <strong>Binary Search</strong>
                <small>Searching • Easy</small>
              </div>

              <span className="activity-score">+15 XP</span>
            </div>

            <div className="activity-row">
              <span className="activity-icon success">✓</span>

              <div>
                <strong>Linked List Cycle</strong>
                <small>Linked List • Medium</small>
              </div>

              <span className="activity-score">+20 XP</span>
            </div>

            <div className="activity-row">
              <span className="activity-icon warning">!</span>

              <div>
                <strong>Merge Intervals</strong>
                <small>Arrays • Medium</small>
              </div>

              <span className="activity-score">Retry</span>
            </div>

          </div>
        </section>

        {/* Bottom */}
        <div className="performance-actions">

          <button onClick={() => navigate("/coding-practice")}>
            💻 Continue Coding
          </button>

          <button onClick={() => navigate("/student-exam")}>
            📝 Take Coding Exam
          </button>

          <button onClick={() => navigate("/my-profile")}>
            👤 My Profile
          </button>

        </div>

      </main>
    </div>
  );
}

export default MyPerformance;