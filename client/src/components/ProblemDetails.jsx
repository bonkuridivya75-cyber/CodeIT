import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProblemDetails.css";

function ProblemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState(
`function solve() {
  // Write your solution here

}

console.log(solve());`
  );

  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [testCases, setTestCases] = useState([
    { input: "2, 7, 11, 15", output: "9", status: "pending" },
    { input: "3, 2, 4", output: "6", status: "pending" },
    { input: "3, 3", output: "6", status: "pending" },
  ]);

  const problems = {
    1: {
      title: "Two Sum",
      difficulty: "Easy",
      points: 20,
      description:
        "Given an array of integers and a target value, return the indices of two numbers that add up to the target.",
    },
    2: {
      title: "Reverse a String",
      difficulty: "Easy",
      points: 15,
      description:
        "Write a program to reverse the given string and return the reversed result.",
    },
    3: {
      title: "Binary Search",
      difficulty: "Medium",
      points: 30,
      description:
        "Given a sorted array and a target value, find the position of the target using binary search.",
    },
    4: {
      title: "Merge Two Sorted Lists",
      difficulty: "Medium",
      points: 35,
      description:
        "Merge two sorted linked lists into one sorted linked list.",
    },
    5: {
      title: "Longest Substring",
      difficulty: "Hard",
      points: 50,
      description:
        "Find the length of the longest substring without repeating characters.",
    },
    6: {
      title: "Maximum Subarray",
      difficulty: "Medium",
      points: 30,
      description:
        "Find the contiguous subarray with the largest possible sum.",
    },
  };

  const problem = problems[id] || problems[1];

  const runCode = () => {
    setRunning(true);
    setResult(null);

    setTimeout(() => {
      setTestCases((prev) =>
        prev.map((test) => ({
          ...test,
          status: "passed",
        }))
      );

      setResult({
        type: "success",
        message: "All test cases passed!",
      });

      setRunning(false);
    }, 1200);
  };

  const submitCode = () => {
    setRunning(true);
    setResult(null);

    setTimeout(() => {
      setTestCases((prev) =>
        prev.map((test) => ({
          ...test,
          status: "passed",
        }))
      );

      setResult({
        type: "submitted",
        message: "Solution submitted successfully!",
      });

      setRunning(false);
    }, 1500);
  };

  return (
    <div className="problem-details">

      {/* BACKGROUND */}
      <div className="problem-grid"></div>
      <div className="problem-glow problem-glow-one"></div>
      <div className="problem-glow problem-glow-two"></div>

      {/* NAVBAR */}
      <header className="problem-navbar">

        <div
          className="problem-logo"
          onClick={() => navigate("/student-dashboard")}
        >
          <span>&lt;</span>
          CODE<span className="logo-it">IT</span>
          <span>/&gt;</span>
        </div>

        <div className="problem-nav-title">
          Coding Practice
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/coding-practice")}
        >
          ← Back to Problems
        </button>

      </header>

      {/* MAIN */}
      <main className="problem-main">

        {/* PROBLEM HEADER */}
        <section className="problem-header">

          <div>

            <div className="problem-label">
              PROBLEM #{String(id || 1).padStart(2, "0")}
            </div>

            <div className="problem-title-line">

              <h1>{problem.title}</h1>

              <span
                className={`problem-difficulty ${problem.difficulty.toLowerCase()}`}
              >
                {problem.difficulty}
              </span>

            </div>

            <p>{problem.description}</p>

          </div>

          <div className="problem-points">
            <strong>{problem.points}</strong>
            <span>POINTS</span>
          </div>

        </section>

        {/* WORKSPACE */}
        <section className="coding-workspace">

          {/* LEFT */}
          <div className="question-side">

            <div className="workspace-heading">
              <span>PROBLEM</span>
              <span>DESCRIPTION</span>
            </div>

            <div className="description-card">

              <h2>Problem Description</h2>

              <p>{problem.description}</p>

              <h3>Example</h3>

              <div className="example-code">
                <div>
                  <span>Input:</span> [2, 7, 11, 15], target = 9
                </div>

                <div>
                  <span>Output:</span> [0, 1]
                </div>

                <div>
                  <span>Explanation:</span> 2 + 7 = 9
                </div>
              </div>

              <h3>Constraints</h3>

              <ul>
                <li>Use an efficient approach.</li>
                <li>Return the required output.</li>
                <li>Your solution should pass all test cases.</li>
              </ul>

            </div>

          </div>

          {/* RIGHT */}
          <div className="editor-side">

            <div className="editor-topbar">

              <div className="window-buttons">
                <i></i>
                <i></i>
                <i></i>
              </div>

              <span className="file-name">
                solution.js
              </span>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>JavaScript</option>
                <option>Python</option>
                <option>Java</option>
                <option>C</option>
                <option>C++</option>
              </select>

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
                className="code-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
              />

            </div>

            <div className="editor-actions">

              <button
                className="run-code-btn"
                onClick={runCode}
                disabled={running}
              >
                {running ? "Running..." : "▶ Run Code"}
              </button>

              <button
                className="submit-code-btn"
                onClick={submitCode}
                disabled={running}
              >
                {running ? "Processing..." : "✓ Submit"}
              </button>

            </div>

          </div>

        </section>

        {/* RESULT */}
        {result && (
          <section className={`execution-result ${result.type}`}>

            <div className="result-symbol">
              {result.type === "success" ? "✓" : "✓"}
            </div>

            <div>
              <strong>{result.message}</strong>
              <span>
                Execution completed successfully.
              </span>
            </div>

          </section>
        )}

        {/* TEST CASES */}
        <section className="test-section">

          <div className="test-heading">

            <div>
              <span>EXECUTION</span>
              <h2>Test Cases</h2>
            </div>

            <div className="test-summary">
              {testCases.filter(
                (test) => test.status === "passed"
              ).length}
              /{testCases.length} Passed
            </div>

          </div>

          <div className="test-list">

            {testCases.map((test, index) => (

              <div className="test-card" key={index}>

                <div className="test-number">
                  TEST {index + 1}
                </div>

                <div className="test-data">
                  <span>Input</span>
                  <code>{test.input}</code>
                </div>

                <div className="test-data">
                  <span>Expected</span>
                  <code>{test.output}</code>
                </div>

                <div
                  className={`test-status ${test.status}`}
                >
                  {test.status === "passed"
                    ? "✓ Passed"
                    : "○ Pending"}
                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="problem-footer">

        <div>
          <span>&lt;</span>
          CODEIT
          <span>/&gt;</span>
        </div>

        <p>
          Code. Practice. Learn. Grow.
        </p>

        <button
          onClick={() => navigate("/coding-practice")}
        >
          All Problems →
        </button>

      </footer>

    </div>
  );
}

export default ProblemDetails;