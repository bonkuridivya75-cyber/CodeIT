import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyQuestions.css";

const LANGUAGES = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C",
  "CSharp",
  "Go",
  "Rust",
  "PHP",
  "Kotlin",
];

const createEmptyTestCase = () => ({
  input: "",
  expectedOutput: "",
  hidden: false,
});

function FacultyQuestions() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);

  const [activeTab, setActiveTab] = useState("all");

  const [questionType, setQuestionType] =
    useState("Coding");

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("Medium");

  const [marks, setMarks] = useState(5);

  const [testCases, setTestCases] = useState([
    createEmptyTestCase(),
  ]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  /* =====================================================
     LOAD QUESTIONS
  ===================================================== */

  const loadQuestions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/questions"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load questions"
        );
      }

      setQuestions(
        Array.isArray(data.questions)
          ? data.questions
          : []
      );
    } catch (error) {
      console.error(
        "Load questions error:",
        error
      );

      alert(
        error.message ||
          "Unable to load questions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  /* =====================================================
     ADD TEST CASE
  ===================================================== */

  const addTestCase = () => {
    setTestCases((previous) => [
      ...previous,
      createEmptyTestCase(),
    ]);
  };

  /* =====================================================
     REMOVE TEST CASE
  ===================================================== */

  const removeTestCase = (index) => {
    if (testCases.length === 1) {
      return;
    }

    setTestCases((previous) =>
      previous.filter(
        (_, testIndex) =>
          testIndex !== index
      )
    );
  };

  /* =====================================================
     CHANGE TEST CASE
  ===================================================== */

  const updateTestCase = (
    index,
    field,
    value
  ) => {
    setTestCases((previous) =>
      previous.map((test, testIndex) =>
        testIndex === index
          ? {
              ...test,
              [field]: value,
            }
          : test
      )
    );
  };

  /* =====================================================
     ADD CODING QUESTION
  ===================================================== */

  const handleAddCoding = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      alert("Please enter problem title.");
      return;
    }

    if (!description.trim()) {
      alert(
        "Please enter problem description."
      );
      return;
    }

    const invalidTestCase = testCases.some(
      (test) =>
        !String(
          test.expectedOutput || ""
        ).trim()
    );

    if (invalidTestCase) {
      alert(
        "Please enter expected output for every test case."
      );
      return;
    }

    try {
      setSaving(true);

      const starterCode = {
        JavaScript:
          `// ${title.trim()}\n\n` +
          `function solution() {\n` +
          `  // Write your solution here\n` +
          `}\n`,

        Python:
          `# ${title.trim()}\n\n` +
          `def solution():\n` +
          `    # Write your solution here\n` +
          `    pass\n`,

        Java:
          `import java.util.*;\n\n` +
          `public class Main {\n` +
          `    public static void main(String[] args) {\n` +
          `        // Write your solution here\n` +
          `    }\n` +
          `}\n`,

        "C++":
          `#include <bits/stdc++.h>\n` +
          `using namespace std;\n\n` +
          `int main() {\n` +
          `    // Write your solution here\n` +
          `    return 0;\n` +
          `}\n`,

        C:
          `#include <stdio.h>\n\n` +
          `int main() {\n` +
          `    // Write your solution here\n` +
          `    return 0;\n` +
          `}\n`,

        CSharp:
          `using System;\n\n` +
          `class Program {\n` +
          `    static void Main() {\n` +
          `        // Write your solution here\n` +
          `    }\n` +
          `}\n`,

        Go:
          `package main\n\n` +
          `import "fmt"\n\n` +
          `func main() {\n` +
          `    fmt.Println("Write your solution here")\n` +
          `}\n`,

        Rust:
          `fn main() {\n` +
          `    // Write your solution here\n` +
          `}\n`,

        PHP:
          `<?php\n\n` +
          `// Write your solution here\n`,

        Kotlin:
          `fun main() {\n` +
          `    // Write your solution here\n` +
          `}\n`,
      };

      const createdBy =
        localStorage.getItem(
          "user-id"
        );

      const response = await fetch(
        "/api/questions",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            type: "Coding",

            title: title.trim(),

            description:
              description.trim(),

            difficulty,

            marks: Number(marks),

            subject:
              "Programming",

            starterCode,

            testCases,

            createdBy:
              createdBy || null,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to save question"
        );
      }

      alert(
        "Coding question saved successfully!"
      );

      setTitle("");
      setDescription("");
      setDifficulty("Medium");
      setMarks(5);

      setTestCases([
        createEmptyTestCase(),
      ]);

      await loadQuestions();
    } catch (error) {
      console.error(
        "Save question error:",
        error
      );

      alert(
        error.message ||
          "Unable to save question."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this question?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `/api/questions/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Delete failed"
        );
      }

      setQuestions((previous) =>
        previous.filter(
          (question) =>
            question._id !== id
        )
      );
    } catch (error) {
      alert(
        error.message ||
          "Unable to delete question."
      );
    }
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredQuestions =
    questions.filter((question) => {
      if (activeTab === "coding") {
        return question.type === "Coding";
      }

      if (activeTab === "mcq") {
        return question.type === "MCQ";
      }

      return true;
    });

  const codingCount =
    questions.filter(
      (question) =>
        question.type === "Coding"
    ).length;

  const mcqCount =
    questions.filter(
      (question) =>
        question.type === "MCQ"
    ).length;

  return (
    <div className="faculty-questions-page">

      {/* HEADER */}

      <header className="fq-header">

        <div>
          <button
            className="fq-back-button"
            onClick={() =>
              navigate(
                "/faculty-dashboard"
              )
            }
          >
            ← Back to Dashboard
          </button>

          <h1>Question Bank</h1>

          <p>
            Create and manage coding
            and MCQ questions.
          </p>
        </div>

        <div className="fq-header-actions">

          <button
            onClick={() =>
              navigate(
                "/faculty-dashboard"
              )
            }
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              localStorage.removeItem(
                "placement-login"
              );
              localStorage.removeItem(
                "user-role"
              );
              localStorage.removeItem(
                "user-email"
              );
              localStorage.removeItem(
                "user-name"
              );

              navigate("/login");
            }}
          >
            Logout
          </button>

        </div>

      </header>

      {/* STATS */}

      <section className="fq-stats">

        <div className="fq-stat-card">
          <span>Total Questions</span>
          <strong>
            {questions.length}
          </strong>
        </div>

        <div className="fq-stat-card">
          <span>Coding Questions</span>
          <strong>
            {codingCount}
          </strong>
        </div>

        <div className="fq-stat-card">
          <span>MCQ Questions</span>
          <strong>
            {mcqCount}
          </strong>
        </div>

      </section>

      {/* CREATE */}

      <section className="fq-create-card">

        <div className="fq-section-heading">

          <div>
            <span>
              FACULTY
            </span>

            <h2>
              Add Coding Question
            </h2>

            <p>
              This question will be
              stored in MongoDB and
              become available for
              exams and Code Battle.
            </p>
          </div>

          <div className="fq-language-count">
            <strong>10</strong>
            <span>Languages</span>
          </div>

        </div>

        <form
          onSubmit={
            handleAddCoding
          }
          className="fq-form"
        >

          <div className="fq-two-column">

            <div className="fq-field">
              <label>
                Problem Title
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Example: Two Sum"
              />
            </div>

            <div className="fq-field">
              <label>
                Difficulty
              </label>

              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(
                    event.target.value
                  )
                }
              >
                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>
              </select>
            </div>

          </div>

          <div className="fq-field">
            <label>
              Problem Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Explain the coding problem clearly..."
              rows={5}
            />
          </div>

          <div className="fq-field small-field">
            <label>
              Marks
            </label>

            <input
              type="number"
              min="1"
              value={marks}
              onChange={(event) =>
                setMarks(
                  event.target.value
                )
              }
            />
          </div>

          {/* TEST CASES */}

          <div className="fq-test-section">

            <div className="fq-test-heading">

              <div>
                <h3>
                  Test Cases
                </h3>

                <p>
                  Add input and expected
                  output for judging.
                </p>
              </div>

              <button
                type="button"
                className="fq-add-test"
                onClick={addTestCase}
              >
                + Add Test Case
              </button>

            </div>

            {testCases.map(
              (testCase, index) => (
                <div
                  className="fq-test-card"
                  key={index}
                >

                  <div className="fq-test-title">
                    <strong>
                      Test Case {index + 1}
                    </strong>

                    {testCases.length >
                      1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeTestCase(
                            index
                          )
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="fq-two-column">

                    <div className="fq-field">
                      <label>
                        Input
                      </label>

                      <textarea
                        value={
                          testCase.input
                        }
                        onChange={(
                          event
                        ) =>
                          updateTestCase(
                            index,
                            "input",
                            event.target
                              .value
                          )
                        }
                        placeholder="Example: 2 7 11 15"
                        rows={3}
                      />
                    </div>

                    <div className="fq-field">
                      <label>
                        Expected Output
                      </label>

                      <textarea
                        value={
                          testCase.expectedOutput
                        }
                        onChange={(
                          event
                        ) =>
                          updateTestCase(
                            index,
                            "expectedOutput",
                            event.target
                              .value
                          )
                        }
                        placeholder="Example: 0 1"
                        rows={3}
                      />
                    </div>

                  </div>

                  <label className="fq-hidden">
                    <input
                      type="checkbox"
                      checked={
                        testCase.hidden
                      }
                      onChange={(event) =>
                        updateTestCase(
                          index,
                          "hidden",
                          event.target
                            .checked
                        )
                      }
                    />

                    Hidden test case
                  </label>

                </div>
              )
            )}

          </div>

          <button
            type="submit"
            className="fq-save-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "✓ Save Coding Question"}
          </button>

        </form>

      </section>

      {/* QUESTION LIST */}

      <section className="fq-list-card">

        <div className="fq-list-header">

          <div>
            <span>
              DATABASE QUESTION BANK
            </span>

            <h2>
              All Questions
            </h2>
          </div>

          <div className="fq-tabs">

            <button
              className={
                activeTab === "all"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("all")
              }
            >
              All
            </button>

            <button
              className={
                activeTab === "coding"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("coding")
              }
            >
              Coding
            </button>

            <button
              className={
                activeTab === "mcq"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("mcq")
              }
            >
              MCQ
            </button>

          </div>

        </div>

        {loading ? (
          <div className="fq-empty">
            Loading questions...
          </div>
        ) : filteredQuestions.length ===
          0 ? (
          <div className="fq-empty">
            No questions found.
          </div>
        ) : (
          <div className="fq-question-grid">

            {filteredQuestions.map(
              (question, index) => (
                <article
                  className="fq-question-card"
                  key={
                    question._id ||
                    index
                  }
                >

                  <div className="fq-card-top">

                    <span className="fq-number">
                      #{index + 1}
                    </span>

                    <span
                      className={`fq-difficulty ${String(
                        question.difficulty ||
                          "Medium"
                      ).toLowerCase()}`}
                    >
                      {question.difficulty ||
                        "Medium"}
                    </span>

                  </div>

                  <span className="fq-type">
                    {question.type ===
                    "Coding"
                      ? "💻 CODING"
                      : "📝 MCQ"}
                  </span>

                  <h3>
                    {question.title}
                  </h3>

                  <p>
                    {question.description ||
                      question.subject ||
                      "No description"}
                  </p>

                  {question.type ===
                    "Coding" && (
                    <div className="fq-card-footer">

                      <span>
                        🧪{" "}
                        {
                          question
                            .testCases
                            ?.length
                        }{" "}
                        Tests
                      </span>

                      <button
                        onClick={() =>
                          handleDelete(
                            question._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>
                  )}

                </article>
              )
            )}

          </div>
        )}

      </section>

    </div>
  );
}

export default FacultyQuestions;