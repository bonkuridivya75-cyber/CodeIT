import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyExams.css";

const API_URL = "/api";

function FacultyExams({
  darkMode,
  toggleTheme,
  onBack,
  onCreateExam,
}) {
  const navigate = useNavigate();

  /* =====================================================
     STATE
  ===================================================== */

  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState("");

  /* =====================================================
     GET FACULTY ID
  ===================================================== */

  const getFacultyId = () => {
    return (
      localStorage.getItem("user-id") ||
      localStorage.getItem("faculty-id") ||
      ""
    );
  };

  /* =====================================================
     LOAD FACULTY EXAMS
  ===================================================== */

  useEffect(() => {
    loadFacultyExams();
  }, []);

  const loadFacultyExams = async () => {
    try {
      setLoading(true);
      setError("");

      const facultyId = getFacultyId();

      if (!facultyId) {
        setError(
          "Faculty ID not found. Please login again."
        );

        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/exams/faculty/${facultyId}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load faculty exams."
        );
      }

      setExams(
        Array.isArray(data.exams)
          ? data.exams
          : []
      );
    } catch (error) {
      console.error(
        "Load faculty exams error:",
        error
      );

      setError(
        error.message ||
          "Unable to load exams."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     DELETE EXAM
  ===================================================== */

  const handleDeleteExam = async (examId) => {
    if (!examId) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exam?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(examId);

      const response = await fetch(
        `${API_URL}/exams/${examId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete exam."
        );
      }

      setExams((previousExams) =>
        previousExams.filter(
          (exam) => exam._id !== examId
        )
      );

      alert("Exam deleted successfully.");
    } catch (error) {
      console.error(
        "Delete exam error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete exam."
      );
    } finally {
      setDeletingId("");
    }
  };

  /* =====================================================
     STATUS
  ===================================================== */

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "active-status";

      case "Completed":
        return "completed-status";

      case "Inactive":
        return "inactive-status";

      case "Draft":
      default:
        return "draft-status";
    }
  };

  /* =====================================================
     TYPE CLASS
  ===================================================== */

  const getTypeClass = (type) => {
    return type === "Coding"
      ? "coding-type"
      : "mcq-type";
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =====================================================
     TOTAL STATISTICS
  ===================================================== */

  const totalExams = exams.length;

  const activeExams = exams.filter(
    (exam) =>
      exam.status === "Active"
  ).length;

  const codingExams = exams.filter(
    (exam) =>
      exam.type === "Coding"
  ).length;

  const mcqExams = exams.filter(
    (exam) =>
      exam.type === "MCQ"
  ).length;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className={`faculty-exams-page ${
        darkMode ? "dark" : "light"
      }`}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="faculty-exams-header">

        <div className="faculty-header-left">

          <button
            type="button"
            className="faculty-back-btn"
            onClick={
              onBack ||
              (() =>
                navigate(
                  "/faculty-dashboard"
                ))
            }
          >
            ← Back to Dashboard
          </button>

          <div>
            <h1>Exam Management</h1>

            <p>
              Create and manage MCQ and
              Coding examinations.
            </p>
          </div>

        </div>

        <div className="faculty-exams-actions">

          <button
            type="button"
            className="faculty-theme-btn"
            onClick={toggleTheme}
          >
            {darkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>

        </div>

      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="faculty-exams-container">

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="exam-summary">

          {/* TOTAL */}

          <div className="exam-summary-card">

            <div className="summary-icon total-icon">
              📝
            </div>

            <div className="summary-content">

              <span>
                Total Exams
              </span>

              <h2>
                {totalExams}
              </h2>

              <p>
                All examinations
              </p>

            </div>

          </div>


          {/* ACTIVE */}

          <div className="exam-summary-card">

            <div className="summary-icon active-icon">
              ✓
            </div>

            <div className="summary-content">

              <span>
                Active Exams
              </span>

              <h2>
                {activeExams}
              </h2>

              <p>
                Currently active
              </p>

            </div>

          </div>


          {/* CODING */}

          <div className="exam-summary-card">

            <div className="summary-icon coding-icon">
              💻
            </div>

            <div className="summary-content">

              <span>
                Coding Exams
              </span>

              <h2>
                {codingExams}
              </h2>

              <p>
                Programming exams
              </p>

            </div>

          </div>


          {/* MCQ */}

          <div className="exam-summary-card">

            <div className="summary-icon mcq-icon">
              📋
            </div>

            <div className="summary-content">

              <span>
                MCQ Exams
              </span>

              <h2>
                {mcqExams}
              </h2>

              <p>
                Multiple choice exams
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <section className="exam-page-top">

          <div>

            <span className="section-label">
              CODEIT / FACULTY / EXAMS
            </span>

            <h2>
              Your Examinations
            </h2>

            <p>
              View and manage all examinations
              created by you.
            </p>

          </div>


          <button
            type="button"
            className="create-exam-btn"
            onClick={
              onCreateExam ||
              (() =>
                navigate(
                  "/faculty-create-exam"
                ))
            }
          >
            ＋ Create New Exam
          </button>

        </section>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="exam-error-box">

            <div>
              <strong>
                Unable to load exams
              </strong>

              <p>
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={
                loadFacultyExams
              }
            >
              Retry
            </button>

          </div>
        )}


        {/* =================================================
            EXAM LIST
        ================================================= */}

        <section className="faculty-exams-list-card">

          <div className="exam-list-heading">

            <div>

              <span className="section-label">
                EXAM LIST
              </span>

              <h2>
                All Examinations
              </h2>

            </div>

            <div className="exam-count">
              {totalExams} Exams
            </div>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="exam-loading">

              <div className="loading-spinner"></div>

              <p>
                Loading examinations...
              </p>

            </div>

          ) : exams.length === 0 ? (

            /* =================================================
               EMPTY
            ================================================= */

            <div className="no-exams-message">

              <div className="empty-exam-icon">
                📝
              </div>

              <h3>
                No Exams Found
              </h3>

              <p>
                You have not created any
                examinations yet.
              </p>

              <button
                type="button"
                className="empty-create-btn"
                onClick={
                  onCreateExam ||
                  (() =>
                    navigate(
                      "/faculty-create-exam"
                    ))
                }
              >
                ＋ Create Your First Exam
              </button>

            </div>

          ) : (

            /* =================================================
               EXAM ITEMS
            ================================================= */

            <div className="faculty-exams-list">

              {exams.map((exam) => (

                <article
                  className="faculty-exam-row"
                  key={exam._id}
                >

                  {/* TYPE ICON */}

                  <div
                    className={`faculty-exam-icon ${getTypeClass(
                      exam.type
                    )}`}
                  >
                    {exam.type === "Coding"
                      ? "💻"
                      : "📝"}
                  </div>


                  {/* INFORMATION */}

                  <div className="faculty-exam-info">

                    <div className="exam-title-line">

                      <h3>
                        {exam.title ||
                          "Untitled Exam"}
                      </h3>

                      <span
                        className={`exam-type-badge ${getTypeClass(
                          exam.type
                        )}`}
                      >
                        {exam.type ||
                          "MCQ"}
                      </span>

                    </div>


                    <p className="exam-subject">

                      {exam.subject ||
                        "General"}

                    </p>


                    <div className="exam-meta">

                      <span>
                        ⏱{" "}
                        {exam.duration ||
                          "-"}{" "}
                        Minutes
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {exam.questions ||
                          0}{" "}
                        Questions
                      </span>

                      {exam.startDate && (
                        <>
                          <span>
                            •
                          </span>

                          <span>
                            📅{" "}
                            {formatDate(
                              exam.startDate
                            )}
                          </span>
                        </>
                      )}

                    </div>

                  </div>


                  {/* STATUS */}

                  <div className="exam-status-column">

                    <span
                      className={`faculty-exam-status ${getStatusClass(
                        exam.status
                      )}`}
                    >
                      {exam.status ||
                        "Draft"}
                    </span>

                    {exam.startTime && (
                      <small>
                        {exam.startTime}
                        {exam.endTime
                          ? ` - ${exam.endTime}`
                          : ""}
                      </small>
                    )}

                  </div>


                  {/* ACTIONS */}

                  <div className="exam-row-actions">

                    <button
                      type="button"
                      className="view-exam-btn"
                      onClick={() =>
                        alert(
                          `Exam: ${
                            exam.title
                          }\nType: ${
                            exam.type
                          }\nSubject: ${
                            exam.subject ||
                            "General"
                          }\nDuration: ${
                            exam.duration
                          } minutes\nQuestions: ${
                            exam.questions
                          }`
                        )
                      }
                    >
                      View
                    </button>


                    <button
                      type="button"
                      className="delete-exam-btn"
                      disabled={
                        deletingId ===
                        exam._id
                      }
                      onClick={() =>
                        handleDeleteExam(
                          exam._id
                        )
                      }
                    >
                      {deletingId ===
                      exam._id
                        ? "Deleting..."
                        : "🗑 Delete"}
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default FacultyExams;