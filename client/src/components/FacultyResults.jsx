import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyResults.css";

const API_URL = "/api";

function FacultyResults({ darkMode, toggleTheme }) {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const loadResults = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/results`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load results."
        );
      }

      setResults(
        Array.isArray(data.results)
          ? data.results
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error("❌ Results loading error:", error);
      alert(error.message || "Unable to load results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const filteredResults = useMemo(() => {
    const value = search.trim().toLowerCase();

    return results.filter((result) => {
      const studentName =
        result.studentName ||
        result.student?.name ||
        "";

      const examName =
        result.examName ||
        result.exam?.title ||
        "";

      const status =
        result.status || "Completed";

      const matchesSearch =
        !value ||
        studentName.toLowerCase().includes(value) ||
        examName.toLowerCase().includes(value) ||
        String(
          result.registrationNumber ||
          result.studentId ||
          ""
        )
          .toLowerCase()
          .includes(value);

      const matchesFilter =
        filter === "All" || status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [results, search, filter]);

  const getScore = (result) => {
    if (result.score !== undefined) return result.score;
    if (result.marksObtained !== undefined)
      return result.marksObtained;
    return 0;
  };

  const getTotal = (result) => {
    if (result.totalMarks !== undefined)
      return result.totalMarks;

    if (result.total !== undefined)
      return result.total;

    return 0;
  };

  const getPercentage = (result) => {
    if (result.percentage !== undefined)
      return Number(result.percentage);

    const score = Number(getScore(result));
    const total = Number(getTotal(result));

    if (total > 0) {
      return (score / total) * 100;
    }

    return 0;
  };

  const completedCount = results.filter(
    (result) =>
      (result.status || "Completed") ===
      "Completed"
  ).length;

  const passedCount = results.filter(
    (result) => getPercentage(result) >= 40
  ).length;

  const averagePercentage =
    results.length > 0
      ? results.reduce(
          (sum, result) =>
            sum + getPercentage(result),
          0
        ) / results.length
      : 0;

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

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={`faculty-results-page ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* SIDEBAR */}

      <aside className="faculty-results-sidebar">
        <div className="faculty-results-brand">
          <div className="faculty-results-logo">
            C
          </div>

          <div>
            <h2>CodeIT</h2>
            <span>FACULTY PORTAL</span>
          </div>
        </div>

        <nav className="faculty-results-nav">
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

          <button className="active">
            <span>📊</span>
            Results
          </button>
        </nav>

        <div className="faculty-results-bottom">
          <button
            className="theme-button"
            onClick={toggleTheme}
          >
            {darkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <main className="faculty-results-main">
        <header className="faculty-results-header">
          <div>
            <h1>Exam Results</h1>
            <p>
              View and monitor student examination
              results.
            </p>
          </div>

          <button
            className="refresh-results-button"
            onClick={loadResults}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </header>

        {/* STATS */}

        <section className="results-stats">
          <div className="results-stat-card">
            <div className="results-stat-icon">
              📊
            </div>

            <div>
              <span>Total Results</span>
              <strong>{results.length}</strong>
            </div>
          </div>

          <div className="results-stat-card">
            <div className="results-stat-icon">
              ✓
            </div>

            <div>
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>
          </div>

          <div className="results-stat-card">
            <div className="results-stat-icon">
              🎯
            </div>

            <div>
              <span>Passed</span>
              <strong>{passedCount}</strong>
            </div>
          </div>

          <div className="results-stat-card">
            <div className="results-stat-icon">
              %
            </div>

            <div>
              <span>Average Score</span>
              <strong>
                {averagePercentage.toFixed(1)}%
              </strong>
            </div>
          </div>
        </section>

        {/* FILTER */}

        <section className="results-filter-card">
          <div className="results-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search student, registration number or exam..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value)
            }
          >
            <option value="All">All Results</option>
            <option value="Completed">
              Completed
            </option>
            <option value="Pending">
              Pending
            </option>
          </select>
        </section>

        {/* RESULTS */}

        <section className="results-table-card">
          <div className="results-table-header">
            <div>
              <h2>Student Results</h2>
              <p>
                {filteredResults.length} result
                {filteredResults.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>
          </div>

          {loading ? (
            <div className="results-loading">
              <div className="results-spinner"></div>
              <p>Loading results...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="results-empty">
              <div>📊</div>
              <h3>No results found</h3>
              <p>
                Student results will appear here
                after exams are submitted.
              </p>
            </div>
          ) : (
            <div className="results-table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Registration No.</th>
                    <th>Exam</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredResults.map(
                    (result, index) => {
                      const studentName =
                        result.studentName ||
                        result.student?.name ||
                        "Unknown Student";

                      const registrationNumber =
                        result.registrationNumber ||
                        result.studentId ||
                        result.student?.studentId ||
                        "-";

                      const examName =
                        result.examName ||
                        result.exam?.title ||
                        "Online Exam";

                      const score = getScore(result);
                      const total = getTotal(result);
                      const percentage =
                        getPercentage(result);

                      const status =
                        result.status ||
                        "Completed";

                      return (
                        <tr
                          key={
                            result._id ||
                            `${registrationNumber}-${index}`
                          }
                        >
                          <td>
                            <div className="student-result-name">
                              <div className="student-result-avatar">
                                {studentName
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <strong>
                                {studentName}
                              </strong>
                            </div>
                          </td>

                          <td>
                            {registrationNumber}
                          </td>

                          <td>{examName}</td>

                          <td>
                            <strong>
                              {score}
                            </strong>
                            {total > 0 &&
                              ` / ${total}`}
                          </td>

                          <td>
                            <strong>
                              {percentage.toFixed(
                                1
                              )}
                              %
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`result-status ${
                                status
                                  .toLowerCase()
                                  .replace(
                                    /\s+/g,
                                    "-"
                                  )
                              }`}
                            >
                              {status}
                            </span>
                          </td>

                          <td>
                            {formatDate(
                              result.createdAt ||
                                result.date ||
                                result.submittedAt
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

export default FacultyResults;