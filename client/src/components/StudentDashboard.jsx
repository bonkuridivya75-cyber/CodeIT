import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "./StudentDashboard.css";


function StudentDashboard() {
  const navigate = useNavigate();

  /* =====================================================
     STUDENT DATA
  ===================================================== */

  const [studentName, setStudentName] =
    useState("Student");

  const [darkMode, setDarkMode] =
    useState(true);

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  const [
    unreadNotifications,
    setUnreadNotifications,
  ] = useState(0);

  /* =====================================================
     LOAD STUDENT DATA + THEME
  ===================================================== */

  useEffect(() => {
    const savedName =
      localStorage.getItem("user-name");

    if (
      savedName &&
      savedName.trim()
    ) {
      setStudentName(
        savedName.trim()
      );
    }

    const savedTheme =
      localStorage.getItem(
        "student-theme"
      );

    if (
      savedTheme === "light"
    ) {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  }, []);

  /* =====================================================
     FETCH UNREAD NOTIFICATIONS
  ===================================================== */

  const fetchUnreadNotifications =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "auth-token"
          );

        const email =
          localStorage.getItem(
            "user-email"
          ) || "";

        if (!token || !email) {
          setUnreadNotifications(0);
          return;
        }

        const response =
          await fetch(
            `/api/notifications/unread-count?email=${encodeURIComponent(
              email
            )}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          response.ok &&
          data.success
        ) {
          setUnreadNotifications(
            data.count || 0
          );
        }
      } catch (error) {
        console.error(
          "Unread notification error:",
          error
        );
      }
    };

  /* =====================================================
     LOAD NOTIFICATION COUNT
  ===================================================== */

  useEffect(() => {
    fetchUnreadNotifications();

    /*
      Refresh notification count every
      30 seconds.
    */

    const interval =
      setInterval(
        fetchUnreadNotifications,
        30000
      );

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* =====================================================
     REFRESH WHEN PAGE BECOMES ACTIVE
  ===================================================== */

  useEffect(() => {
    const handleFocus = () => {
      fetchUnreadNotifications();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const goTo = (path) => {
    navigate(path);
  };

  /* =====================================================
     THEME
  ===================================================== */

  const toggleTheme = () => {
    setDarkMode(
      (previousMode) => {
        const newMode =
          !previousMode;

        localStorage.setItem(
          "student-theme",
          newMode
            ? "dark"
            : "light"
        );

        localStorage.setItem(
          "placement-theme",
          newMode
            ? "dark"
            : "light"
        );

        return newMode;
      }
    );
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem(
      "placement-login"
    );

    localStorage.removeItem(
      "user-role"
    );

    localStorage.removeItem(
      "user-email"
    );

    localStorage.removeItem(
      "user-name"
    );

    localStorage.removeItem(
      "auth-token"
    );

    localStorage.removeItem(
      "current-battle-id"
    );

    localStorage.removeItem(
      "user-id"
    );

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };

  /* =====================================================
     STUDENT INITIAL
  ===================================================== */

  const studentInitial =
    studentName &&
    studentName.trim()
      ? studentName
          .trim()
          .charAt(0)
          .toUpperCase()
      : "S";

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className={
        darkMode
          ? "student-dashboard dark-mode"
          : "student-dashboard light-mode"
      }
    >

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="student-sidebar">

        {/* LOGO */}

        <div className="sidebar-logo">

          <div className="logo-symbol">
            {"</>"}
          </div>

          <div className="logo-text">
            CODE<span>IT</span>
          </div>

        </div>

        {/* STUDENT MINI PROFILE */}

        <div className="student-mini-profile">

          <div className="student-avatar">
            {studentInitial}
          </div>

          <div className="student-mini-info">

            <h4>
              {studentName}
            </h4>

            <span>
              Student
            </span>

          </div>

        </div>

        {/* SIDEBAR MENU */}

        <nav className="sidebar-menu">

          {/* DASHBOARD */}

          <button
            type="button"
            className="sidebar-link active"
            onClick={() =>
              goTo(
                "/student-dashboard"
              )
            }
          >
            <span className="sidebar-icon">
              📊
            </span>

            <span>
              Dashboard
            </span>
          </button>

          {/* MY EXAMS */}

          <button
            type="button"
            className="sidebar-link"
            onClick={() =>
              goTo(
                "/student-exams"
              )
            }
          >
            <span className="sidebar-icon">
              📝
            </span>

            <span>
              My Exams
            </span>
          </button>

          {/* RESULTS */}

          <button
            type="button"
            className="sidebar-link"
            onClick={() =>
              goTo(
                "/student-results"
              )
            }
          >
            <span className="sidebar-icon">
              🏆
            </span>

            <span>
              Results
            </span>
          </button>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <button
            type="button"
            className="sidebar-link notification-sidebar-link"
            onClick={() =>
              goTo(
                "/student-notifications"
              )
            }
          >
            <span className="sidebar-icon">
              🔔
            </span>

            <span>
              Notifications
            </span>

            {unreadNotifications >
              0 && (
              <span className="notification-badge">
                {unreadNotifications >
                99
                  ? "99+"
                  : unreadNotifications}
              </span>
            )}
          </button>

          {/* CODE BATTLE */}

          <button
            type="button"
            className="sidebar-link code-battle-link"
            onClick={() =>
              goTo(
                "/create-battle"
              )
            }
          >
            <span className="sidebar-icon">
              ⚔️
            </span>

            <span>
              Code Battle
            </span>

            <span className="battle-new-badge">
              NEW
            </span>
          </button>

          {/* PROFILE */}

          <button
            type="button"
            className="sidebar-link"
            onClick={() =>
              goTo(
                "/student-profile"
              )
            }
          >
            <span className="sidebar-icon">
              👤
            </span>

            <span>
              Profile
            </span>
          </button>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          {/* THEME */}

          <button
            type="button"
            className="sidebar-link theme-button"
            onClick={
              toggleTheme
            }
          >
            <span className="sidebar-icon">
              {darkMode
                ? "☀️"
                : "🌙"}
            </span>

            <span>
              {darkMode
                ? "Light Mode"
                : "Dark Mode"}
            </span>
          </button>

          {/* LOGOUT */}

          <button
            type="button"
            className="sidebar-link logout-button"
            onClick={
              handleLogout
            }
          >
            <span className="sidebar-icon">
              🚪
            </span>

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="student-main">

        {/* TOP BAR */}

        <header className="student-topbar">

          <div>

            <p className="topbar-small">
              Student Portal
            </p>

            <h1>
              Welcome back,{" "}
              <span>
                {studentName}
              </span>
              {" "}👋
            </h1>

          </div>

          <div className="topbar-actions">

            {/* NOTIFICATION BUTTON */}

            <button
              type="button"
              className="topbar-notification-button"
              onClick={() =>
                goTo(
                  "/student-notifications"
                )
              }
              title="Notifications"
            >
              🔔

              {unreadNotifications >
                0 && (
                <span className="topbar-notification-badge">
                  {unreadNotifications >
                  99
                    ? "99+"
                    : unreadNotifications}
                </span>
              )}
            </button>

            {/* TOPBAR THEME */}

            <button
              type="button"
              className="topbar-theme-button"
              onClick={
                toggleTheme
              }
              title={
                darkMode
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              {darkMode
                ? "☀️"
                : "🌙"}
            </button>

            {/* AVATAR */}

            <div className="topbar-avatar">
              {studentInitial}
            </div>

          </div>

        </header>

        {/* =================================================
            HERO SECTION
        ================================================= */}

        <section className="student-hero">

          <div className="hero-grid"></div>

          <div className="hero-glow hero-glow-one"></div>

          <div className="hero-glow hero-glow-two"></div>

          <div className="hero-content">

            <div className="hero-badge">

              <span className="live-dot"></span>

              CodeIT Student Dashboard

            </div>

            <h2>
              Build.
              <span>
                Practice.
              </span>
              Master.
            </h2>

            <p>
              Practice coding, attend exams,
              participate in Code Battles and
              track your progress.
            </p>

            <div className="hero-buttons">

              <button
                type="button"
                className="primary-action"
                onClick={() =>
                  goTo(
                    "/student-exams"
                  )
                }
              >
                📝 Start Exam
              </button>

              <button
                type="button"
                className="battle-action"
                onClick={() =>
                  goTo(
                    "/create-battle"
                  )
                }
              >
                ⚔️ Code Battle
              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            QUICK STATS
        ================================================= */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              📝
            </div>

            <div>

              <span>
                Total Exams
              </span>

              <strong>
                0
              </strong>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              🏆
            </div>

            <div>

              <span>
                Completed
              </span>

              <strong>
                0
              </strong>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              💻
            </div>

            <div>

              <span>
                Coding Practice
              </span>

              <strong>
                0
              </strong>

            </div>

          </div>

          <div
            className="stat-card battle-stat-card"
            onClick={() =>
              goTo(
                "/create-battle"
              )
            }
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {

              if (
                event.key ===
                  "Enter" ||
                event.key === " "
              ) {
                goTo(
                  "/create-battle"
                );
              }

            }}
          >

            <div className="stat-icon">
              ⚔️
            </div>

            <div>

              <span>
                Code Battle
              </span>

              <strong>
                Play
              </strong>

            </div>

          </div>

        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="quick-actions-section">

          <div className="section-heading">

            <div>

              <p>
                QUICK ACCESS
              </p>

              <h2>
                What do you want to do?
              </h2>

            </div>

          </div>

          <div className="quick-actions">

            {/* MY EXAMS */}

            <div
              className="quick-card"
              onClick={() =>
                goTo(
                  "/student-exams"
                )
              }
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {

                if (
                  event.key ===
                    "Enter" ||
                  event.key === " "
                ) {
                  goTo(
                    "/student-exams"
                  );
                }

              }}
            >

              <div className="quick-card-icon">
                📝
              </div>

              <h3>
                My Exams
              </h3>

              <p>
                View and attend your
                available exams.
              </p>

              <span>
                Open Exams →
              </span>

            </div>

            {/* CODING PRACTICE */}

            <div
              className="quick-card"
              onClick={() =>
                goTo(
                  "/coding-practice"
                )
              }
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {

                if (
                  event.key ===
                    "Enter" ||
                  event.key === " "
                ) {
                  goTo(
                    "/coding-practice"
                  );
                }

              }}
            >

              <div className="quick-card-icon">
                💻
              </div>

              <h3>
                Coding Practice
              </h3>

              <p>
                Solve coding problems
                and improve your skills.
              </p>

              <span>
                Practice Now →
              </span>

            </div>

            {/* CODE BATTLE */}

            <div
              className="quick-card battle-card"
              onClick={() =>
                goTo(
                  "/create-battle"
                )
              }
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {

                if (
                  event.key ===
                    "Enter" ||
                  event.key === " "
                ) {
                  goTo(
                    "/create-battle"
                  );
                }

              }}
            >

              <div className="quick-card-icon">
                ⚔️
              </div>

              <div className="battle-card-badge">
                LIVE
              </div>

              <h3>
                Code Battle
              </h3>

              <p>
                Challenge another student
                and compete in real time.
              </p>

              <span>
                Enter Battle →
              </span>

            </div>

            {/* RESULTS */}

            <div
              className="quick-card"
              onClick={() =>
                goTo(
                  "/student-results"
                )
              }
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {

                if (
                  event.key ===
                    "Enter" ||
                  event.key === " "
                ) {
                  goTo(
                    "/student-results"
                  );
                }

              }}
            >

              <div className="quick-card-icon">
                🏆
              </div>

              <h3>
                My Results
              </h3>

              <p>
                Check your exam results
                and performance.
              </p>

              <span>
                View Results →
              </span>

            </div>

            {/* NOTIFICATIONS */}

            <div
              className="quick-card notification-quick-card"
              onClick={() =>
                goTo(
                  "/student-notifications"
                )
              }
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {

                if (
                  event.key ===
                    "Enter" ||
                  event.key === " "
                ) {
                  goTo(
                    "/student-notifications"
                  );
                }

              }}
            >

              <div className="quick-card-icon">
                🔔
              </div>

              <h3>
                Notifications
              </h3>

              <p>
                View announcements,
                exams and assignment updates.
              </p>

              <span>
                {unreadNotifications > 0
                  ? `${unreadNotifications} Unread →`
                  : "View Notifications →"}
              </span>

            </div>

          </div>

        </section>

        {/* =================================================
            CODE BATTLE PROMOTION
        ================================================= */}

        <section className="battle-promotion">

          <div className="battle-promotion-grid"></div>

          <div className="battle-promotion-content">

            <div className="battle-promotion-icon">
              ⚔️
            </div>

            <div>

              <div className="battle-title-row">

                <h2>
                  Code Battle Arena
                </h2>

                <span>
                  NEW
                </span>

              </div>

              <p>
                Challenge another student,
                solve the same coding problem,
                and compete to finish first.
              </p>

            </div>

          </div>

          <button
            type="button"
            className="battle-start-button"
            onClick={() =>
              goTo(
                "/create-battle"
              )
            }
          >
            Start Battle →
          </button>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;