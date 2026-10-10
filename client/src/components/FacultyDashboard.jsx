import React from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyDashboard.css";

function FacultyDashboard({
  darkMode,
  toggleTheme,
}) {
  const navigate = useNavigate();

  const facultyName =
    localStorage.getItem(
      "user-name"
    ) || "Faculty";

  const facultyEmail =
    localStorage.getItem(
      "user-email"
    ) || "";

  const facultyId =
    localStorage.getItem(
      "faculty-id"
    ) || "Not Available";

  const designation =
    localStorage.getItem(
      "faculty-designation"
    ) || "Faculty";

  const department =
    localStorage.getItem(
      "department"
    ) || "Information Technology";

  /* =================================================
     LOGOUT
  ================================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "placement-login"
    );

    localStorage.removeItem(
      "user-role"
    );

    localStorage.removeItem(
      "auth-token"
    );

    localStorage.removeItem(
      "user-id"
    );

    localStorage.removeItem(
      "user-name"
    );

    localStorage.removeItem(
      "user-email"
    );

    localStorage.removeItem(
      "faculty-id"
    );

    localStorage.removeItem(
      "faculty-designation"
    );

    localStorage.removeItem(
      "department"
    );

    navigate("/login");
  };

  /* =================================================
     SIDEBAR ITEM
  ================================================= */

  const SidebarButton = ({
    icon,
    title,
    path,
    active = false,
  }) => {
    return (
      <button
        type="button"
        className={`sidebar-link ${
          active ? "active" : ""
        }`}
        onClick={() =>
          navigate(path)
        }
      >
        <span>{icon}</span>
        {title}
      </button>
    );
  };

  return (
    <div
      className={`faculty-dashboard ${
        darkMode
          ? "dark-mode"
          : ""
      }`}
    >

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="dashboard-sidebar">

        {/* LOGO */}

        <div className="dashboard-logo">

          <div className="logo-icon">
            {"</>"}
          </div>

          <div>
            <h2>CodeIT</h2>

            <p>
              FACULTY PORTAL
            </p>
          </div>

        </div>

        {/* MENU */}

        <div className="sidebar-menu">

          <p className="menu-title">
            MAIN MENU
          </p>

          <SidebarButton
            icon="🏠"
            title="Dashboard"
            path="/faculty-dashboard"
            active
          />

          <SidebarButton
            icon="👨‍🎓"
            title="Students"
            path="/faculty-students"
          />

          <SidebarButton
            icon="📝"
            title="Exams"
            path="/faculty-exams"
          />

          <SidebarButton
            icon="❓"
            title="Question Bank"
            path="/faculty-questions"
          />

          <SidebarButton
            icon="📊"
            title="Results"
            path="/faculty-results"
          />

          <SidebarButton
            icon="📈"
            title="Analytics"
            path="/faculty-analytics"
          />

          <SidebarButton
            icon="💻"
            title="Coding Submissions"
            path="/faculty-coding-submissions"
          />

          <p className="menu-title">
            MANAGEMENT
          </p>

          <SidebarButton
            icon="➕"
            title="Create Exam"
            path="/faculty-create-exam"
          />

          <SidebarButton
            icon="📢"
            title="Announcements"
            path="/faculty-announcements"
          />

          <SidebarButton
            icon="📅"
            title="Schedule"
            path="/faculty-schedule"
          />

          <SidebarButton
            icon="🔴"
            title="Live Monitoring"
            path="/faculty-live-monitoring"
          />

          <SidebarButton
            icon="🏆"
            title="Leaderboard"
            path="/faculty-leaderboard"
          />

          <SidebarButton
            icon="📚"
            title="Assignments"
            path="/faculty-assignments"
          />

          <SidebarButton
            icon="📄"
            title="Reports"
            path="/faculty-reports"
          />

        </div>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <button
            type="button"
            className="sidebar-link"
            onClick={() =>
              navigate(
                "/faculty-profile"
              )
            }
          >
            <span>👤</span>
            Profile & Settings
          </button>

          <button
            type="button"
            className="sidebar-link theme-sidebar-button"
            onClick={toggleTheme}
          >
            <span>
              {darkMode
                ? "☀️"
                : "🌙"}
            </span>

            {darkMode
              ? "Light Mode"
              : "Dark Mode"}
          </button>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div className="header-left">

            <p className="portal-label">
              FACULTY PORTAL
            </p>

            <h1>
              Welcome back,{" "}
              <span>
                {facultyName} 👋
              </span>
            </h1>

            <p className="header-description">
              Manage students, examinations,
              results and academic activities
              from one place.
            </p>

          </div>

          <div className="header-right">

            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
            >
              {darkMode
                ? "☀️ Light Mode"
                : "🌙 Dark Mode"}
            </button>

            <button
              type="button"
              className="notification-button"
              onClick={() =>
                navigate(
                  "/faculty-announcements"
                )
              }
            >
              🔔
            </button>

            <button
              type="button"
              className="faculty-profile-mini"
              onClick={() =>
                navigate(
                  "/faculty-profile"
                )
              }
            >

              <div className="faculty-avatar">
                {facultyName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>
                  {facultyName}
                </strong>

                <span>
                  {designation}
                </span>
              </div>

            </button>

          </div>

        </header>

        {/* =================================================
            WELCOME BANNER
        ================================================= */}

        <section className="welcome-banner">

          <div>

            <span className="banner-label">
              CODEIT FACULTY
            </span>

            <h2>
              Academic Management
              Dashboard
            </h2>

            <p>
              Monitor student performance,
              conduct examinations and manage
              your academic activities.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/faculty-create-exam"
                )
              }
            >
              + Create New Exam
            </button>

          </div>

          <div className="banner-icon">
            🎓
          </div>

        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="stats-grid">

          <div
            className="stat-card"
            onClick={() =>
              navigate(
                "/faculty-students"
              )
            }
          >
            <div className="stat-icon blue">
              👨‍🎓
            </div>

            <div>
              <p>
                Total Students
              </p>

              <h2>0</h2>

              <span>
                View student records →
              </span>
            </div>
          </div>

          <div
            className="stat-card"
            onClick={() =>
              navigate(
                "/faculty-exams"
              )
            }
          >
            <div className="stat-icon purple">
              📝
            </div>

            <div>
              <p>
                Total Exams
              </p>

              <h2>0</h2>

              <span>
                Manage examinations →
              </span>
            </div>
          </div>

          <div
            className="stat-card"
            onClick={() =>
              navigate(
                "/faculty-results"
              )
            }
          >
            <div className="stat-icon green">
              📊
            </div>

            <div>
              <p>
                Results
              </p>

              <h2>0</h2>

              <span>
                View results →
              </span>
            </div>
          </div>

          <div
            className="stat-card"
            onClick={() =>
              navigate(
                "/faculty-live-monitoring"
              )
            }
          >
            <div className="stat-icon orange">
              🔴
            </div>

            <div>
              <p>
                Live Students
              </p>

              <h2>0</h2>

              <span>
                Monitor exams →
              </span>
            </div>
          </div>

        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="dashboard-content-grid">

          <div className="learning-section">

            <div className="section-header">

              <div>
                <span>
                  QUICK ACTIONS
                </span>

                <h2>
                  Faculty Management
                </h2>
              </div>

            </div>

            <div className="learning-cards">

              <button
                type="button"
                className="learning-card"
                onClick={() =>
                  navigate(
                    "/faculty-create-exam"
                  )
                }
              >
                <div className="learning-icon">
                  📝
                </div>

                <div>
                  <strong>
                    Create Exam
                  </strong>

                  <p>
                    Create MCQ or coding
                    examinations.
                  </p>
                </div>

                <span>→</span>
              </button>

              <button
                type="button"
                className="learning-card"
                onClick={() =>
                  navigate(
                    "/faculty-questions"
                  )
                }
              >
                <div className="learning-icon">
                  ❓
                </div>

                <div>
                  <strong>
                    Question Bank
                  </strong>

                  <p>
                    Manage examination
                    questions.
                  </p>
                </div>

                <span>→</span>
              </button>

              <button
                type="button"
                className="learning-card"
                onClick={() =>
                  navigate(
                    "/faculty-analytics"
                  )
                }
              >
                <div className="learning-icon">
                  📈
                </div>

                <div>
                  <strong>
                    Analytics
                  </strong>

                  <p>
                    View student performance
                    analytics.
                  </p>
                </div>

                <span>→</span>
              </button>

              <button
                type="button"
                className="learning-card"
                onClick={() =>
                  navigate(
                    "/faculty-reports"
                  )
                }
              >
                <div className="learning-icon">
                  📄
                </div>

                <div>
                  <strong>
                    Reports
                  </strong>

                  <p>
                    Generate academic
                    reports.
                  </p>
                </div>

                <span>→</span>
              </button>

            </div>

          </div>

          {/* PROFILE CARD */}

          <div className="performance-section">

            <div className="section-header">

              <div>
                <span>
                  FACULTY ACCOUNT
                </span>

                <h2>
                  Profile
                </h2>
              </div>

            </div>

            <div className="performance-score">

              <div className="score-circle">
                <strong>
                  {facultyName
                    .charAt(0)
                    .toUpperCase()}
                </strong>

                <span>
                  FACULTY
                </span>
              </div>

              <div className="performance-details">

                <div>
                  <span>
                    Name
                  </span>

                  <strong>
                    {facultyName}
                  </strong>
                </div>

                <div>
                  <span>
                    Faculty ID
                  </span>

                  <strong>
                    {facultyId}
                  </strong>
                </div>

                <div>
                  <span>
                    Department
                  </span>

                  <strong>
                    {department}
                  </strong>
                </div>

                <div>
                  <span>
                    Email
                  </span>

                  <strong>
                    {facultyEmail ||
                      "Not available"}
                  </strong>
                </div>

              </div>

            </div>

            <button
              type="button"
              className="profile-action-button"
              onClick={() =>
                navigate(
                  "/faculty-profile"
                )
              }
            >
              View Profile & Settings
            </button>

          </div>

        </section>

        {/* =================================================
            MANAGEMENT SECTIONS
        ================================================= */}

        <section className="bottom-grid">

          <div className="activity-section">

            <div className="section-header">

              <div>
                <span>
                  MANAGEMENT
                </span>

                <h2>
                  Academic Tools
                </h2>
              </div>

            </div>

            <div className="activity-list">

              <button
                type="button"
                className="activity-item"
                onClick={() =>
                  navigate(
                    "/faculty-announcements"
                  )
                }
              >
                <div className="activity-icon">
                  📢
                </div>

                <div>
                  <strong>
                    Announcements
                  </strong>

                  <p>
                    Send updates to students.
                  </p>
                </div>

                <span>→</span>
              </button>

              <button
                type="button"
                className="activity-item"
                onClick={() =>
                  navigate(
                    "/faculty-schedule"
                  )
                }
              >
                <div className="activity-icon">
                  📅
                </div>

                <div>
                  <strong>
                    Exam Schedule
                  </strong>

                  <p>
                    Manage examination dates.
                  </p>
                </div>

                <span>→</span>
              </button>

              <button
                type="button"
                className="activity-item"
                onClick={() =>
                  navigate(
                    "/faculty-assignments"
                  )
                }
              >
                <div className="activity-icon">
                  📚
                </div>

                <div>
                  <strong>
                    Assignments
                  </strong>

                  <p>
                    Manage student assignments.
                  </p>
                </div>

                <span>→</span>
              </button>

              <button
                type="button"
                className="activity-item"
                onClick={() =>
                  navigate(
                    "/faculty-leaderboard"
                  )
                }
              >
                <div className="activity-icon">
                  🏆
                </div>

                <div>
                  <strong>
                    Leaderboard
                  </strong>

                  <p>
                    View student rankings.
                  </p>
                </div>

                <span>→</span>
              </button>

            </div>

          </div>

          {/* LIVE MONITORING */}

          <div className="exam-section">

            <div className="section-header">

              <div>
                <span>
                  LIVE MONITORING
                </span>

                <h2>
                  Examination Status
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/faculty-live-monitoring"
                  )
              }
              >
                View All
              </button>

            </div>

            <div className="exam-card">

              <div className="exam-status-icon">
                🔴
              </div>

              <div className="exam-info">

                <strong>
                  Live Exam Monitoring
                </strong>

                <p>
                  Monitor active student
                  examinations in real time.
                </p>

              </div>

              <span className="exam-arrow">
                →
              </span>

            </div>

            <div className="exam-card">

              <div className="exam-status-icon">
                📊
              </div>

              <div className="exam-info">

                <strong>
                  Performance Analytics
                </strong>

                <p>
                  Analyze examination
                  performance and results.
                </p>

              </div>

              <span className="exam-arrow">
                →
              </span>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default FacultyDashboard;