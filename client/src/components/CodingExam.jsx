import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CodingExam.css";

function CodingExam() {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(29 * 60 + 45);
  const [activeQuestion, setActiveQuestion] = useState(1);
  const [code, setCode] = useState(
`function solve(arr) {
  // Write your solution here

  return 0;
}`
  );

  const [output, setOutput] = useState("");
  const [showIssue, setShowIssue] = useState(false);
  const [issue, setIssue] = useState("");
  const [issueSent, setIssueSent] = useState(false);

  const questions = [
    {
      id: 1,
      title: "Find the Largest Element",
      difficulty: "EASY",
      marks: 10,
    },
    {
      id: 2,
      title: "Reverse a String",
      difficulty: "EASY",
      marks: 10,
    },
    {
      id: 3,
      title: "Two Sum",
      difficulty: "MEDIUM",
      marks: 15,
    },
    {
      id: 4,
      title: "Binary Search",
      difficulty: "MEDIUM",
      marks: 15,
    },
    {
      id: 5,
      title: "Merge Two Arrays",
      difficulty: "HARD",
      marks: 20,
    },
  ];

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const runCode = () => {
    setOutput("✓ Code executed successfully\n✓ 3 / 3 test cases passed");
  };

  const submitIssue = () => {
    if (!issue.trim()) return;

    setIssueSent(true);
    setShowIssue(false);

    setTimeout(() => {
      setIssueSent(false);
    }, 4000);
  };

  const currentQuestion = questions[activeQuestion - 1];

  return (
    <div className="coding-exam">

      {/* BACKGROUND */}

      <div className="exam-grid"></div>

      <div className="exam-glow exam-glow-one"></div>
      <div className="exam-glow exam-glow-two"></div>


      {/* TOP BAR */}

      <header className="exam-topbar">

        <div
          className="exam-logo"
          onClick={() => navigate("/student-dashboard")}
        >
          <span>&lt;</span>
          CODE<span>IT</span>
          <span>/&gt;</span>
        </div>

        <div className="exam-title">
          <small>CODING ASSESSMENT</small>
          <strong>JavaScript Fundamentals</strong>
        </div>

        <div className="exam-top-actions">

          <div className="exam-timer">
            <span>⏱</span>
            {minutes}:{seconds}
          </div>

          <button
            className="exit-exam"
            onClick={() => navigate("/student-dashboard")}
          >
            Exit
          </button>

        </div>

      </header>


      {/* EXAM BODY */}

      <main className="exam-body">


        {/* QUESTION SIDEBAR */}

        <aside className="question-sidebar">

          <div className="question-heading">
            <span>QUESTIONS</span>
            <strong>1 / 5</strong>
          </div>

          <div className="question-progress">
            <div></div>
          </div>


          <div className="question-list">

            {questions.map((question) => (
              <button
                key={question.id}
                className={`question-item ${
                  activeQuestion === question.id
                    ? "selected"
                    : ""
                }`}
                onClick={() => {
                  setActiveQuestion(question.id);
                  setOutput("");
                }}
              >

                <span className="question-number">
                  {String(question.id).padStart(2, "0")}
                </span>

                <div>
                  <strong>
                    {question.title}
                  </strong>

                  <small>
                    {question.difficulty} • {question.marks} marks
                  </small>
                </div>

                {question.id === 1 && (
                  <span className="completed">
                    ✓
                  </span>
                )}

              </button>
            ))}

          </div>


          <div className="exam-sidebar-bottom">

            <div className="exam-info-box">
              <span>EXAM PROGRESS</span>

              <strong>
                20%
              </strong>

              <div>
                <i></i>
              </div>
            </div>

            <div className="warning-box">
              ⚠ Do not refresh the page during the exam.
            </div>

          </div>

        </aside>


        {/* MAIN EXAM AREA */}

        <section className="exam-workspace">


          {/* QUESTION */}

          <div className="problem-section">

            <div className="problem-meta">

              <span className="problem-number">
                QUESTION {String(currentQuestion.id).padStart(2, "0")}
              </span>

              <span className="easy-label">
                {currentQuestion.difficulty}
              </span>

              <span className="marks-label">
                {currentQuestion.marks} MARKS
              </span>

            </div>


            <h1>
              {currentQuestion.title}
            </h1>


            <p>
              Write a JavaScript function to solve the given
              programming problem. Your solution should work
              correctly for all valid input values.
            </p>


            <div className="example-box">

              <div>
                <span>INPUT</span>
                <code>[12, 5, 27, 8, 19]</code>
              </div>

              <div>
                <span>OUTPUT</span>
                <code>27</code>
              </div>

            </div>

          </div>


          {/* CODE EDITOR */}

          <div className="code-editor-container">

            <div className="editor-header">

              <div className="editor-file">
                <span className="file-dot"></span>
                solution.js
              </div>

              <div className="editor-language">
                JavaScript ▾
              </div>

            </div>


            <div className="editor-body">

              <div className="line-numbers">

                {code.split("\n").map((_, index) => (
                  <span key={index}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                ))}

              </div>


              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                className="code-input"
              />

            </div>


            {/* TERMINAL */}

            <div className="terminal">

              <div className="terminal-header">
                <span>●</span>
                TEST RESULTS
              </div>

              <div className="terminal-content">

                {output ? (
                  <>
                    <div className="success-output">
                      {output.split("\n").map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>

                    <div className="execution-time">
                      Execution time: 0.42s
                    </div>
                  </>
                ) : (
                  <span className="terminal-placeholder">
                    Run your code to see test results...
                  </span>
                )}

              </div>

            </div>


            {/* EDITOR ACTIONS */}

            <div className="editor-actions">

              <button
                className="run-button"
                onClick={runCode}
              >
                ▶ Run Code
              </button>

              <button
                className="submit-button"
                onClick={() =>
                  setOutput(
                    "✓ Solution submitted\n✓ All test cases passed"
                  )
                }
              >
                Submit Solution →
              </button>

            </div>

          </div>


          {/* BOTTOM CONTROLS */}

          <div className="exam-bottom">

            <button
              className="previous-button"
              disabled={activeQuestion === 1}
              onClick={() =>
                setActiveQuestion((q) => Math.max(1, q - 1))
              }
            >
              ← Previous
            </button>


            <button
              className="raise-issue-button"
              onClick={() => setShowIssue(true)}
            >
              🚨 Raise Issue
            </button>


            <button
              className="next-button"
              onClick={() =>
                setActiveQuestion((q) =>
                  Math.min(questions.length, q + 1)
                )
              }
            >
              Next Question →
            </button>

          </div>

        </section>

      </main>


      {/* ISSUE SENT MESSAGE */}

      {issueSent && (
        <div className="issue-success">

          <div>✓</div>

          <section>
            <strong>
              Faculty Notified
            </strong>

            <span>
              Your issue has been sent to the faculty.
            </span>
          </section>

        </div>
      )}


      {/* RAISE ISSUE MODAL */}

      {showIssue && (

        <div
          className="issue-overlay"
          onClick={() => setShowIssue(false)}
        >

          <div
            className="issue-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setShowIssue(false)}
            >
              ×
            </button>


            <div className="modal-icon">
              🚨
            </div>


            <span className="modal-label">
              FACULTY SUPPORT
            </span>


            <h2>
              Need Help?
            </h2>


            <p>
              Send a message to your faculty. They will
              receive your request during the exam.
            </p>


            <label>
              SELECT ISSUE
            </label>

            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            >

              <option value="">
                Select an issue
              </option>

              <option value="I don't understand the question">
                I don't understand the question
              </option>

              <option value="There is an error in the question">
                There is an error in the question
              </option>

              <option value="My code editor is not working">
                My code editor is not working
              </option>

              <option value="Technical problem">
                Technical problem
              </option>

              <option value="Other">
                Other
              </option>

            </select>


            <label>
              MESSAGE
            </label>

            <textarea
              placeholder="Describe your issue..."
              onChange={(e) => setIssue(e.target.value)}
            ></textarea>


            <button
              className="send-issue"
              onClick={submitIssue}
            >
              Send to Faculty →
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default CodingExam;