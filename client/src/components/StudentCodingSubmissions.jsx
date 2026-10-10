import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentCodingSubmissions.css";

const API_URL = "/api";

const StudentCodingSubmissions = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const email = localStorage.getItem("user-email");

      if (!email) {
        alert("Student login information not found.");
        navigate("/login");
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/coding-submissions/student/${encodeURIComponent(
          email
        )}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch submissions"
        );
      }

      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error("Submission fetch error:", error);
      alert(error.message || "Unable to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value.includes("accepted") ||
      value.includes("passed")
    ) {
      return "status-passed";
    }

    if (
      value.includes("failed") ||
      value.includes("wrong") ||
      value.includes("error")
    ) {
      return "status-failed";
    }

    return "status-submitted";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("placement-login");
    localStorage.removeItem("user-role");
    localStorage.removeItem("user-email");
    localStorage.removeItem("user-name");
    localStorage.removeItem("user-id");

    navigate("/login");
  };

  const totalSubmissions = submissions.length;

  const acceptedSubmissions = submissions.filter((item) =>
    String(item.status || "")
      .toLowerCase()
      .includes("accepted")
  ).length;

  const failedSubmissions = submissions.filter((item) => {
    const status = String(item.status || "").toLowerCase();

    return (
      status.includes("failed") ||
      status.includes("wrong") ||
      status.includes("error")
    );
  }).length;

  const languagesUsed = new Set(
    submissions.map((item) => item.language)
  ).size;

  if (loading) {
    return (
      <div className="student-submissions-page">
        <div className="submissions-loading">
          Loading submissions...
        </div>
      </div>
    );
  }

  return (
    <div className="student-submissions-page">

      {/* TOP BAR */}

      <div className="submissions-topbar">

        <button
          className="back-dashboard-btn"
          onClick={() =>
            navigate("/student-dashboard")
          }
        >
          ← Back to Dashboard
        </button>

        <button
          className="submission-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* HEADER */}

      <div className="submissions-header">

        <h1>My Coding Submissions</h1>

        <p>
          View your coding attempts and submission history
        </p>

      </div>

      {/* STATS */}

      <div className="submission-stats">

        <div className="submission-stat-card">
          <div className="stat-icon">📝</div>

          <div>
            <span>Total Submissions</span>
            <strong>{totalSubmissions}</strong>
          </div>
        </div>

        <div className="submission-stat-card">
          <div className="stat-icon">✓</div>

          <div>
            <span>Accepted</span>
            <strong>{acceptedSubmissions}</strong>
          </div>
        </div>

        <div className="submission-stat-card">
          <div className="stat-icon">✕</div>

          <div>
            <span>Failed</span>
            <strong>{failedSubmissions}</strong>
          </div>
        </div>

        <div className="submission-stat-card">
          <div className="stat-icon">💻</div>

          <div>
            <span>Languages</span>
            <strong>{languagesUsed}</strong>
          </div>
        </div>

      </div>

      {/* SUBMISSIONS */}

      <div className="submissions-card">

        <div className="submissions-card-header">

          <div>
            <h2>Submission History</h2>

            <p>
              All your coding submissions are stored here.
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchSubmissions}
          >
            ↻ Refresh
          </button>

        </div>

        {submissions.length === 0 ? (
          <div className="no-submissions">

            <div className="empty-icon">
              💻
            </div>

            <h3>No submissions yet</h3>

            <p>
              Solve a coding problem and submit your
              solution to see it here.
            </p>

            <button
              onClick={() =>
                navigate("/coding-practice")
              }
            >
              Go to Coding Practice
            </button>

          </div>
        ) : (
          <div className="table-wrapper">

            <table className="submissions-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {submissions.map(
                  (submission, index) => (
                    <tr key={submission._id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        <div className="question-name">
                          {submission.questionTitle ||
                            submission.questionId?.title ||
                            "Coding Question"}
                        </div>
                      </td>

                      <td>
                        <span className="language-badge">
                          {submission.language}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`submission-status ${getStatusClass(
                            submission.status
                          )}`}
                        >
                          {submission.status ||
                            "Submitted"}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          submission.submittedAt ||
                            submission.createdAt
                        )}
                      </td>

                      <td>
                        <button
                          className="view-btn"
                          onClick={() =>
                            setSelectedSubmission(
                              submission
                            )
                          }
                        >
                          View
                        </button>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* DETAILS MODAL */}

      {selectedSubmission && (
        <div
          className="submission-modal-overlay"
          onClick={() =>
            setSelectedSubmission(null)
          }
        >

          <div
            className="submission-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>
                  Submission Details
                </h2>

                <p>
                  {selectedSubmission.questionTitle}
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={() =>
                  setSelectedSubmission(null)
                }
              >
                ×
              </button>

            </div>

            <div className="modal-info-grid">

              <div>
                <span>Language</span>
                <strong>
                  {selectedSubmission.language}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong
                  className={getStatusClass(
                    selectedSubmission.status
                  )}
                >
                  {selectedSubmission.status}
                </strong>
              </div>

              <div>
                <span>Submitted</span>
                <strong>
                  {formatDate(
                    selectedSubmission.submittedAt ||
                      selectedSubmission.createdAt
                  )}
                </strong>
              </div>

            </div>

            <div className="code-section">

              <h3>Your Code</h3>

              <pre>
                {selectedSubmission.code ||
                  "No code available"}
              </pre>

            </div>

            <div className="output-section">

              <h3>Result</h3>

              <pre>
                {selectedSubmission.output ||
                  "No output available"}
              </pre>

            </div>

            <button
              className="close-modal-btn"
              onClick={() =>
                setSelectedSubmission(null)
              }
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default StudentCodingSubmissions;