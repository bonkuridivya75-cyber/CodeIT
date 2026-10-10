import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentResults.css";

const API_URL = "/api";

function StudentResults() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentEmail =
    localStorage.getItem("user-email") || "";

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/results/student/${encodeURIComponent(
          studentEmail
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load results"
        );
      }

      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to load results"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (result) => {
    if (!result.totalQuestions) return 0;

    return Math.round(
      (result.score / result.totalQuestions) * 100
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="student-results-page">

      {/* HEADER */}

      <header className="results-header">

        <div>
          <button
            className="back-btn"
            onClick={() =>
              navigate("/student-dashboard")
            }
          >
            ← Dashboard
          </button>

          <h1>My Results</h1>

          <p>
            View your examination performance
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchResults}
        >
          ↻ Refresh
        </button>

      </header>

      {/* CONTENT */}

      <main className="results-container">

        {loading && (
          <div className="results-message">
            Loading results...
          </div>
        )}

        {error && (
          <div className="results-error">
            ⚠️ {error}
          </div>
        )}

        {!loading &&
          !error &&
          results.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">
                📊
              </div>

              <h2>No Results Yet</h2>

              <p>
                Complete an examination to see
                your result here.
              </p>

              <button
                onClick={() =>
                  navigate("/student-exams")
                }
              >
                Go to Exams
              </button>
            </div>
          )}

        {/* RESULTS */}

        {!loading &&
          results.length > 0 && (
            <div className="results-list">

              {results.map((result) => {
                const percentage =
                  getPercentage(result);

                return (
                  <div
                    className="result-card"
                    key={result._id}
                  >

                    {/* TOP */}

                    <div className="result-top">

                      <div>
                        <span
                          className={`result-type ${
                            result.examType ===
                            "MCQ"
                              ? "mcq"
                              : "coding"
                          }`}
                        >
                          {result.examType}
                        </span>

                        <h2>
                          {result.examTitle}
                        </h2>

                        <p>
                          Submitted:{" "}
                          {formatDate(
                            result.submittedAt
                          )}
                        </p>
                      </div>

                      <div className="score-box">
                        <strong>
                          {result.score}
                        </strong>

                        <span>
                          /{" "}
                          {
                            result.totalQuestions
                          }
                        </span>

                        <small>
                          {percentage}%
                        </small>
                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="result-details">

                      <div>
                        <span>
                          Total Questions
                        </span>

                        <strong>
                          {
                            result.totalQuestions
                          }
                        </strong>
                      </div>

                      <div>
                        <span>
                          Attempted
                        </span>

                        <strong>
                          {
                            result.attemptedQuestions
                          }
                        </strong>
                      </div>

                      <div>
                        <span>
                          Correct
                        </span>

                        <strong className="correct">
                          {
                            result.correctQuestions
                          }
                        </strong>
                      </div>

                      <div>
                        <span>
                          Percentage
                        </span>

                        <strong>
                          {percentage}%
                        </strong>
                      </div>

                    </div>

                    {/* PROGRESS */}

                    <div className="progress-section">

                      <div className="progress-label">
                        <span>
                          Performance
                        </span>

                        <strong>
                          {percentage}%
                        </strong>
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.min(
                              percentage,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                    </div>

                    {/* STATUS */}

                    <div className="result-bottom">

                      <span
                        className={`result-status ${
                          result.status ===
                          "Completed"
                            ? "completed"
                            : "submitted"
                        }`}
                      >
                        ● {result.status}
                      </span>

                      <span>
                        {result.studentName ||
                          studentEmail}
                      </span>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

      </main>
    </div>
  );
}

export default StudentResults;