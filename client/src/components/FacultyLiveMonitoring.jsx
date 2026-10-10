import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./FacultyLiveMonitoring.css";

const API_URL = "/api";

const FacultyLiveMonitoring = ({ darkMode, toggleTheme }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedSession, setSelectedSession] = useState(null);

  const getToken = () => {
    return localStorage.getItem("auth-token");
  };

  const fetchSessions = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/exam-monitoring`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load monitoring data."
        );
      }

      setSessions(data.sessions || []);
    } catch (err) {
      console.error("Live monitoring error:", err);
      setError(
        err.message || "Failed to load live monitoring data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions(true);

    const interval = setInterval(() => {
      fetchSessions(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchSessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const studentName =
        session.studentName?.toLowerCase() || "";

      const studentEmail =
        session.studentEmail?.toLowerCase() || "";

      const examTitle =
        session.examTitle?.toLowerCase() || "";

      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        studentName.includes(search) ||
        studentEmail.includes(search) ||
        examTitle.includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        session.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchTerm, statusFilter]);

  const statistics = useMemo(() => {
    const online = sessions.filter(
      (session) => session.status === "Online"
    ).length;

    const offline = sessions.filter(
      (session) => session.status === "Offline"
    ).length;

    const suspicious = sessions.filter(
      (session) =>
        Number(session.suspiciousActivity || 0) > 0
    ).length;

    const averageProgress =
      sessions.length > 0
        ? Math.round(
            sessions.reduce(
              (total, session) =>
                total + Number(session.progress || 0),
              0
            ) / sessions.length
          )
        : 0;

    return {
      total: sessions.length,
      online,
      offline,
      suspicious,
      averageProgress,
    };
  }, [sessions]);

  const formatTime = (seconds) => {
    const totalSeconds = Math.max(
      Number(seconds || 0),
      0
    );

    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const remainingSeconds =
      totalSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(
        2,
        "0"
      )}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(remainingSeconds).padStart(
        2,
        "0"
      )}`;
    }

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleString();
  };

  const getProgressClass = (progress) => {
    const value = Number(progress || 0);

    if (value >= 75) {
      return "progress-high";
    }

    if (value >= 40) {
      return "progress-medium";
    }

    return "progress-low";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Online":
        return "status-online";

      case "Offline":
        return "status-offline";

      case "Submitted":
        return "status-submitted";

      default:
        return "status-offline";
    }
  };

  const handleRefresh = () => {
    fetchSessions(false);
  };

  const handleView = (session) => {
    setSelectedSession(session);
  };

  const handleCloseModal = () => {
    setSelectedSession(null);
  };

  return (
    <div
      className={`faculty-monitor-page ${
        darkMode ? "monitor-dark" : ""
      }`}
    >
      {/* =========================================
          SIDEBAR
      ========================================= */}
      <aside className="monitor-sidebar">
        <div className="monitor-brand">
          <div className="monitor-brand-logo">
            C
          </div>

          <div>
            <h2>CodeIT</h2>
            <span>FACULTY PORTAL</span>
          </div>
        </div>

        <div className="monitor-sidebar-title">
          MONITORING
        </div>

        <nav className="monitor-nav">
          <button
            className="monitor-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-dashboard")
            }
          >
            <span>🏠</span>
            Dashboard
          </button>

          <button
            className="monitor-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-students")
            }
          >
            <span>👨‍🎓</span>
            Students
          </button>

          <button
            className="monitor-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-exams")
            }
          >
            <span>📝</span>
            Exams
          </button>

          <button
            className="monitor-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-questions")
            }
          >
            <span>❓</span>
            Question Bank
          </button>

          <button
            className="monitor-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-results")
            }
          >
            <span>📊</span>
            Results
          </button>

          <button className="monitor-nav-item active">
            <span>🔴</span>
            Live Monitoring
          </button>

          <button
            className="monitor-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-analytics")
            }
          >
            <span>📈</span>
            Analytics
          </button>

          <button
            className="monitor-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-announcements")
            }
          >
            <span>📢</span>
            Announcements
          </button>

          <button
            className="monitor-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-schedule")
            }
          >
            <span>📅</span>
            Schedule
          </button>
        </nav>

        <div className="monitor-sidebar-bottom">
          <button
            className="monitor-nav-item"
            onClick={toggleTheme}
          >
            <span>{darkMode ? "☀️" : "🌙"}</span>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            className="monitor-nav-item logout-item"
            onClick={() => {
              localStorage.removeItem(
                "auth-token"
              );
              localStorage.removeItem(
                "placement-login"
              );
              localStorage.removeItem(
                "user-role"
              );

              window.location.href = "/login";
            }}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}
      <main className="monitor-main">
        {/* HEADER */}
        <header className="monitor-header">
          <div>
            <div className="monitor-breadcrumb">
              Faculty / Monitoring
            </div>

            <h1>Live Exam Monitoring</h1>

            <p>
              Monitor students currently attending
              online examinations.
            </p>
          </div>

          <div className="monitor-header-actions">
            <div className="live-indicator">
              <span className="live-dot"></span>
              LIVE
            </div>

            <button
              className="monitor-refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <span
                className={
                  refreshing
                    ? "refresh-spin"
                    : ""
                }
              >
                ↻
              </span>
              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </header>

        {/* =========================================
            STATISTICS
        ========================================= */}
        <section className="monitor-stats">
          <div className="monitor-stat-card">
            <div className="monitor-stat-icon blue">
              👥
            </div>

            <div>
              <span>Total Sessions</span>
              <strong>{statistics.total}</strong>
            </div>
          </div>

          <div className="monitor-stat-card">
            <div className="monitor-stat-icon green">
              🟢
            </div>

            <div>
              <span>Online Students</span>
              <strong>
                {statistics.online}
              </strong>
            </div>
          </div>

          <div className="monitor-stat-card">
            <div className="monitor-stat-icon gray">
              ⚪
            </div>

            <div>
              <span>Offline</span>
              <strong>
                {statistics.offline}
              </strong>
            </div>
          </div>

          <div className="monitor-stat-card">
            <div className="monitor-stat-icon red">
              ⚠️
            </div>

            <div>
              <span>Suspicious Activity</span>
              <strong>
                {statistics.suspicious}
              </strong>
            </div>
          </div>

          <div className="monitor-stat-card">
            <div className="monitor-stat-icon purple">
              📊
            </div>

            <div>
              <span>Average Progress</span>
              <strong>
                {statistics.averageProgress}%
              </strong>
            </div>
          </div>
        </section>

        {/* =========================================
            FILTER BAR
        ========================================= */}
        <section className="monitor-toolbar">
          <div className="monitor-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search student or exam..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          <div className="monitor-filter">
            <label>Status:</label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">All</option>
              <option value="Online">
                Online
              </option>
              <option value="Offline">
                Offline
              </option>
              <option value="Submitted">
                Submitted
              </option>
            </select>
          </div>

          <div className="monitor-result-count">
            Showing{" "}
            <strong>
              {filteredSessions.length}
            </strong>{" "}
            students
          </div>
        </section>

        {/* =========================================
            ERROR
        ========================================= */}
        {error && (
          <div className="monitor-error">
            <div>
              <strong>
                Unable to load monitoring data
              </strong>

              <p>{error}</p>
            </div>

            <button
              onClick={() =>
                fetchSessions(true)
              }
            >
              Try Again
            </button>
          </div>
        )}

        {/* =========================================
            LOADING
        ========================================= */}
        {loading ? (
          <div className="monitor-loading">
            <div className="loading-spinner"></div>

            <h3>
              Loading live monitoring...
            </h3>

            <p>
              Please wait while we fetch active
              exam sessions.
            </p>
          </div>
        ) : filteredSessions.length === 0 ? (
          /* =========================================
              EMPTY STATE
          ========================================= */
          <div className="monitor-empty">
            <div className="empty-icon">
              👥
            </div>

            <h3>No active exam sessions</h3>

            <p>
              Students currently attending exams
              will appear here automatically.
            </p>

            <button
              onClick={handleRefresh}
              className="empty-refresh-btn"
            >
              Refresh
            </button>
          </div>
        ) : (
          /* =========================================
              MONITORING TABLE
          ========================================= */
          <section className="monitor-table-card">
            <div className="table-card-header">
              <div>
                <h2>Active Students</h2>

                <p>
                  Live exam session information
                </p>
              </div>

              <div className="auto-refresh-label">
                <span className="pulse-dot"></span>
                Auto-refresh: 5 sec
              </div>
            </div>

            <div className="monitor-table-wrapper">
              <table className="monitor-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Exam</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Questions</th>
                    <th>Time Left</th>
                    <th>Activity</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSessions.map(
                    (session) => {
                      const progress = Math.min(
                        Math.max(
                          Number(
                            session.progress || 0
                          ),
                          0
                        ),
                        100
                      );

                      const answered =
                        Number(
                          session.answeredQuestions ||
                            0
                        );

                      const total =
                        Number(
                          session.totalQuestions ||
                            0
                        );

                      const suspicious =
                        Number(
                          session.suspiciousActivity ||
                            0
                        );

                      return (
                        <tr
                          key={
                            session._id
                          }
                        >
                          {/* STUDENT */}
                          <td>
                            <div className="student-cell">
                              <div className="student-avatar">
                                {session.studentName
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "S"}
                              </div>

                              <div className="student-info">
                                <strong>
                                  {
                                    session.studentName
                                  }
                                </strong>

                                <span>
                                  {
                                    session.studentEmail
                                  }
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* EXAM */}
                          <td>
                            <div className="exam-cell">
                              <strong>
                                {
                                  session.examTitle
                                }
                              </strong>

                              <span>
                                {session.examType ||
                                  "MCQ"}
                              </span>
                            </div>
                          </td>

                          {/* STATUS */}
                          <td>
                            <span
                              className={`session-status ${getStatusClass(
                                session.status
                              )}`}
                            >
                              <span className="status-dot"></span>
                              {
                                session.status
                              }
                            </span>
                          </td>

                          {/* PROGRESS */}
                          <td>
                            <div className="progress-cell">
                              <div className="progress-top">
                                <span>
                                  Progress
                                </span>

                                <strong>
                                  {progress}%
                                </strong>
                              </div>

                              <div className="progress-track">
                                <div
                                  className={`progress-fill ${getProgressClass(
                                    progress
                                  )}`}
                                  style={{
                                    width: `${progress}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          {/* QUESTIONS */}
                          <td>
                            <div className="question-count">
                              <strong>
                                {answered}
                              </strong>

                              <span>
                                / {total}
                              </span>
                            </div>
                          </td>

                          {/* TIME */}
                          <td>
                            <div
                              className={`time-left ${
                                Number(
                                  session.timeRemaining ||
                                    0
                                ) <= 300
                                  ? "time-warning"
                                  : ""
                              }`}
                            >
                              ⏱{" "}
                              {formatTime(
                                session.timeRemaining
                              )}
                            </div>
                          </td>

                          {/* ACTIVITY */}
                          <td>
                            {suspicious > 0 ? (
                              <span className="activity-warning">
                                ⚠️ {suspicious}
                              </span>
                            ) : (
                              <span className="activity-safe">
                                ✓ Normal
                              </span>
                            )}
                          </td>

                          {/* ACTION */}
                          <td>
                            <button
                              className="view-session-btn"
                              onClick={() =>
                                handleView(
                                  session
                                )
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* LAST UPDATED */}
        {!loading && (
          <div className="last-updated">
            Last updated:{" "}
            {new Date().toLocaleTimeString()}
          </div>
        )}
      </main>

      {/* =========================================
          STUDENT DETAILS MODAL
      ========================================= */}
      {selectedSession && (
        <div
          className="monitor-modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="monitor-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <span className="modal-label">
                  LIVE SESSION
                </span>

                <h2>
                  {
                    selectedSession.studentName
                  }
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>

            <div className="modal-status-row">
              <span
                className={`session-status ${getStatusClass(
                  selectedSession.status
                )}`}
              >
                <span className="status-dot"></span>
                {selectedSession.status}
              </span>

              <span className="modal-live">
                <span></span>
                Live Session
              </span>
            </div>

            <div className="modal-details">
              <div className="detail-item">
                <span>Student Email</span>
                <strong>
                  {
                    selectedSession.studentEmail
                  }
                </strong>
              </div>

              <div className="detail-item">
                <span>Student ID</span>
                <strong>
                  {selectedSession.studentId ||
                    "N/A"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Exam</span>
                <strong>
                  {
                    selectedSession.examTitle
                  }
                </strong>
              </div>

              <div className="detail-item">
                <span>Exam Type</span>
                <strong>
                  {
                    selectedSession.examType ||
                    "MCQ"
                  }
                </strong>
              </div>

              <div className="detail-item">
                <span>Questions Answered</span>
                <strong>
                  {
                    selectedSession.answeredQuestions ||
                    0
                  }{" "}
                  /{" "}
                  {
                    selectedSession.totalQuestions ||
                    0
                  }
                </strong>
              </div>

              <div className="detail-item">
                <span>Time Remaining</span>
                <strong>
                  {formatTime(
                    selectedSession.timeRemaining
                  )}
                </strong>
              </div>

              <div className="detail-item">
                <span>Progress</span>
                <strong>
                  {
                    selectedSession.progress ||
                    0
                  }
                  %
                </strong>
              </div>

              <div className="detail-item">
                <span>Suspicious Activity</span>
                <strong
                  className={
                    Number(
                      selectedSession.suspiciousActivity ||
                        0
                    ) > 0
                      ? "danger-text"
                      : "safe-text"
                  }
                >
                  {
                    selectedSession.suspiciousActivity ||
                    0
                  }
                </strong>
              </div>

              <div className="detail-item full-width">
                <span>Started At</span>
                <strong>
                  {formatDate(
                    selectedSession.startedAt
                  )}
                </strong>
              </div>

              <div className="detail-item full-width">
                <span>Last Activity</span>
                <strong>
                  {formatDate(
                    selectedSession.lastActivity
                  )}
                </strong>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-close-btn"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyLiveMonitoring;