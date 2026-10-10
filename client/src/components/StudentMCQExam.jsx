import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./StudentMCQExam.css";

const API_URL = "/api";

function StudentMCQExam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userEmail =
    localStorage.getItem("user-email") || "student@example.com";

  const userName =
    localStorage.getItem("user-name") || "Student";

  /* ================= LOAD EXAM ================= */

  useEffect(() => {
    fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/exams/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load exam");
      }

      const examData = data.exam;

      if (!examData) {
        throw new Error("Exam not found");
      }

      setExam(examData);

      let examQuestions = Array.isArray(examData.mcqQuestions)
        ? examData.mcqQuestions
        : [];

      if (examQuestions.length === 0) {
        const questionResponse = await fetch(
          `${API_URL}/questions/mcq`
        );

        const questionData = await questionResponse.json();

        if (questionResponse.ok) {
          examQuestions = Array.isArray(questionData.questions)
            ? questionData.questions
            : [];
        }
      }

      setQuestions(examQuestions);

      setTimeLeft(Number(examData.duration || 30) * 60);
    } catch (err) {
      console.error("MCQ Exam Error:", err);
      setError(err.message || "Unable to load this exam.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TIMER ================= */

  useEffect(() => {
    if (loading || submitted || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, submitted]);

  /* ================= AUTO SUBMIT ================= */

  useEffect(() => {
    if (
      !loading &&
      !submitted &&
      timeLeft === 0 &&
      questions.length > 0
    ) {
      handleSubmit(true);
    }
  }, [timeLeft, loading, submitted]);

  /* ================= TIME FORMAT ================= */

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  /* ================= SELECT ANSWER ================= */

  const selectAnswer = (answer) => {
    const question = questions[currentIndex];

    if (!question) return;

    setAnswers((previous) => ({
      ...previous,
      [question._id]: answer,
    }));
  };

  /* ================= NAVIGATION ================= */

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (autoSubmit = false) => {
    if (submitted || submitting) return;

    if (!autoSubmit) {
      const confirmSubmit = window.confirm(
        "Are you sure you want to submit the exam?"
      );

      if (!confirmSubmit) return;
    }

    try {
      setSubmitting(true);

      let correctCount = 0;

      const questionResults = questions.map((question) => {
        const selectedAnswer = answers[question._id] || "";

        const isCorrect =
          selectedAnswer === question.correctAnswer;

        if (isCorrect) {
          correctCount++;
        }

        return {
          questionId: question._id,
          questionTitle: question.title,
          submittedCode: selectedAnswer,
          language: "MCQ",
          status: selectedAnswer
            ? "Submitted"
            : "Not Attempted",
          correct: isCorrect,
        };
      });

      const attemptedCount = Object.keys(answers).length;

      const score =
        questions.length > 0
          ? Math.round(
              (correctCount / questions.length) * 100
            )
          : 0;

      const resultData = {
        examId: exam._id,
        examTitle: exam.title,
        examType: "MCQ",
        studentEmail: userEmail,
        studentName: userName,
        totalQuestions: questions.length,
        attemptedQuestions: attemptedCount,
        correctQuestions: correctCount,
        score,
        status: "Submitted",
        submittedAt: new Date().toISOString(),
        questionResults,
      };

      const response = await fetch(`${API_URL}/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit exam"
        );
      }

      setSubmitted(true);

      if (autoSubmit) {
        alert(
          `Time is over!\nYour exam has been submitted.\nScore: ${score}%`
        );
      } else {
        alert(
          `Exam submitted successfully!\nYour Score: ${score}%`
        );
      }

      navigate("/student-results", { replace: true });
    } catch (err) {
      console.error("Submit MCQ Error:", err);
      alert(
        err.message ||
          "Unable to submit exam. Please try again."
      );
      setSubmitting(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="mcq-loading">
        <div className="mcq-spinner"></div>
        <h3>Loading Exam...</h3>
        <p>Please wait.</p>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error || !exam) {
    return (
      <div className="mcq-error">
        <div className="mcq-error-icon">⚠</div>

        <h2>Unable to Load Exam</h2>

        <p>{error || "Exam not found."}</p>

        <button onClick={() => navigate("/student-exams")}>
          ← Back to Exams
        </button>
      </div>
    );
  }

  /* ================= NO QUESTIONS ================= */

  if (questions.length === 0) {
    return (
      <div className="mcq-error">
        <div className="mcq-error-icon">!</div>

        <h2>No Questions Available</h2>

        <p>
          This exam does not have any MCQ questions yet.
        </p>

        <button onClick={() => navigate("/student-exams")}>
          ← Back to Exams
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const selectedAnswer =
    answers[currentQuestion._id] || "";

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="student-mcq-exam">

      {/* HEADER */}

      <header className="mcq-exam-header">

        <div className="mcq-brand">
          <div className="mcq-logo">
            {"</>"}
          </div>

          <div>
            <h2>CodeIT</h2>
            <span>MCQ EXAM</span>
          </div>
        </div>

        <div className="mcq-header-title">
          <h1>{exam.title}</h1>
          <p>
            Question {currentIndex + 1} of{" "}
            {questions.length}
          </p>
        </div>

        <div
          className={`mcq-timer ${
            timeLeft <= 300 ? "timer-warning" : ""
          }`}
        >
          <span>⏱</span>
          <strong>{formatTime()}</strong>
        </div>

      </header>

      {/* PROGRESS */}

      <div className="mcq-progress-wrapper">

        <div className="mcq-progress-info">
          <span>Exam Progress</span>

          <strong>
            {currentIndex + 1} / {questions.length}
          </strong>
        </div>

        <div className="mcq-progress-bar">
          <div
            style={{
              width: `${
                ((currentIndex + 1) /
                  questions.length) *
                100
              }%`,
            }}
          />
        </div>

      </div>

      {/* MAIN */}

      <main className="mcq-exam-layout">

        {/* QUESTION */}

        <section className="mcq-question-card">

          <div className="mcq-question-header">

            <span>
              QUESTION {currentIndex + 1}
            </span>

            <span>
              {currentQuestion.marks || 1} Mark
            </span>

          </div>

          <h2>
            {currentQuestion.title}
          </h2>

          {currentQuestion.description && (
            <p className="mcq-description">
              {currentQuestion.description}
            </p>
          )}

          <div className="mcq-options">

            {(currentQuestion.options || []).map(
              (option, index) => {

                const letter =
                  String.fromCharCode(65 + index);

                const selected =
                  selectedAnswer === option;

                return (
                  <button
                    key={index}
                    className={`mcq-option ${
                      selected ? "selected" : ""
                    }`}
                    onClick={() =>
                      selectAnswer(option)
                    }
                    disabled={submitting}
                  >
                    <span className="mcq-option-letter">
                      {letter}
                    </span>

                    <span className="mcq-option-text">
                      {option}
                    </span>

                    {selected && (
                      <span className="mcq-option-check">
                        ✓
                      </span>
                    )}
                  </button>
                );
              }
            )}

          </div>

          {/* NAVIGATION */}

          <div className="mcq-navigation">

            <button
              className="mcq-prev-btn"
              disabled={
                currentIndex === 0 || submitting
              }
              onClick={handlePrevious}
            >
              ← Previous
            </button>

            {currentIndex ===
            questions.length - 1 ? (
              <button
                className="mcq-submit-btn"
                onClick={() => handleSubmit(false)}
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Exam ✓"}
              </button>
            ) : (
              <button
                className="mcq-next-btn"
                onClick={handleNext}
                disabled={submitting}
              >
                Next →
              </button>
            )}

          </div>

        </section>

        {/* SIDEBAR */}

        <aside className="mcq-palette-card">

          <div className="mcq-palette-header">
            <h3>Questions</h3>

            <span>
              {answeredCount}/{questions.length}
            </span>
          </div>

          <div className="mcq-palette">

            {questions.map((question, index) => {

              const answered =
                !!answers[question._id];

              return (
                <button
                  key={question._id}
                  className={`palette-btn
                    ${
                      index === currentIndex
                        ? "current"
                        : ""
                    }
                    ${
                      answered
                        ? "answered"
                        : ""
                    }
                  `}
                  onClick={() =>
                    setCurrentIndex(index)
                  }
                >
                  {index + 1}
                </button>
              );
            })}

          </div>

          <div className="mcq-legend">

            <div>
              <span className="current"></span>
              Current
            </div>

            <div>
              <span className="answered"></span>
              Answered
            </div>

            <div>
              <span className="not-answered"></span>
              Not Answered
            </div>

          </div>

          <div className="mcq-summary">
            <h3>Exam Summary</h3>

            <p>
              Total Questions:
              <strong>{questions.length}</strong>
            </p>

            <p>
              Answered:
              <strong>{answeredCount}</strong>
            </p>

            <p>
              Remaining:
              <strong>
                {questions.length - answeredCount}
              </strong>
            </p>
          </div>

          <button
            className="mcq-sidebar-submit"
            onClick={() => handleSubmit(false)}
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Exam"}
          </button>

        </aside>

      </main>

    </div>
  );
}

export default StudentMCQExam;