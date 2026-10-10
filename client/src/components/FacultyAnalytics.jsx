import React, { useEffect, useState } from "react";
import "./FacultyAnalytics.css";

function FacultyAnalytics({ darkMode, toggleTheme }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "/api";

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("auth-token");

      const response = await fetch(
        `${API_URL}/analytics`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load analytics"
        );
      }

      setAnalytics(data);
    } catch (error) {
      console.error("Analytics error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`faculty-analytics ${
          darkMode ? "dark-mode" : ""
        }`}
      >
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <h3>Loading Analytics...</h3>
          <p>Please wait while we load the data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`faculty-analytics ${
          darkMode ? "dark-mode" : ""
        }`}
      >
        <div className="analytics-error">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Analytics</h2>
          <p>{error}</p>

          <button
            onClick={fetchAnalytics}
            className="retry-btn"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  const summary = analytics?.summary || {};

  return (
    <div
      className={`faculty-analytics ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      {/* ================= HEADER ================= */}

      <div className="analytics-header">
        <div>
          <h1>Faculty Analytics</h1>
          <p>
            Monitor student performance and exam
            statistics.
          </p>
        </div>

        <div className="analytics-header-actions">
          <button
            className="refresh-btn"
            onClick={fetchAnalytics}
          >
            🔄 Refresh
          </button>

          <button
            className="theme-btn"
            onClick={toggleTheme}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* ================= SUMMARY CARDS ================= */}

      <div className="analytics-cards">

        <div className="analytics-card">
          <div className="card-icon blue">
            👨‍🎓
          </div>

          <div>
            <h4>Total Students</h4>
            <h2>
              {summary.totalStudents || 0}
            </h2>
            <p>Registered students</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon purple">
            📝
          </div>

          <div>
            <h4>Total Exams</h4>
            <h2>
              {summary.totalExams || 0}
            </h2>
            <p>
              {summary.completedExams || 0} completed
            </p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon green">
            📊
          </div>

          <div>
            <h4>Average Score</h4>
            <h2>
              {summary.averageScore || 0}
            </h2>
            <p>Overall average</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon orange">
            🎯
          </div>

          <div>
            <h4>Pass Percentage</h4>
            <h2>
              {summary.passPercentage || 0}%
            </h2>
            <p>
              {summary.passedStudents || 0} students passed
            </p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon red">
            ❌
          </div>

          <div>
            <h4>Failed Students</h4>
            <h2>
              {summary.failedStudents || 0}
            </h2>
            <p>Need improvement</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon cyan">
            💻
          </div>

          <div>
            <h4>Coding Submissions</h4>
            <h2>
              {summary.totalCodingSubmissions || 0}
            </h2>
            <p>Total submissions</p>
          </div>
        </div>

      </div>

      {/* ================= EXAM PERFORMANCE ================= */}

      <div className="analytics-section">

        <div className="section-header">
          <div>
            <h2>Exam Performance</h2>
            <p>
              Performance statistics for recent exams.
            </p>
          </div>
        </div>

        {analytics.examPerformance?.length > 0 ? (
          <div className="table-container">

            <table>
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Type</th>
                  <th>Students</th>
                  <th>Average</th>
                  <th>Highest</th>
                  <th>Lowest</th>
                </tr>
              </thead>

              <tbody>
                {analytics.examPerformance.map(
                  (exam, index) => (
                    <tr key={exam.examId || index}>

                      <td>
                        <strong>
                          {exam.examTitle}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`exam-badge ${
                            exam.examType === "Coding"
                              ? "coding"
                              : "mcq"
                          }`}
                        >
                          {exam.examType}
                        </span>
                      </td>

                      <td>
                        {exam.students}
                      </td>

                      <td>
                        <span className="score">
                          {exam.averageScore}
                        </span>
                      </td>

                      <td>
                        {exam.highestScore}
                      </td>

                      <td>
                        {exam.lowestScore}
                      </td>

                    </tr>
                  )
                )}
              </tbody>
            </table>

          </div>
        ) : (
          <div className="empty-state">
            <span>📊</span>
            <p>No exam performance data available.</p>
          </div>
        )}

      </div>

      {/* ================= STUDENT PERFORMANCE ================= */}

      <div className="analytics-section">

        <div className="section-header">
          <div>
            <h2>Top Student Performance</h2>
            <p>
              Students ranked by average score.
            </p>
          </div>
        </div>

        {analytics.studentPerformance?.length > 0 ? (
          <div className="table-container">

            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Exams</th>
                  <th>Average Score</th>
                  <th>Highest Score</th>
                </tr>
              </thead>

              <tbody>
                {analytics.studentPerformance.map(
                  (student) => (
                    <tr key={student.studentEmail}>

                      <td>
                        <span className="rank">
                          #{student.rank}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {student.studentName}
                        </strong>
                      </td>

                      <td>
                        {student.studentEmail}
                      </td>

                      <td>
                        {student.examsAttempted}
                      </td>

                      <td>
                        <span className="score">
                          {student.averageScore}
                        </span>
                      </td>

                      <td>
                        {student.highestScore}
                      </td>

                    </tr>
                  )
                )}
              </tbody>
            </table>

          </div>
        ) : (
          <div className="empty-state">
            <span>👨‍🎓</span>
            <p>No student performance data available.</p>
          </div>
        )}

      </div>

      {/* ================= EXAM TYPE ================= */}

      <div className="analytics-section">

        <div className="section-header">
          <div>
            <h2>Exam Type Statistics</h2>
            <p>
              MCQ and Coding exam performance.
            </p>
          </div>
        </div>

        <div className="exam-type-grid">

          {analytics.examTypeStats?.map(
            (item) => (
              <div
                className="exam-type-card"
                key={item._id}
              >
                <div className="exam-type-icon">
                  {item._id === "Coding"
                    ? "💻"
                    : "📝"}
                </div>

                <h3>{item._id}</h3>

                <div className="exam-type-number">
                  {item.attempts}
                </div>

                <p>Attempts</p>

                <div className="exam-type-average">
                  Average Score:{" "}
                  <strong>
                    {Number(
                      item.averageScore || 0
                    ).toFixed(2)}
                  </strong>
                </div>
              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}

export default FacultyAnalytics;