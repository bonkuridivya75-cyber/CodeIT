import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentExams.css";

const API_URL = "/api";

function StudentExams() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userName =
    localStorage.getItem("user-name") || "Student";

  /* ==========================================
     LOAD EXAMS
  ========================================== */

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/exams`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load exams"
        );
      }

      const examList =
        data.exams ||
        data.data ||
        [];

      setExams(
        Array.isArray(examList)
          ? examList
          : []
      );

    } catch (err) {
      console.error(
        "Exam loading error:",
        err
      );

      setError(
        err.message ||
          "Unable to load examinations"
      );

    } finally {
      setLoading(false);
    }
  };


  /* ==========================================
     START EXAM
  ========================================== */

  const handleStartExam = (exam) => {

    if (!exam || !exam._id) {
      alert("Invalid exam.");
      return;
    }

    /*
      Both MCQ and Coding exams use
      the same OnlineExam component.
    */

    navigate(
      `/online-exam/${exam._id}`
    );
  };


  /* ==========================================
     LOGOUT
  ========================================== */

  const handleLogout = () => {

    localStorage.removeItem(
      "placement-login"
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
      "user-role"
    );

    localStorage.removeItem(
      "auth-token"
    );

    navigate("/login");
  };


  /* ==========================================
     ACTIVE EXAMS
  ========================================== */

  const activeExams =
    exams.filter(
      (exam) =>
        exam.status === "Active" ||
        !exam.status
    );


  const mcqCount =
    activeExams.filter(
      (exam) =>
        exam.type === "MCQ"
    ).length;


  const codingCount =
    activeExams.filter(
      (exam) =>
        exam.type === "Coding"
    ).length;


  /* ==========================================
     UI
  ========================================== */

  return (
    <div className="student-exams-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="student-header">

        <div
          className="student-logo"
          onClick={() =>
            navigate(
              "/student-dashboard"
            )
          }
        >

          <div className="logo-symbol">
            &lt;/&gt;
          </div>

          <div>
            <h1>CodeIT</h1>

            <span>
              Student Examination Portal
            </span>
          </div>

        </div>


        <div className="header-actions">

          <button
            className="header-btn"
            onClick={() =>
              navigate(
                "/student-dashboard"
              )
            }
          >
            ← Dashboard
          </button>


          <button
            className="header-btn"
            onClick={loadExams}
            disabled={loading}
          >
            ↻ Refresh
          </button>


          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="student-exams-main">

        {/* PAGE HEADING */}

        <div className="page-heading">

          <div>

            <span className="page-label">
              STUDENT PANEL
            </span>

            <h2>
              My Exams
            </h2>

            <p>
              View and attend your available
              examinations
            </p>

          </div>


          <div className="student-welcome">
            👋 Welcome,{" "}
            <strong>
              {userName}
            </strong>
          </div>

        </div>


        {/* ==================================
            STATS
        ================================== */}

        <section className="exam-stats">

          <div className="stat-card">

            <div className="stat-icon">
              📚
            </div>

            <div>

              <span>
                Available Exams
              </span>

              <strong>
                {activeExams.length}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📝
            </div>

            <div>

              <span>
                MCQ Exams
              </span>

              <strong>
                {mcqCount}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              💻
            </div>

            <div>

              <span>
                Coding Exams
              </span>

              <strong>
                {codingCount}
              </strong>

            </div>

          </div>

        </section>


        {/* ==================================
            SECTION HEADING
        ================================== */}

        <div className="exam-section-heading">

          <div>

            <h3>
              Available Examinations
            </h3>

            <p>
              Exams created and activated
              by your faculty will appear here.
            </p>

          </div>


          <span className="active-count">
            {activeExams.length} Active
          </span>

        </div>


        {/* ==================================
            LOADING
        ================================== */}

        {loading && (

          <div className="exam-message">

            <div className="loading-spinner"></div>

            <h3>
              Loading Exams...
            </h3>

            <p>
              Please wait while we fetch
              available examinations.
            </p>

          </div>

        )}


        {/* ==================================
            ERROR
        ================================== */}

        {!loading && error && (

          <div className="exam-message error-message">

            <div className="message-icon">
              ⚠️
            </div>

            <h3>
              Unable to Load Exams
            </h3>

            <p>
              {error}
            </p>

            <button
              onClick={loadExams}
              className="retry-btn"
            >
              Try Again
            </button>

          </div>

        )}


        {/* ==================================
            EMPTY
        ================================== */}

        {!loading &&
          !error &&
          activeExams.length === 0 && (

            <div className="exam-message">

              <div className="message-icon">
                📭
              </div>

              <h3>
                No Exams Available
              </h3>

              <p>
                There are currently no active
                examinations.
              </p>

            </div>

          )}


        {/* ==================================
            EXAM CARDS
        ================================== */}

        {!loading &&
          !error &&
          activeExams.length > 0 && (

            <div className="exam-grid">

              {activeExams.map((exam) => {

                const isCoding =
                  exam.type === "Coding";


                return (

                  <div
                    className="exam-card"
                    key={exam._id}
                  >

                    {/* CARD TOP */}

                    <div className="exam-card-top">

                      <span
                        className={
                          isCoding
                            ? "exam-type coding"
                            : "exam-type mcq"
                        }
                      >

                        {isCoding
                          ? "💻 CODING"
                          : "📝 MCQ"}

                      </span>


                      <span className="exam-status">

                        <span className="status-dot"></span>

                        Active

                      </span>

                    </div>


                    {/* TITLE */}

                    <h3 className="exam-title">

                      {exam.title ||
                        "Untitled Exam"}

                    </h3>


                    <p className="exam-description">

                      {exam.description ||
                        "Complete this examination within the given time."}

                    </p>


                    {/* INFO */}

                    <div className="exam-info-grid">

                      {/* DURATION */}

                      <div className="exam-info">

                        <span className="info-icon">
                          ⏱
                        </span>

                        <div>

                          <small>
                            Duration
                          </small>

                          <strong>
                            {exam.duration ||
                              30}{" "}
                            minutes
                          </strong>

                        </div>

                      </div>


                      {/* QUESTIONS */}

                      <div className="exam-info">

                        <span className="info-icon">
                          ❓
                        </span>

                        <div>

                          <small>
                            Questions
                          </small>

                          <strong>
                            {exam.questions ||
                              0}
                          </strong>

                        </div>

                      </div>


                      {/* MARKS */}

                      <div className="exam-info">

                        <span className="info-icon">
                          ⭐
                        </span>

                        <div>

                          <small>
                            Total Marks
                          </small>

                          <strong>
                            {exam.totalMarks ||
                              (exam.questions
                                ? exam.questions *
                                  2
                                : 0)}
                          </strong>

                        </div>

                      </div>

                    </div>


                    {/* DATE */}

                    <div className="exam-date">

                      <span>
                        📅
                      </span>

                      <strong>

                        {new Date(
                          exam.createdAt ||
                            Date.now()
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}

                      </strong>

                    </div>


                    {/* ==================================
                        START EXAM BUTTON
                    ================================== */}

                    <button
                      type="button"
                      className="start-exam-btn"
                      onClick={() =>
                        handleStartExam(
                          exam
                        )
                      }
                    >

                      Start Exam

                      <span>
                        →
                      </span>

                    </button>

                  </div>

                );

              })}

            </div>

          )}

      </main>

    </div>
  );
}

export default StudentExams;