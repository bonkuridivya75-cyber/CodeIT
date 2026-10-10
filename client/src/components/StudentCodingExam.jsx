import React, {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./StudentCodingExam.css";

const API_URL = "/api";

function StudentCodingExam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [language, setLanguage] =
    useState("JavaScript");

  const [codes, setCodes] = useState({});

  const [output, setOutput] =
    useState("");

  const [timeLeft, setTimeLeft] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [running, setRunning] =
    useState(false);

  const [error, setError] =
    useState("");

  const userEmail =
    localStorage.getItem("user-email") ||
    "student@example.com";

  const userName =
    localStorage.getItem("user-name") ||
    "Student";

  /* ================= LOAD EXAM ================= */

  useEffect(() => {
    fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/exams/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load exam"
        );
      }

      const examData = data.exam;

      if (!examData) {
        throw new Error(
          "Exam not found"
        );
      }

      setExam(examData);

      let examQuestions =
        Array.isArray(
          examData.codingQuestions
        )
          ? examData.codingQuestions
          : [];

      if (examQuestions.length === 0) {
        const questionResponse =
          await fetch(
            `${API_URL}/questions/coding`
          );

        const questionData =
          await questionResponse.json();

        if (questionResponse.ok) {
          examQuestions =
            Array.isArray(
              questionData.questions
            )
              ? questionData.questions
              : [];
        }
      }

      setQuestions(examQuestions);

      /* CREATE CODE FOR EACH QUESTION */

      const initialCodes = {};

      examQuestions.forEach(
        (question) => {
          initialCodes[question._id] =
            question.starterCode
              ?.JavaScript || "";
        }
      );

      setCodes(initialCodes);

      setTimeLeft(
        Number(
          examData.duration || 30
        ) * 60
      );
    } catch (err) {
      console.error(
        "Coding Exam Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load coding exam."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= TIMER ================= */

  useEffect(() => {
    if (
      loading ||
      submitting ||
      timeLeft <= 0
    ) {
      return;
    }

    const timer =
      setInterval(() => {
        setTimeLeft(
          (previous) => {
            if (previous <= 1) {
              clearInterval(timer);
              return 0;
            }

            return previous - 1;
          }
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [loading, submitting]);

  /* ================= AUTO SUBMIT ================= */

  useEffect(() => {
    if (
      !loading &&
      !submitting &&
      timeLeft === 0 &&
      questions.length > 0
    ) {
      handleSubmit(true);
    }
  }, [
    timeLeft,
    loading,
    submitting,
    questions.length,
  ]);

  /* ================= CURRENT QUESTION ================= */

  const currentQuestion =
    questions[currentIndex];

  const currentCode =
    currentQuestion
      ? codes[currentQuestion._id] || ""
      : "";

  /* ================= FORMAT TIME ================= */

  const formatTime = (
    seconds
  ) => {
    const minutes =
      Math.floor(seconds / 60);

    const remaining =
      seconds % 60;

    return `${String(
      minutes
    ).padStart(2, "0")}:${String(
      remaining
    ).padStart(2, "0")}`;
  };

  /* ================= CHANGE CODE ================= */

  const changeCode = (value) => {
    if (!currentQuestion) return;

    setCodes(
      (previous) => ({
        ...previous,
        [currentQuestion._id]:
          value,
      })
    );
  };

  /* ================= CHANGE QUESTION ================= */

  const changeQuestion = (
    index
  ) => {
    if (
      index < 0 ||
      index >= questions.length
    ) {
      return;
    }

    setCurrentIndex(index);
    setOutput("");
  };

  /* ================= CHANGE LANGUAGE ================= */

  const changeLanguage = (
    newLanguage
  ) => {
    setLanguage(newLanguage);

    if (!currentQuestion) {
      return;
    }

    const existingCode =
      codes[
        currentQuestion._id
      ];

    if (
      existingCode &&
      existingCode.trim() !== ""
    ) {
      return;
    }

    const starter =
      currentQuestion
        .starterCode?.[
        newLanguage
      ] || "";

    setCodes(
      (previous) => ({
        ...previous,
        [currentQuestion._id]:
          starter,
      })
    );

    setOutput("");
  };

  /* ================= RUN CODE ================= */

  const handleRun = async () => {
    if (!currentQuestion) return;

    if (!currentCode.trim()) {
      setOutput(
        "Please write some code first."
      );
      return;
    }

    try {
      setRunning(true);

      setOutput(
        "Running your code..."
      );

      const response =
        await fetch(
          `${API_URL}/code/run`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              language,
              code: currentCode,
              input:
                currentQuestion.input ||
                "",
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Code execution failed"
        );
      }

      setOutput(
        `${data.status || "Result"}\n\n${
          data.output || "No output"
        }`
      );
    } catch (err) {
      console.error(
        "Run Code Error:",
        err
      );

      setOutput(
        `Error:\n${err.message}`
      );
    } finally {
      setRunning(false);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (
    autoSubmit = false
  ) => {
    if (submitting) return;

    if (!autoSubmit) {
      const confirmSubmit =
        window.confirm(
          "Are you sure you want to submit the coding exam?"
        );

      if (!confirmSubmit) {
        return;
      }
    }

    try {
      setSubmitting(true);

      const questionResults =
        questions.map(
          (question) => {
            const submittedCode =
              codes[
                question._id
              ] || "";

            return {
              questionId:
                question._id,

              questionTitle:
                question.title,

              submittedCode,

              language,

              status:
                submittedCode.trim()
                  ? "Submitted"
                  : "Not Attempted",

              correct: false,
            };
          }
        );

      const attemptedQuestions =
        questions.filter(
          (question) =>
            (
              codes[
                question._id
              ] || ""
            ).trim() !== ""
        ).length;

      const response =
        await fetch(
          `${API_URL}/results`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              examId: exam._id,

              examTitle:
                exam.title,

              examType: "Coding",

              studentEmail:
                userEmail,

              studentName:
                userName,

              totalQuestions:
                questions.length,

              attemptedQuestions,

              correctQuestions: 0,

              score: 0,

              status: "Submitted",

              submittedAt:
                new Date().toISOString(),

              questionResults,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit exam"
        );
      }

      if (autoSubmit) {
        alert(
          "Time is over. Your coding exam has been submitted."
        );
      } else {
        alert(
          "Coding exam submitted successfully!"
        );
      }

      navigate(
        "/student-results",
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(
        "Submit Coding Exam Error:",
        err
      );

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
      <div className="coding-loading">
        <div className="coding-loader"></div>

        <h2>
          Loading Coding Exam...
        </h2>

        <p>
          Please wait.
        </p>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error || !exam) {
    return (
      <div className="coding-error">
        <div className="coding-error-icon">
          ⚠
        </div>

        <h2>
          Unable to Load Exam
        </h2>

        <p>
          {error ||
            "Exam not found."}
        </p>

        <button
          onClick={() =>
            navigate(
              "/student-exams"
            )
          }
        >
          ← Back to Exams
        </button>
      </div>
    );
  }

  /* ================= NO QUESTIONS ================= */

  if (questions.length === 0) {
    return (
      <div className="coding-error">
        <div className="coding-error-icon">
          !
        </div>

        <h2>
          No Coding Questions
        </h2>

        <p>
          This exam does not have
          coding questions yet.
        </p>

        <button
          onClick={() =>
            navigate(
              "/student-exams"
            )
          }
        >
          ← Back to Exams
        </button>
      </div>
    );
  }

  return (
    <div className="student-coding-exam">

      {/* ================= HEADER ================= */}

      <header className="coding-exam-header">

        <div className="coding-brand">

          <div className="coding-brand-logo">
            {"</>"}
          </div>

          <div>
            <h2>CodeIT</h2>
            <span>
              CODING EXAM
            </span>
          </div>

        </div>

        <div className="coding-header-title">

          <h1>
            {exam.title}
          </h1>

          <p>
            Question{" "}
            {currentIndex + 1} of{" "}
            {questions.length}
          </p>

        </div>

        <div className="coding-header-right">

          <div
            className={`coding-timer ${
              timeLeft <= 300
                ? "timer-warning"
                : ""
            }`}
          >
            ⏱ {formatTime(timeLeft)}
          </div>

          <button
            className="coding-top-submit"
            onClick={() =>
              handleSubmit(false)
            }
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Exam"}
          </button>

        </div>

      </header>

      {/* ================= PROGRESS ================= */}

      <div className="coding-progress-section">

        <div className="coding-progress-info">

          <span>
            Exam Progress
          </span>

          <strong>
            {currentIndex + 1} /{" "}
            {questions.length}
          </strong>

        </div>

        <div className="coding-progress-bar">

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

      {/* ================= MAIN ================= */}

      <main className="coding-exam-content">

        {/* LEFT QUESTIONS */}

        <aside className="coding-question-list">

          <div className="coding-list-header">

            <h3>
              Questions
            </h3>

            <span>
              {questions.length}
            </span>

          </div>

          <div className="coding-question-items">

            {questions.map(
              (question, index) => (
                <button
                  key={
                    question._id
                  }
                  className={`coding-question-item ${
                    index ===
                    currentIndex
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    changeQuestion(
                      index
                    )
                  }
                >
                  <span>
                    {index + 1}
                  </span>

                  <div>
                    <strong>
                      {
                        question.title
                      }
                    </strong>

                    <small>
                      {question.difficulty ||
                        "Easy"}
                    </small>
                  </div>
                </button>
              )
            )}

          </div>

        </aside>

        {/* CENTER */}

        <section className="coding-question-area">

          {currentQuestion && (
            <>

              {/* QUESTION CARD */}

              <div className="coding-problem-card">

                <div className="coding-problem-header">

                  <div>

                    <span className="coding-question-label">
                      QUESTION{" "}
                      {currentIndex + 1}
                    </span>

                    <h2>
                      {
                        currentQuestion.title
                      }
                    </h2>

                  </div>

                  <span className="coding-difficulty">
                    {
                      currentQuestion.difficulty ||
                      "Easy"
                    }
                  </span>

                </div>

                <p className="coding-problem-description">
                  {
                    currentQuestion.description ||
                    "Solve the given programming problem using an efficient algorithm."
                  }
                </p>

                {currentQuestion.input && (
                  <div className="coding-info-box">

                    <h4>
                      Input
                    </h4>

                    <p>
                      {
                        currentQuestion.input
                      }
                    </p>

                  </div>
                )}

                {currentQuestion.output && (
                  <div className="coding-info-box">

                    <h4>
                      Output
                    </h4>

                    <p>
                      {
                        currentQuestion.output
                      }
                    </p>

                  </div>
                )}

              </div>

              {/* EDITOR */}

              <div className="coding-editor-card">

                <div className="coding-editor-toolbar">

                  <div className="coding-language">

                    <label>
                      Language
                    </label>

                    <select
                      value={
                        language
                      }
                      onChange={(e) =>
                        changeLanguage(
                          e.target.value
                        )
                      }
                    >
                      <option value="JavaScript">
                        JavaScript
                      </option>

                      <option value="Python">
                        Python
                      </option>

                      <option value="Java">
                        Java
                      </option>

                      <option value="C++">
                        C++
                      </option>
                    </select>

                  </div>

                  <button
                    className="coding-run-btn"
                    onClick={
                      handleRun
                    }
                    disabled={
                      running ||
                      submitting
                    }
                  >
                    {running
                      ? "Running..."
                      : "▶ Run Code"}
                  </button>

                </div>

                <textarea
                  className="coding-textarea"
                  value={
                    currentCode
                  }
                  onChange={(e) =>
                    changeCode(
                      e.target.value
                    )
                  }
                  spellCheck="false"
                  placeholder="Write your code here..."
                  disabled={
                    submitting
                  }
                />

              </div>

              {/* OUTPUT */}

              <div className="coding-output">

                <div className="coding-output-header">

                  <strong>
                    Output
                  </strong>

                  <button
                    onClick={() =>
                      setOutput("")
                    }
                  >
                    Clear
                  </button>

                </div>

                <pre>
                  {output ||
                    "Run your code to see the output."}
                </pre>

              </div>

              {/* NAVIGATION */}

              <div className="coding-navigation">

                <button
                  className="coding-nav-btn"
                  disabled={
                    currentIndex ===
                      0 ||
                    submitting
                  }
                  onClick={() =>
                    changeQuestion(
                      currentIndex - 1
                    )
                  }
                >
                  ← Previous
                </button>

                <span>
                  {currentIndex + 1} /{" "}
                  {questions.length}
                </span>

                <button
                  className="coding-nav-btn coding-nav-next"
                  disabled={
                    currentIndex ===
                      questions.length -
                        1 ||
                    submitting
                  }
                  onClick={() =>
                    changeQuestion(
                      currentIndex + 1
                    )
                  }
                >
                  Next →
                </button>

              </div>

            </>
          )}

        </section>

      </main>

    </div>
  );
}

export default StudentCodingExam;