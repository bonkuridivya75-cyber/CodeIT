import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyCodingSubmissions.css";

const API_URL = "/api";

function FacultyCodingSubmissions({ darkMode, toggleTheme }) {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadSubmissions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/coding-submissions`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load coding submissions."
        );
      }

      setSubmissions(
        Array.isArray(data.submissions)
          ? data.submissions
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "❌ Coding submissions error:",
        error
      );

      alert(
        error.message ||
          "Unable to load coding submissions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const getStudentName = (submission) =>
    submission.studentName ||
    submission.student?.name ||
    "Unknown Student";

  const getStudentId = (submission) =>
    submission.registrationNumber ||
    submission.studentId ||
    submission.student?.studentId ||
    "-";

  const getQuestionName = (submission) =>
    submission.questionTitle ||
    submission.question?.title ||
    "Coding Question";

  const getLanguage = (submission) =>
    submission.language || "Unknown";

  const getStatus = (submission) =>
    submission.status || "Submitted";

  const filteredSubmissions = useMemo(() => {
    const value = search.trim().toLowerCase();

    return submissions.filter((submission) => {
      const studentName =
        getStudentName(submission).toLowerCase();

      const studentId =
        getStudentId(submission)
          .toString()
          .toLowerCase();

      const question =
        getQuestionName(submission).toLowerCase();

      const language =
        getLanguage(submission).toLowerCase();

      const status = getStatus(submission);

      const matchesSearch =
        !value ||
        studentName.includes(value) ||
        studentId.includes(value) ||
        question.includes(value) ||
        language.includes(value);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    submissions,
    search,
    statusFilter,
  ]);

  const acceptedCount = submissions.filter(
    (item) =>
      getStatus(item).toLowerCase() ===
      "accepted"
  ).length;

  const failedCount = submissions.filter(
    (item) =>
      ["failed", "wrong answer", "runtime error", "compilation error"]
        .includes(
          getStatus(item).toLowerCase()
        )
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("placement-login");
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-role");

    navigate("/login");
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`faculty-coding-page ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* SIDEBAR */}

      <aside className="faculty-coding-sidebar">
        <div className="faculty-coding-brand">
          <div className="faculty-coding-logo">
            C
          </div>

          <div>
            <h2>CodeIT</h2>
            <span>FACULTY PORTAL</span>
          </div>
        </div>

        <nav className="faculty-coding-nav">
          <button
            onClick={() =>
              navigate("/faculty-dashboard")
            }
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/faculty-students")
            }
          >
            <span>👨‍🎓</span>
            Students
          </button>

          <button
            onClick={() =>
              navigate("/faculty-exams")
            }
          >
            <span>📝</span>
            Exams
          </button>

          <button
            onClick={() =>
              navigate("/faculty-questions")
            }
          >
            <span>❓</span>
            Questions
          </button>

          <button
            onClick={() =>
              navigate("/faculty-results")
            }
          >
            <span>📊</span>
            Results
          </button>

          <button className="active">
            <span>💻</span>
            Coding Submissions
          </button>
        </nav>

        <div className="faculty-coding-bottom">
          <button
            onClick={toggleTheme}
            className="theme-button"
          >
            {darkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <main className="faculty-coding-main">
        <header className="faculty-coding-header">
          <div>
            <h1>Coding Submissions</h1>

            <p>
              Monitor student coding submissions
              and execution results.
            </p>
          </div>

          <button
            className="refresh-coding-button"
            onClick={loadSubmissions}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </header>

        {/* STATS */}

        <section className="coding-stats">
          <div className="coding-stat-card">
            <div className="coding-stat-icon">
              💻
            </div>

            <div>
              <span>Total Submissions</span>
              <strong>
                {submissions.length}
              </strong>
            </div>
          </div>

          <div className="coding-stat-card">
            <div className="coding-stat-icon">
              ✓
            </div>

            <div>
              <span>Accepted</span>
              <strong>{acceptedCount}</strong>
            </div>
          </div>

          <div className="coding-stat-card">
            <div className="coding-stat-icon">
              !
            </div>

            <div>
              <span>Failed</span>
              <strong>{failedCount}</strong>
            </div>
          </div>

          <div className="coding-stat-card">
            <div className="coding-stat-icon">
              🔎
            </div>

            <div>
              <span>Showing</span>
              <strong>
                {filteredSubmissions.length}
              </strong>
            </div>
          </div>
        </section>

        {/* FILTERS */}

        <section className="coding-filter-card">
          <div className="coding-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search student, question or language..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Status
            </option>
            <option value="Accepted">
              Accepted
            </option>
            <option value="Failed">
              Failed
            </option>
            <option value="Wrong Answer">
              Wrong Answer
            </option>
            <option value="Runtime Error">
              Runtime Error
            </option>
            <option value="Compilation Error">
              Compilation Error
            </option>
          </select>
        </section>

        {/* TABLE */}

        <section className="coding-table-card">
          <div className="coding-table-header">
            <div>
              <h2>Submission History</h2>

              <p>
                {filteredSubmissions.length} submission
                {filteredSubmissions.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>
          </div>

          {loading ? (
            <div className="coding-loading">
              <div className="coding-spinner"></div>
              <p>
                Loading submissions...
              </p>
            </div>
          ) : filteredSubmissions.length ===
            0 ? (
            <div className="coding-empty">
              <div>💻</div>

              <h3>
                No submissions found
              </h3>

              <p>
                Student coding submissions will
                appear here.
              </p>
            </div>
          ) : (
            <div className="coding-table-wrapper">
              <table className="coding-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Question</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Score</th>
                    <th>Submitted</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSubmissions.map(
                    (submission, index) => {
                      const studentName =
                        getStudentName(
                          submission
                        );

                      const status =
                        getStatus(submission);

                      const score =
                        submission.score ??
                        submission.marks ??
                        "-";

                      return (
                        <tr
                          key={
                            submission._id ||
                            index
                          }
                        >
                          <td>
                            <div className="coding-student">
                              <div className="coding-avatar">
                                {studentName
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {studentName}
                                </strong>

                                <small>
                                  {getStudentId(
                                    submission
                                  )}
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            {getQuestionName(
                              submission
                            )}
                          </td>

                          <td>
                            <span className="language-badge">
                              {getLanguage(
                                submission
                              )}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`coding-status ${status
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {status}
                            </span>
                          </td>

                          <td>
                            <strong>
                              {score}
                            </strong>
                          </td>

                          <td>
                            {formatDate(
                              submission.createdAt ||
                                submission.submittedAt ||
                                submission.date
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default FacultyCodingSubmissions;