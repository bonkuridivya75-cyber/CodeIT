import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./CodeEditor.css";

const defaultQuestions = [
  {
    id: 1,
    title: "Two Sum",
    description:
      "Given an array of integers and a target value, find two numbers whose sum is equal to the target.",
    difficulty: "Easy",
    input: "[2, 7, 11, 15], target = 9",
    output: "[0, 1]",
    starterCode: {
      Java: `public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`,
      Python: `nums = [2, 7, 11, 15]
target = 9

# Write your code here`,
      "C++": `#include <iostream>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`,
      JavaScript: `const nums = [2, 7, 11, 15];
const target = 9;

// Write your code here`
    }
  }
];

function CodeEditor() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const examId = searchParams.get("examId");

  const questionIndex = Number(
    searchParams.get("questionIndex") || "0"
  );

  const [question, setQuestion] = useState(null);
  const [exam, setExam] = useState(null);
  const [language, setLanguage] = useState("Java");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    loadQuestion();
  }, [id, examId]);

  const loadQuestion = () => {
    const savedExams = JSON.parse(
      localStorage.getItem("faculty-exams") || "[]"
    );

    let selectedExam = null;
    let selectedQuestion = null;

    if (examId) {
      selectedExam = savedExams.find(
        (item) => String(item.id) === String(examId)
      );

      if (selectedExam?.codingQuestions) {
        selectedQuestion =
          selectedExam.codingQuestions.find(
            (item) => String(item.id) === String(id)
          );
      }
    }

    if (!selectedQuestion) {
      selectedQuestion = defaultQuestions.find(
        (item) => String(item.id) === String(id)
      );
    }

    if (!selectedQuestion) {
      alert("Question not found.");
      navigate("/student-exams");
      return;
    }

    setExam(selectedExam);
    setQuestion(selectedQuestion);

    const availableLanguages = [
      "Java",
      "Python",
      "C++",
      "JavaScript"
    ];

    let firstLanguage = "Java";

    for (const lang of availableLanguages) {
      if (selectedQuestion.starterCode?.[lang]) {
        firstLanguage = lang;
        break;
      }
    }

    setLanguage(firstLanguage);

    setCode(
      selectedQuestion.starterCode?.[firstLanguage] || ""
    );

    setOutput("");
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    setLanguage(selectedLanguage);

    setCode(
      question?.starterCode?.[selectedLanguage] || ""
    );

    setOutput("");
  };

  const handleRun = () => {
    if (!code.trim()) {
      setOutput("Please write code before running.");
      return;
    }

    setOutput(
      `Program executed successfully.

Input:
${question?.input || "Sample Input"}

Expected Output:
${question?.output || "Sample Output"}

Your code is ready for submission.`
    );
  };

  const handleSubmit = () => {
    if (!exam) {
      alert("Exam information not found.");
      return;
    }

    if (!question) {
      alert("Question information not found.");
      return;
    }

    if (!code.trim()) {
      alert("Please write your code before submitting.");
      return;
    }

    const studentEmail =
      localStorage.getItem("user-email") ||
      "student@example.com";

    const studentName =
      localStorage.getItem("user-name") ||
      studentEmail.split("@")[0];

    const results = JSON.parse(
      localStorage.getItem("faculty-results") || "[]"
    );

    let result = results.find(
      (item) =>
        String(item.examId) === String(exam.id) &&
        item.studentEmail === studentEmail
    );

    if (!result) {
      result = {
        id: Date.now(),
        examId: exam.id,
        examTitle: exam.title,
        examType: "Coding",
        studentEmail: studentEmail,
        studentName: studentName,
        totalQuestions:
          exam.codingQuestions?.length || 0,
        attemptedQuestions: 0,
        correctQuestions: 0,
        score: 0,
        status: "In Progress",
        submittedAt: null,
        questionResults: []
      };

      results.push(result);
    }

    if (!result.questionResults) {
      result.questionResults = [];
    }

    const questionResult = {
      questionId: question.id,
      questionTitle: question.title,
      submittedCode: code,
      language: language,
      status: "Submitted",
      correct: true
    };

    const existingQuestionIndex =
      result.questionResults.findIndex(
        (item) =>
          String(item.questionId) ===
          String(question.id)
      );

    if (existingQuestionIndex !== -1) {
      result.questionResults[
        existingQuestionIndex
      ] = questionResult;
    } else {
      result.questionResults.push(questionResult);
    }

    result.attemptedQuestions =
      result.questionResults.length;

    result.correctQuestions =
      result.questionResults.filter(
        (item) => item.correct === true
      ).length;

    result.score =
      result.totalQuestions > 0
        ? Math.round(
            (result.correctQuestions /
              result.totalQuestions) *
              100
          )
        : 0;

    const nextIndex = questionIndex + 1;

    if (
      exam.codingQuestions &&
      nextIndex < exam.codingQuestions.length
    ) {
      result.status = "In Progress";

      localStorage.setItem(
        "faculty-results",
        JSON.stringify(results)
      );

      localStorage.setItem(
        "current-exam-question-index",
        String(nextIndex)
      );

      const nextQuestion =
        exam.codingQuestions[nextIndex];

      alert("Question submitted successfully.");

      navigate(
        `/code-editor/${nextQuestion.id}?examId=${exam.id}&questionIndex=${nextIndex}`
      );

      return;
    }

    result.status = "Submitted";
    result.submittedAt = new Date().toISOString();

    localStorage.setItem(
      "faculty-results",
      JSON.stringify(results)
    );

    localStorage.removeItem(
      "current-student-exam"
    );

    localStorage.removeItem(
      "current-exam-question-index"
    );

    alert("Exam submitted successfully.");

    navigate("/student-results");
  };

  const handleBack = () => {
    if (examId) {
      navigate(`/student-coding-exam/${examId}`);
    } else {
      navigate("/coding-practice");
    }
  };

  if (!question) {
    return (
      <div className="editor-loading">
        Loading question...
      </div>
    );
  }

  return (
    <div className="code-editor-page">

      <header className="editor-header">

        <div className="editor-brand">

          <button
            className="back-button"
            onClick={handleBack}
          >
            ← Back
          </button>

          <div>
            <h1>{question.title}</h1>

            {exam && (
              <p>{exam.title}</p>
            )}
          </div>

        </div>

        <div className="editor-header-actions">

          {exam && (
            <span className="question-counter">
              Question {questionIndex + 1} /{" "}
              {exam.codingQuestions?.length || 0}
            </span>
          )}

        </div>

      </header>

      <main className="editor-main">

        <section className="problem-panel">

          <div className="problem-top">

            <span className="problem-category">
              Coding Problem
            </span>

            <span
              className={`difficulty ${
                question.difficulty?.toLowerCase() ||
                "easy"
              }`}
            >
              {question.difficulty || "Easy"}
            </span>

          </div>

          <h2>{question.title}</h2>

          <div className="problem-section">

            <h3>Problem Description</h3>

            <p>
              {question.description ||
                "Solve the given programming problem."}
            </p>

          </div>

          <div className="problem-section">

            <h3>Input</h3>

            <pre>
              {question.input ||
                "Sample input"}
            </pre>

          </div>

          <div className="problem-section">

            <h3>Output</h3>

            <pre>
              {question.output ||
                "Expected output"}
            </pre>

          </div>

        </section>

        <section className="coding-panel">

          <div className="editor-toolbar">

            <label htmlFor="language">
              Language
            </label>

            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="Java">
                Java
              </option>

              <option value="Python">
                Python
              </option>

              <option value="C++">
                C++
              </option>

              <option value="JavaScript">
                JavaScript
              </option>
            </select>

          </div>

          <div className="editor-wrapper">

            <div className="editor-line-numbers">

              {code.split("\n").map(
                (_, index) => (
                  <span key={index}>
                    {index + 1}
                  </span>
                )
              )}

            </div>

            <textarea
              className="code-input"
              value={code}
              onChange={(event) =>
                setCode(event.target.value)
              }
              spellCheck="false"
            />

          </div>

          <div className="editor-actions">

            <button
              className="run-button"
              onClick={handleRun}
            >
              ▶ Run Code
            </button>

            <button
              className="submit-code-button"
              onClick={handleSubmit}
            >
              ✓ Submit Code
            </button>

          </div>

          <div className="output-panel">

            <div className="output-header">
              <strong>Output</strong>
            </div>

            <pre>
              {output ||
                "Run your code to see output."}
            </pre>

          </div>

        </section>

      </main>

    </div>
  );
}

export default CodeEditor;