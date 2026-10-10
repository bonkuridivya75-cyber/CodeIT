import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./FacultyLeaderboard.css";

const API_URL = "/api";

const FacultyLeaderboard = ({ darkMode, toggleTheme }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("averageScore");

  const getToken = () => localStorage.getItem("auth-token");

  const fetchLeaderboard = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await fetch(
        `${API_URL}/analytics`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load leaderboard."
        );
      }

      setStudents(data.studentPerformance || []);
    } catch (err) {
      console.error("Leaderboard error:", err);
      setError(
        err.message || "Failed to load leaderboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();

    const interval = setInterval(() => {
      fetchLeaderboard(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  const filteredStudents = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    const filtered = students.filter((student) => {
      const name =
        student.studentName?.toLowerCase() || "";

      const email =
        student.studentEmail?.toLowerCase() || "";

      return (
        !search ||
        name.includes(search) ||
        email.includes(search)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "highestScore") {
        return (
          Number(b.highestScore || 0) -
          Number(a.highestScore || 0)
        );
      }

      if (sortBy === "examsAttempted") {
        return (
          Number(b.examsAttempted || 0) -
          Number(a.examsAttempted || 0)
        );
      }

      return (
        Number(b.averageScore || 0) -
        Number(a.averageScore || 0)
      );
    });
  }, [students, searchTerm, sortBy]);

  const statistics = useMemo(() => {
    if (!students.length) {
      return {
        total: 0,
        average: 0,
        highest: 0,
      };
    }

    const totalAverage =
      students.reduce(
        (sum, student) =>
          sum + Number(student.averageScore || 0),
        0
      ) / students.length;

    const highest = Math.max(
      ...students.map((student) =>
        Number(student.highestScore || 0)
      )
    );

    return {
      total: students.length,
      average: totalAverage.toFixed(2),
      highest,
    };
  }, [students]);

  const getRankClass = (index) => {
    if (index === 0) return "rank-first";
    if (index === 1) return "rank-second";
    if (index === 2) return "rank-third";
    return "";
  };

  return (
    <div
      className={`faculty-leaderboard-page ${
        darkMode ? "leaderboard-dark" : ""
      }`}
    >
      {/* SIDEBAR */}
      <aside className="leaderboard-sidebar">
        <div className="leaderboard-brand">
          <div className="leaderboard-logo">
            C
          </div>

          <div>
            <h2>CodeIT</h2>
            <span>FACULTY PORTAL</span>
          </div>
        </div>

        <div className="leaderboard-sidebar-title">
          FACULTY MENU
        </div>

        <nav className="leaderboard-nav">
          <button
            className="leaderboard-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-dashboard")
            }
          >
            <span>🏠</span>
            Dashboard
          </button>

          <button
            className="leaderboard-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-students")
            }
          >
            <span>👨‍🎓</span>
            Students
          </button>

          <button
            className="leaderboard-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-exams")
            }
          >
            <span>📝</span>
            Exams
          </button>

          <button
            className="leaderboard-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-questions")
            }
          >
            <span>❓</span>
            Question Bank
          </button>

          <button
            className="leaderboard-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-results")
            }
          >
            <span>📊</span>
            Results
          </button>

          <button
            className="leaderboard-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-live-monitoring")
            }
          >
            <span>🔴</span>
            Live Monitoring
          </button>

          <button className="leaderboard-nav-item active">
            <span>🏆</span>
            Leaderboard
          </button>

          <button
            className="leaderboard-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-analytics")
            }
          >
            <span>📈</span>
            Analytics
          </button>

          <button
            className="leaderboard-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-announcements")
            }
          >
            <span>📢</span>
            Announcements
          </button>

          <button
            className="leaderboard-nav-item"
            onClick={() =>
              (window.location.href =
                "/faculty-schedule")
            }
          >
            <span>📅</span>
            Schedule
          </button>
        </nav>

        <div className="leaderboard-sidebar-bottom">
          <button
            className="leaderboard-nav-item"
            onClick={toggleTheme}
          >
            <span>{darkMode ? "☀️" : "🌙"}</span>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            className="leaderboard-nav-item logout"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="leaderboard-main">
        <header className="leaderboard-header">
          <div>
            <div className="leaderboard-breadcrumb">
              Faculty / Leaderboard
            </div>

            <h1>Student Leaderboard</h1>

            <p>
              View student performance based on completed
              examinations.
            </p>
          </div>

          <button
            className="leaderboard-refresh"
            onClick={() =>
              fetchLeaderboard(false)
            }
            disabled={refreshing}
          >
            <span
              className={
                refreshing ? "refresh-animation" : ""
              }
            >
              ↻
            </span>

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </header>

        {/* STATISTICS */}
        <section className="leaderboard-stats">
          <div className="leaderboard-stat-card">
            <div className="stat-icon blue">
              👨‍🎓
            </div>

            <div>
              <span>Total Students</span>
              <strong>{statistics.total}</strong>
            </div>
          </div>

          <div className="leaderboard-stat-card">
            <div className="stat-icon green">
              📊
            </div>

            <div>
              <span>Average Score</span>
              <strong>
                {statistics.average}
              </strong>
            </div>
          </div>

          <div className="leaderboard-stat-card">
            <div className="stat-icon gold">
              🏆
            </div>

            <div>
              <span>Highest Score</span>
              <strong>
                {statistics.highest}
              </strong>
            </div>
          </div>
        </section>

        {/* TOP 3 */}
        {!loading && students.length > 0 && (
          <section className="top-students">
            <div className="top-student-card first">
              <div className="top-rank">1</div>
              <div className="top-avatar">
                {students[0]?.studentName
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <span className="top-medal">
                🥇
              </span>

              <h3>
                {students[0]?.studentName}
              </h3>

              <p>
                {students[0]?.studentEmail}
              </p>

              <strong>
                {Number(
                  students[0]?.averageScore || 0
                ).toFixed(2)}
              </strong>

              <span>Average Score</span>
            </div>

            {students[1] && (
              <div className="top-student-card second">
                <div className="top-rank">2</div>

                <div className="top-avatar">
                  {students[1]?.studentName
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <span className="top-medal">
                  🥈
                </span>

                <h3>
                  {students[1]?.studentName}
                </h3>

                <p>
                  {students[1]?.studentEmail}
                </p>

                <strong>
                  {Number(
                    students[1]?.averageScore || 0
                  ).toFixed(2)}
                </strong>

                <span>Average Score</span>
              </div>
            )}

            {students[2] && (
              <div className="top-student-card third">
                <div className="top-rank">3</div>

                <div className="top-avatar">
                  {students[2]?.studentName
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <span className="top-medal">
                  🥉
                </span>

                <h3>
                  {students[2]?.studentName}
                </h3>

                <p>
                  {students[2]?.studentEmail}
                </p>

                <strong>
                  {Number(
                    students[2]?.averageScore || 0
                  ).toFixed(2)}
                </strong>

                <span>Average Score</span>
              </div>
            )}
          </section>
        )}

        {/* SEARCH + SORT */}
        <section className="leaderboard-toolbar">
          <div className="leaderboard-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          <div className="leaderboard-sort">
            <label>Sort By</label>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="averageScore">
                Average Score
              </option>

              <option value="highestScore">
                Highest Score
              </option>

              <option value="examsAttempted">
                Exams Attempted
              </option>
            </select>
          </div>

          <div className="leaderboard-count">
            Showing{" "}
            <strong>
              {filteredStudents.length}
            </strong>{" "}
            students
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="leaderboard-error">
            <div>
              <strong>
                Unable to load leaderboard
              </strong>

              <p>{error}</p>
            </div>

            <button
              onClick={() =>
                fetchLeaderboard(true)
              }
            >
              Try Again
            </button>
          </div>
        )}

        {/* TABLE */}
        {loading ? (
          <div className="leaderboard-loading">
            <div className="loading-spinner"></div>

            <h3>
              Loading leaderboard...
            </h3>

            <p>
              Fetching student performance data.
            </p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="leaderboard-empty">
            <div>🏆</div>

            <h3>No students found</h3>

            <p>
              Student performance will appear here
              after examinations are completed.
            </p>
          </div>
        ) : (
          <section className="leaderboard-table-card">
            <div className="leaderboard-table-header">
              <div>
                <h2>Student Rankings</h2>

                <p>
                  Performance based on examination
                  results
                </p>
              </div>

              <span>
                Updated automatically
              </span>
            </div>

            <div className="leaderboard-table-wrapper">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th>Exams Attempted</th>
                    <th>Average Score</th>
                    <th>Highest Score</th>
                    <th>Performance</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map(
                    (student, index) => {
                      const score = Number(
                        student.averageScore || 0
                      );

                      let performance =
                        "Needs Improvement";

                      if (score >= 75) {
                        performance = "Excellent";
                      } else if (score >= 60) {
                        performance = "Good";
                      } else if (score >= 40) {
                        performance = "Average";
                      }

                      return (
                        <tr
                          key={
                            student.studentEmail ||
                            index
                          }
                        >
                          <td>
                            <div
                              className={`rank-number ${getRankClass(
                                index
                              )}`}
                            >
                              {index + 1}
                            </div>
                          </td>

                          <td>
                            <div className="leader-student">
                              <div className="leader-avatar">
                                {student.studentName
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "S"}
                              </div>

                              <div>
                                <strong>
                                  {
                                    student.studentName
                                  }
                                </strong>

                                <span>
                                  {
                                    student.studentEmail
                                  }
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <strong className="exam-number">
                              {
                                student.examsAttempted
                              }
                            </strong>
                          </td>

                          <td>
                            <div className="score-cell">
                              <strong>
                                {score.toFixed(2)}
                              </strong>

                              <div className="score-bar">
                                <div
                                  style={{
                                    width: `${Math.min(
                                      score,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <strong className="highest-score">
                              {Number(
                                student.highestScore ||
                                  0
                              ).toFixed(2)}
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`performance-badge ${
                                performance
                                  .toLowerCase()
                                  .replace(
                                    " ",
                                    "-"
                                  )
                              }`}
                            >
                              {performance}
                            </span>
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
      </main>
    </div>
  );
};

export default FacultyLeaderboard;