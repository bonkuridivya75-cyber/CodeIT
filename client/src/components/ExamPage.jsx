import React, {
  useEffect,
  useState,
} from "react";

import "./ExamPage.css";

function ExamPage({
  exam,
  onBack,
  onSubmit,
}) {

  // =========================================
  // CODING QUESTIONS
  // =========================================

  const codingQuestions = [
    {
      id: 1,
      title: "Binary Search",
      question:
        "Write a Java program to implement binary search on a sorted array.",
      language: "Java",
    },

    {
      id: 2,
      title: "Linked List",
      question:
        "Write a Java program to insert a node at the beginning of a linked list.",
      language: "Java",
    },

    {
      id: 3,
      title: "Stack",
      question:
        "Implement a stack using an array and perform push and pop operations.",
      language: "Java",
    },

    {
      id: 4,
      title: "Bubble Sort",
      question:
        "Write a Java program to implement bubble sort.",
      language: "Java",
    },

    {
      id: 5,
      title: "Tree Traversal",
      question:
        "Write a Java program to perform inorder traversal of a binary tree.",
      language: "Java",
    },
  ];

  // =========================================
  // QUIZ QUESTIONS
  // =========================================

  const quizQuestions = [
    {
      id: 1,
      title: "Binary Search",
      question:
        "What is the time complexity of binary search?",
      options: [
        "O(n)",
        "O(log n)",
        "O(n²)",
        "O(1)",
      ],
      answer: 1,
    },

    {
      id: 2,
      title: "Stack",
      question:
        "Which principle does a stack follow?",
      options: [
        "FIFO",
        "LIFO",
        "Random",
        "Priority",
      ],
      answer: 1,
    },

    {
      id: 3,
      title: "Queue",
      question:
        "Which principle does a queue follow?",
      options: [
        "LIFO",
        "FIFO",
        "Random",
        "Binary",
      ],
      answer: 1,
    },

    {
      id: 4,
      title: "Sorting",
      question:
        "Which sorting algorithm repeatedly compares adjacent elements?",
      options: [
        "Merge Sort",
        "Quick Sort",
        "Bubble Sort",
        "Binary Search",
      ],
      answer: 2,
    },

    {
      id: 5,
      title: "Tree",
      question:
        "Which traversal visits Left → Root → Right?",
      options: [
        "Preorder",
        "Postorder",
        "Inorder",
        "Level Order",
      ],
      answer: 2,
    },
  ];

  const isQuiz =
    exam?.type === "quiz";

  const questions = isQuiz
    ? quizQuestions
    : codingQuestions;

  // =========================================
  // STATES
  // =========================================

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState(
    Array(questions.length).fill("")
  );

  const [timeLeft, setTimeLeft] =
    useState(
      isQuiz
        ? 30 * 60
        : 60 * 60
    );

  const [submitted, setSubmitted] =
    useState(false);

  const [score, setScore] =
    useState(0);

  const question =
    questions[currentQuestion];

  // =========================================
  // TIMER
  // =========================================

  useEffect(() => {

    if (submitted) return;

    if (timeLeft <= 0) {
      submitExam(true);
      return;
    }

    const timer =
      setInterval(() => {
        setTimeLeft(
          (previous) =>
            previous - 1
        );
      }, 1000);

    return () =>
      clearInterval(timer);

  }, [timeLeft, submitted]);

  // =========================================
  // TIME FORMAT
  // =========================================

  const formatTime = (seconds) => {

    const minutes =
      Math.floor(seconds / 60);

    const remaining =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remaining).padStart(
      2,
      "0"
    )}`;
  };

  // =========================================
  // QUIZ ANSWER
  // =========================================

  const handleQuizAnswer = (
    optionIndex
  ) => {

    const updated = [...answers];

    updated[currentQuestion] =
      optionIndex;

    setAnswers(updated);
  };

  // =========================================
  // CODE ANSWER
  // =========================================

  const handleCodeChange = (event) => {

    const updated = [...answers];

    updated[currentQuestion] =
      event.target.value;

    setAnswers(updated);
  };

  // =========================================
  // NEXT
  // =========================================

  const handleNext = () => {

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  // =========================================
  // PREVIOUS
  // =========================================

  const handlePrevious = () => {

    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  // =========================================
  // SUBMIT
  // =========================================

  const submitExam = (
    automatic = false
  ) => {

    if (submitted) return;

    if (!automatic) {

      const confirmed =
        window.confirm(
          "Are you sure you want to submit the exam?"
        );

      if (!confirmed) return;
    }

    let calculatedScore = 0;

    let attempted = 0;

    if (isQuiz) {

      answers.forEach(
        (answer, index) => {

          if (
            answer !== "" &&
            answer !== null
          ) {
            attempted++;

            if (
              Number(answer) ===
              quizQuestions[index]
                .answer
            ) {
              calculatedScore++;
            }
          }
        }
      );

      calculatedScore =
        Math.round(
          (calculatedScore /
            questions.length) *
            100
        );

    } else {

      attempted =
        answers.filter(
          (answer) =>
            answer.trim().length > 0
        ).length;

      calculatedScore =
        Math.round(
          (attempted /
            questions.length) *
            100
        );
    }

    setScore(calculatedScore);
    setSubmitted(true);
  };

  // =========================================
  // BACK TO RESULTS
  // =========================================

  const handleBackAfterSubmit = () => {

    if (onSubmit) {

      onSubmit({
        score,
        exam,
        attempted: answers.filter(
          (answer) =>
            answer !== "" &&
            answer !== null &&
            (
              typeof answer === "number" ||
              answer.trim().length > 0
            )
        ).length,

        totalQuestions:
          questions.length,
      });

      return;
    }

    if (onBack) {
      onBack();
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="exam-page">

      {/* HEADER */}

      <header className="exam-header">

        <div className="exam-brand">

          <div className="exam-brand-icon">
            {"</>"}
          </div>

          <div>
            <strong>CodeIT</strong>

            <span>
              {isQuiz
                ? "QUIZ CENTER"
                : "EXAM CENTER"}
            </span>
          </div>

        </div>

        <div className="exam-title">

          <span>
            {exam?.code || "EXAM01"}
          </span>

          <h1>
            {exam?.title ||
              "Student Examination"}
          </h1>

        </div>

        <div className="exam-timer">

          <span>TIME LEFT</span>

          <strong
            className={
              timeLeft <= 300
                ? "timer-warning"
                : ""
            }
          >
            ⏱ {formatTime(timeLeft)}
          </strong>

        </div>

      </header>

      {/* MAIN */}

      <main className="exam-main">

        {/* SIDEBAR */}

        <aside className="question-sidebar">

          <div className="question-sidebar-header">

            <span>
              {isQuiz
                ? "QUIZ"
                : "QUESTIONS"}
            </span>

            <strong>
              {currentQuestion + 1}/
              {questions.length}
            </strong>

          </div>

          <div className="question-numbers">

            {questions.map(
              (item, index) => (

                <button
                  key={item.id}
                  className={`question-number ${
                    currentQuestion === index
                      ? "active"
                      : ""
                  } ${
                    answers[index] !== "" &&
                    answers[index] !== null
                      ? "answered"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentQuestion(
                      index
                    )
                  }
                >
                  {item.id}
                </button>

              )
            )}

          </div>

          <div className="exam-sidebar-info">

            <p>
              🟣 Current
            </p>

            <p>
              🟢 Answered
            </p>

            <p>
              ⚪ Not Answered
            </p>

          </div>

          <button
            className="exam-exit-button"
            onClick={onBack}
          >
            ← Exit Exam
          </button>

        </aside>

        {/* WORKSPACE */}

        <section className="exam-workspace">

          {/* QUESTION */}

          <div className="question-panel">

            <div className="question-top">

              <div>

                <span>
                  QUESTION{" "}
                  {currentQuestion + 1}
                </span>

                <h2>
                  {question.title}
                </h2>

              </div>

              <div className="question-language">
                {isQuiz
                  ? "MCQ"
                  : question.language}
              </div>

            </div>

            <p className="question-text">
              {question.question}
            </p>

          </div>

          {/* QUIZ */}

          {isQuiz ? (

            <div className="quiz-options">

              {question.options.map(
                (option, index) => (

                  <button
                    key={option}
                    className={`quiz-option ${
                      answers[
                        currentQuestion
                      ] === index
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleQuizAnswer(
                        index
                      )
                    }
                  >

                    <span className="option-letter">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span>
                      {option}
                    </span>

                    {answers[
                      currentQuestion
                    ] === index && (
                      <span>
                        ✓
                      </span>
                    )}

                  </button>

                )
              )}

            </div>

          ) : (

            /* CODING EDITOR */

            <div className="code-editor-panel">

              <div className="editor-header">

                <div className="editor-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <span>
                  Solution.java
                </span>

                <span className="editor-language">
                  Java
                </span>

              </div>

              <textarea
                className="code-editor"
                value={
                  answers[
                    currentQuestion
                  ]
                }
                onChange={
                  handleCodeChange
                }
                placeholder="// Write your Java code here..."
                spellCheck="false"
              />

              <div className="editor-footer">

                <span>
                  Java • CodeIT Editor
                </span>

                <button
                  className="run-button"
                  onClick={() =>
                    alert(
                      "Code execution is not connected yet."
                    )
                  }
                >
                  ▶ Run Code
                </button>

              </div>

            </div>

          )}

          {/* ACTIONS */}

          <div className="exam-actions">

            <button
              className="exam-secondary-button"
              onClick={
                handlePrevious
              }
              disabled={
                currentQuestion === 0
              }
            >
              ← Previous
            </button>

            {currentQuestion <
            questions.length - 1 ? (

              <button
                className="exam-next-button"
                onClick={
                  handleNext
                }
              >
                Save & Next →
              </button>

            ) : (

              <button
                className="exam-submit-button"
                onClick={() =>
                  submitExam(false)
                }
              >
                Submit Exam ✓
              </button>

            )}

          </div>

        </section>

      </main>

      {/* SUBMISSION */}

      {submitted && (

        <div className="exam-submitted-overlay">

          <div className="exam-submitted-card">

            <div className="submitted-icon">
              ✓
            </div>

            <h2>
              Exam Submitted!
            </h2>

            <p>
              Your exam has been submitted
              successfully.
            </p>

            <div className="exam-score">

              <span>
                Your Score
              </span>

              <strong>
                {score}%
              </strong>

            </div>

            <p>
              Attempted{" "}
              {answers.filter(
                (answer) =>
                  answer !== "" &&
                  answer !== null
              ).length}{" "}
              of {questions.length}
              questions.
            </p>

            <button
              onClick={
                handleBackAfterSubmit
              }
            >
              Back to Results
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default ExamPage;