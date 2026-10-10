import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./StudentCodingQuestion.css";

const API_URL = "/api";

const StudentCodingQuestion = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);

  const [loading, setLoading] = useState(true);

  const [language, setLanguage] =
    useState("JavaScript");

  const [code, setCode] = useState("");

  const [customInput, setCustomInput] =
    useState("");

  const [output, setOutput] = useState("");

  const [status, setStatus] = useState("");

  const [running, setRunning] = useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [submissionResult, setSubmissionResult] =
    useState(null);

  /* =========================================
     LOAD QUESTION
  ========================================= */

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/questions/${id}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          "Failed to load question"
        );
      }

      setQuestion(data.question);

      const firstLanguage =
        data.question.starterCode?.JavaScript ||
        "";

      setCode(firstLanguage);

    } catch (error) {

      console.error(
        "Question loading error:",
        error
      );

      alert(
        error.message ||
        "Unable to load question"
      );

      navigate("/coding-practice");

    } finally {

      setLoading(false);

    }
  };

  /* =========================================
     CHANGE LANGUAGE
  ========================================= */

  const handleLanguageChange = (e) => {

    const selectedLanguage =
      e.target.value;

    setLanguage(selectedLanguage);

    const starter =
      question?.starterCode?.[
        selectedLanguage
      ] || "";

    setCode(starter);

    setOutput("");

    setStatus("");

    setSubmissionResult(null);
  };

  /* =========================================
     RUN CODE
  ========================================= */

  const handleRun = async () => {

    try {

      if (!code.trim()) {
        alert(
          "Please write some code first."
        );
        return;
      }

      setRunning(true);

      setOutput("");

      setStatus("Running...");

      setSubmissionResult(null);

      const response = await fetch(
        `${API_URL}/code/run`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            language,
            code,
            input: customInput,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          "Code execution failed"
        );
      }

      setOutput(
        data.output ||
        "Program executed successfully."
      );

      setStatus(
        data.status || "Accepted"
      );

    } catch (error) {

      console.error(
        "Run code error:",
        error
      );

      setOutput(
        error.message ||
        "Execution failed"
      );

      setStatus("Error");

    } finally {

      setRunning(false);

    }
  };

  /* =========================================
     SUBMIT CODE
  ========================================= */

  const handleSubmit = async () => {

    try {

      if (!code.trim()) {
        alert(
          "Please write some code first."
        );
        return;
      }

      setSubmitting(true);

      setSubmissionResult(null);

      setOutput("");

      setStatus(
        "Checking test cases..."
      );

      const response = await fetch(
        `${API_URL}/code/submit`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            questionId: id,
            language,
            code,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          "Submission failed"
        );
      }

      setSubmissionResult(data);

      setStatus(data.status);

      /*
       Save submission in database
      */

      const studentEmail =
        localStorage.getItem(
          "user-email"
        );

      const studentName =
        localStorage.getItem(
          "user-name"
        ) || "";

      if (studentEmail) {

        await fetch(
          `${API_URL}/coding-submissions`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              questionId: id,

              studentEmail,

              studentName,

              language,

              code,

              input: "",

              output:
                data.message || "",

              status:
                data.status ||
                "Submitted",
            }),
          }
        );
      }

    } catch (error) {

      console.error(
        "Submit error:",
        error
      );

      setStatus("Error");

      alert(
        error.message ||
        "Submission failed"
      );

    } finally {

      setSubmitting(false);

    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (
      <div className="coding-question-page">

        <div className="coding-loading">
          Loading question...
        </div>

      </div>
    );
  }

  /* =========================================
     QUESTION NOT FOUND
  ========================================= */

  if (!question) {

    return (
      <div className="coding-question-page">

        <div className="coding-error">
          Question not found.
        </div>

      </div>
    );
  }

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="coding-question-page">

      {/* TOP BAR */}

      <div className="coding-topbar">

        <button
          className="back-btn"
          onClick={() =>
            navigate(
              "/coding-practice"
            )
          }
        >
          ← Back
        </button>

        <div className="question-title">
          {question.title}
        </div>

        <div
          className={`difficulty-badge ${question.difficulty.toLowerCase()}`}
        >
          {question.difficulty}
        </div>

      </div>

      {/* MAIN */}

      <div className="coding-workspace">

        {/* LEFT */}

        <div className="question-panel">

          <h1>
            {question.title}
          </h1>

          <span
            className={`question-difficulty ${question.difficulty.toLowerCase()}`}
          >
            {question.difficulty}
          </span>

          <div className="question-section">

            <h3>
              Problem
            </h3>

            <p>
              {question.description}
            </p>

          </div>

          <div className="question-section">

            <h3>
              Input
            </h3>

            <pre>
              {question.input}
            </pre>

          </div>

          <div className="question-section">

            <h3>
              Output
            </h3>

            <pre>
              {question.output}
            </pre>

          </div>

          <div className="question-section">

            <h3>
              Test Cases
            </h3>

            <div className="test-count">
              {question.testCases?.length || 0}
              {" "}
              test cases
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="editor-panel">

          {/* EDITOR HEADER */}

          <div className="editor-header">

            <select
              value={language}
              onChange={
                handleLanguageChange
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

            <div className="editor-buttons">

              <button
                className="run-btn"
                onClick={handleRun}
                disabled={running}
              >
                {running
                  ? "Running..."
                  : "▶ Run"}
              </button>

              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? "Checking..."
                  : "✓ Submit"}
              </button>

            </div>

          </div>

          {/* CODE */}

          <textarea
            className="code-editor"
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
            spellCheck="false"
          />

          {/* CUSTOM INPUT */}

          <div className="input-panel">

            <h3>
              Custom Input
            </h3>

            <textarea
              value={customInput}
              onChange={(e) =>
                setCustomInput(
                  e.target.value
                )
              }
              placeholder="Enter input for your program..."
            />

          </div>

          {/* OUTPUT */}

          <div className="output-panel">

            <div className="output-title">

              <h3>
                Output
              </h3>

              {status && (
                <span
                  className={`status ${status
                    .toLowerCase()
                    .replace(
                      /\s+/g,
                      "-"
                    )}`}
                >
                  {status}
                </span>
              )}

            </div>

            <pre className="output-box">
              {output ||
                "Run your code to see output."}
            </pre>

          </div>

          {/* TEST RESULTS */}

          {submissionResult && (
            <div className="submission-results">

              <div className="submission-summary">

                <div>
                  <strong>
                    Submission Result
                  </strong>

                  <span
                    className={
                      submissionResult.status ===
                      "Accepted"
                        ? "passed-text"
                        : "failed-text"
                    }
                  >
                    {submissionResult.status}
                  </span>
                </div>

                <div className="score-box">

                  {submissionResult.passedTestCases}
                  /
                  {submissionResult.totalTestCases}

                  {" "}
                  Passed

                </div>

              </div>

              <div className="test-results-list">

                {submissionResult.results?.map(
                  (result) => (

                    <div
                      className={`test-result ${
                        result.passed
                          ? "test-passed"
                          : "test-failed"
                      }`}
                      key={result.testCase}
                    >

                      <div className="test-result-header">

                        <strong>
                          Test Case{" "}
                          {result.testCase}
                        </strong>

                        <span>
                          {result.passed
                            ? "✓ Passed"
                            : "✕ Failed"}
                        </span>

                      </div>

                      <div className="test-result-content">

                        <div>
                          <strong>
                            Input
                          </strong>

                          <pre>
                            {result.input}
                          </pre>
                        </div>

                        <div>
                          <strong>
                            Expected
                          </strong>

                          <pre>
                            {
                              result.expectedOutput
                            }
                          </pre>
                        </div>

                        <div>
                          <strong>
                            Your Output
                          </strong>

                          <pre>
                            {
                              result.actualOutput
                            }
                          </pre>
                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default StudentCodingQuestion;