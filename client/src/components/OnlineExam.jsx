import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./OnlineExam.css";

const API_URL = "/api";

/* =========================================================
   10 PROGRAMMING LANGUAGES
========================================================= */

const LANGUAGES = [
  {
    name: "JavaScript",
    value: "JavaScript",
    starter: `// Write your JavaScript solution here

const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim();

// Your solution
`,
  },
  {
    name: "Python",
    value: "Python",
    starter: `# Write your Python solution here

import sys

input_data = sys.stdin.read().strip()

# Your solution
`,
  },
  {
    name: "Java",
    value: "Java",
    starter: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Your solution here
    }
}`,
  },
  {
    name: "C",
    value: "C",
    starter: `#include <stdio.h>

int main() {

    // Your solution here

    return 0;
}`,
  },
  {
    name: "C++",
    value: "C++",
    starter: `#include <bits/stdc++.h>
using namespace std;

int main() {

    // Your solution here

    return 0;
}`,
  },
  {
    name: "C#",
    value: "C#",
    starter: `using System;

class Program
{
    static void Main()
    {
        // Your solution here
    }
}`,
  },
  {
    name: "Go",
    value: "Go",
    starter: `package main

import "fmt"

func main() {

    // Your solution here

    fmt.Println()
}`,
  },
  {
    name: "Rust",
    value: "Rust",
    starter: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();

    // Your solution here
}`,
  },
  {
    name: "Kotlin",
    value: "Kotlin",
    starter: `fun main() {

    // Your solution here

}`,
  },
  {
    name: "PHP",
    value: "PHP",
    starter: `<?php

// Your PHP solution here

?>`,
  },
];

/* =========================================================
   STARTER CODE HELPER
========================================================= */

const getStarterCode = (question, language) => {
  if (!question) {
    return "";
  }

  const starterCode = question.starterCode;

  if (
    starterCode &&
    typeof starterCode === "object" &&
    starterCode[language]
  ) {
    return starterCode[language];
  }

  if (typeof starterCode === "string" && language === "JavaScript") {
    return starterCode;
  }

  const selectedLanguage = LANGUAGES.find(
    (item) => item.value === language
  );

  return selectedLanguage?.starter || "";
};

/* =========================================================
   QUESTION TEXT HELPER
========================================================= */

const getQuestionText = (question) => {
  if (!question) {
    return "Question not available";
  }

  return (
    question.title ||
    question.question ||
    question.questionText ||
    question.text ||
    question.name ||
    "Question text not available"
  );
};

/* =========================================================
   TEST CASE HELPER
========================================================= */

const getTestCases = (question) => {
  if (!question) {
    return [];
  }

  if (Array.isArray(question.testCases)) {
    return question.testCases;
  }

  if (Array.isArray(question.testcases)) {
    return question.testcases;
  }

  if (Array.isArray(question.test_cases)) {
    return question.test_cases;
  }

  if (
    question.input !== undefined ||
    question.expectedOutput !== undefined
  ) {
    return [
      {
        input: question.input || "",
        expectedOutput:
          question.expectedOutput ||
          question.output ||
          "",
      },
    ];
  }

  return [];
};

/* =========================================================
   COMPONENT
========================================================= */

function OnlineExam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const timerRef = useRef(null);
  const autoSubmittedRef = useRef(false);

  // =======================================================
  // LIVE EXAM MONITORING
  // =======================================================
  const socketRef = useRef(null);
  const examStartedRef = useRef(false);
  const tabSwitchCountRef = useRef(0);

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [answers, setAnswers] = useState({});
  const [codingAnswers, setCodingAnswers] = useState({});
  const [codingLanguages, setCodingLanguages] = useState({});

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [timeLeft, setTimeLeft] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [runningCode, setRunningCode] = useState(false);

  const [output, setOutput] = useState("");

  const [selectedTestCase, setSelectedTestCase] = useState(0);

  /* =======================================================
     LOAD EXAM
  ======================================================= */

  useEffect(() => {
    const loadExam = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/exams/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          alert(data.message || "Failed to load exam");
          navigate("/student-exams");
          return;
        }

        const loadedExam = data.exam;

        setExam(loadedExam);

        /* -----------------------------------------------
           MCQ QUESTIONS
        ------------------------------------------------ */

        if (loadedExam.type === "MCQ") {
          const mcqQuestions = Array.isArray(
            loadedExam.mcqQuestions
          )
            ? loadedExam.mcqQuestions
            : [];

          setQuestions(mcqQuestions);

          const initialAnswers = {};

          mcqQuestions.forEach((question) => {
            initialAnswers[question._id] = "";
          });

          setAnswers(initialAnswers);
        }

        /* -----------------------------------------------
           CODING QUESTIONS
        ------------------------------------------------ */

        if (loadedExam.type === "Coding") {
          const codingQuestions = Array.isArray(
            loadedExam.codingQuestions
          )
            ? loadedExam.codingQuestions
            : [];

          setQuestions(codingQuestions);

          const initialCodingAnswers = {};
          const initialLanguages = {};

          codingQuestions.forEach((question) => {
            const language =
              question.defaultLanguage ||
              question.language ||
              "JavaScript";

            initialLanguages[question._id] = language;

            initialCodingAnswers[question._id] =
              getStarterCode(question, language);
          });

          setCodingAnswers(initialCodingAnswers);
          setCodingLanguages(initialLanguages);
        }

        setTimeLeft(
          Number(loadedExam.duration || 30) * 60
        );
      } catch (error) {
        console.error("Load exam error:", error);

        alert("Unable to load exam");
        navigate("/student-exams");
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [id, navigate]);

  /* =======================================================
     LIVE EXAM MONITORING
  ======================================================= */

  useEffect(() => {
    if (loading || !exam) {
      return;
    }

    const socket = io(
      import.meta.env.VITE_SOCKET_URL ||
        window.location.origin,
      {
        transports: ["websocket", "polling"],
        withCredentials: true,
      }
    );

    socketRef.current = socket;
    examStartedRef.current = true;

    const studentName =
      localStorage.getItem("user-name") ||
      "Student";

    const registrationNumber =
      localStorage.getItem("user-student-id") ||
      localStorage.getItem("student-id") ||
      localStorage.getItem("user-id") ||
      "N/A";

    const studentEmail =
      localStorage.getItem("user-email") ||
      "";

    const examDetails = {
      examId: exam._id || id,
      examName: exam.title || "Online Exam",
      studentName,
      registrationNumber,
      studentEmail,
    };

    socket.on("connect", () => {
      console.log(
        "🔌 Exam monitoring connected:",
        socket.id
      );

      socket.emit(
        "student-exam-start",
        examDetails
      );
    });

    socket.on("connect_error", (error) => {
      console.warn(
        "Exam monitoring connection failed:",
        error.message
      );
    });

    const handleVisibilityChange = () => {
      if (!examStartedRef.current) {
        return;
      }

      if (document.hidden) {
        tabSwitchCountRef.current += 1;

        socket.emit("exam-tab-switch", {
          ...examDetails,
          tabSwitchCount:
            tabSwitchCountRef.current,
        });

        console.log(
          "⚠️ Tab switch detected:",
          tabSwitchCountRef.current
        );
      } else {
        socket.emit("exam-tab-return", {
          ...examDetails,
          tabSwitchCount:
            tabSwitchCountRef.current,
        });
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      examStartedRef.current = false;

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      socket.disconnect();
      socketRef.current = null;
    };
  }, [loading, exam, id]);

  /* =======================================================
     TIMER
  ======================================================= */

  useEffect(() => {
    if (
      loading ||
      !exam ||
      timeLeft <= 0 ||
      submitting
    ) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timerRef.current);

          if (!autoSubmittedRef.current) {
            autoSubmittedRef.current = true;

            setTimeout(() => {
              submitExam(true);
            }, 0);
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [loading, exam, submitting]);

  /* =======================================================
     FORMAT TIME
  ======================================================= */

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  /* =======================================================
     CURRENT QUESTION
  ======================================================= */

  const question = questions[currentQuestion];

  const questionText = useMemo(() => {
    return getQuestionText(question);
  }, [question]);

  const testCases = useMemo(() => {
    return getTestCases(question);
  }, [question]);

  /* =======================================================
     MCQ ANSWER
  ======================================================= */

  const handleAnswerChange = (
    questionId,
    answer
  ) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  /* =======================================================
     CODING LANGUAGE CHANGE
  ======================================================= */

  const handleLanguageChange = (
    questionId,
    language
  ) => {
    setCodingLanguages((previous) => ({
      ...previous,
      [questionId]: language,
    }));

    setCodingAnswers((previous) => ({
      ...previous,
      [questionId]: getStarterCode(
        question,
        language
      ),
    }));

    setOutput("");
  };

  /* =======================================================
     CODING ANSWER
  ======================================================= */

  const handleCodingChange = (
    questionId,
    code
  ) => {
    setCodingAnswers((previous) => ({
      ...previous,
      [questionId]: code,
    }));
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );

      setOutput("");
      setSelectedTestCase(0);
    }
  };

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );

      setOutput("");
      setSelectedTestCase(0);
    }
  };

  /* =======================================================
     GO TO QUESTION
  ======================================================= */

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
    setOutput("");
    setSelectedTestCase(0);
  };

  /* =======================================================
     RUN CODE
  ======================================================= */

  const handleRunCode = async () => {
    if (!question) {
      return;
    }

    const code =
      codingAnswers[question._id] || "";

    const language =
      codingLanguages[question._id] ||
      "JavaScript";

    if (!code.trim()) {
      alert("Please write some code first.");
      return;
    }

    try {
      setRunningCode(true);
      setOutput("Running test cases...");

      const cases =
        testCases.length > 0
          ? testCases
          : [{ input: "", expectedOutput: "" }];

      const results = [];

      for (let index = 0; index < cases.length; index++) {
        const testCase = cases[index];

        try {
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
                input:
                  testCase.input || "",
              }),
            }
          );

          const data =
            await response.json();

          if (!response.ok || !data.success) {
            results.push(
              `Test Case ${index + 1}
Status: Failed
Error: ${
                data.message ||
                "Code execution failed"
              }`
            );

            continue;
          }

          const actualOutput = String(
            data.output || ""
          ).trim();

          const expectedOutput = String(
            testCase.expectedOutput ||
              testCase.output ||
              ""
          ).trim();

          const passed =
            expectedOutput === ""
              ? data.status === "Accepted"
              : actualOutput ===
                expectedOutput;

          results.push(
            `Test Case ${index + 1}
Status: ${
              passed ? "✓ Passed" : "✗ Failed"
            }

Input:
${testCase.input || "No input"}

Expected Output:
${expectedOutput || "Not provided"}

Actual Output:
${actualOutput || "No output"}

Execution Status:
${data.status || "Unknown"}`
          );
        } catch (error) {
          results.push(
            `Test Case ${index + 1}
Status: Failed
Error: Unable to execute test case.`
          );
        }
      }

      setOutput(results.join("\n\n--------------------\n\n"));
    } catch (error) {
      console.error(
        "Run code error:",
        error
      );

      setOutput(
        "Unable to run code. Please try again."
      );
    } finally {
      setRunningCode(false);
    }
  };

  /* =======================================================
     USER DETAILS
  ======================================================= */

  const getUserDetails = () => {
    return {
      name:
        localStorage.getItem(
          "user-name"
        ) || "Student",

      email:
        localStorage.getItem(
          "user-email"
        ) || "",

      userId:
        localStorage.getItem(
          "user-id"
        ) || "",
    };
  };

  /* =======================================================
     SUBMIT MCQ
  ======================================================= */

  const submitMCQExam = async (
    autoSubmit = false
  ) => {
    if (submitting) {
      return;
    }

    const unanswered =
      questions.filter(
        (question) =>
          !answers[question._id]
      ).length;

    if (
      !autoSubmit &&
      unanswered > 0
    ) {
      const confirmSubmit =
        window.confirm(
          `${unanswered} question(s) are unanswered.\n\nDo you want to submit anyway?`
        );

      if (!confirmSubmit) {
        return;
      }
    }

    try {
      setSubmitting(true);

      clearInterval(timerRef.current);

      const user =
        getUserDetails();

      let correctQuestions = 0;
      let attemptedQuestions = 0;
      let score = 0;

      questions.forEach(
        (question) => {
          const selectedAnswer =
            answers[question._id];

          if (selectedAnswer) {
            attemptedQuestions++;
          }

          if (
            selectedAnswer &&
            selectedAnswer ===
              question.correctAnswer
          ) {
            correctQuestions++;

            score += Number(
              question.marks || 1
            );
          }
        }
      );

      const totalMarks =
        questions.reduce(
          (total, question) =>
            total +
            Number(
              question.marks || 1
            ),
          0
        );

      const resultData = {
        examId: exam._id,
        examTitle: exam.title,
        examType: "MCQ",

        studentEmail:
          user.email,

        studentName:
          user.name,

        totalQuestions:
          questions.length,

        attemptedQuestions,

        correctQuestions,

        score,

        totalMarks,

        status: "Completed",

        submittedAt:
          new Date().toISOString(),

        questionResults:
          questions.map(
            (question) => ({
              questionId:
                question._id,

              questionTitle:
                getQuestionText(
                  question
                ),

              submittedCode: "",

              language: "",

              selectedAnswer:
                answers[
                  question._id
                ] || "",

              status:
                answers[
                  question._id
                ]
                  ? "Answered"
                  : "Not Answered",

              correct:
                answers[
                  question._id
                ] ===
                question.correctAnswer,
            })
          ),
      };

      const response =
        await fetch(
          `${API_URL}/results`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              resultData
            ),
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
            "Failed to save result"
        );
      }

      alert(
        `Exam submitted successfully!\n\nScore: ${score}/${totalMarks}\nCorrect: ${correctQuestions}/${questions.length}`
      );

      navigate(
        "/student-results"
      );
    } catch (error) {
      console.error(
        "Submit MCQ error:",
        error
      );

      alert(
        error.message ||
          "Failed to submit exam. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     SUBMIT CODING EXAM
  ======================================================= */

  const submitCodingExam = async (
    autoSubmit = false
  ) => {
    if (submitting) {
      return;
    }

    const submissions =
      questions
        .map((question) => ({
          questionId:
            question._id,

          questionTitle:
            getQuestionText(
              question
            ),

          code:
            codingAnswers[
              question._id
            ] || "",

          language:
            codingLanguages[
              question._id
            ] ||
            "JavaScript",
        }))
        .filter(
          (submission) =>
            submission.code.trim()
        );

    if (
      !autoSubmit &&
      submissions.length === 0
    ) {
      alert(
        "Please answer at least one coding question."
      );

      return;
    }

    try {
      setSubmitting(true);

      clearInterval(
        timerRef.current
      );

      const user =
        getUserDetails();

      /* -----------------------------------------------
         SAVE CODING SUBMISSIONS
      ------------------------------------------------ */

      if (
        submissions.length > 0
      ) {
        const submissionResponse =
          await fetch(
            `${API_URL}/coding-submissions/bulk`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                examId:
                  exam._id,

                studentEmail:
                  user.email,

                studentName:
                  user.name,

                submissions,
              }),
            }
          );

        if (!submissionResponse.ok) {
          console.warn(
            "Coding submissions could not be saved."
          );
        }
      }

      /* -----------------------------------------------
         SAVE RESULT
      ------------------------------------------------ */

      const resultData = {
        examId: exam._id,

        examTitle:
          exam.title,

        examType: "Coding",

        studentEmail:
          user.email,

        studentName:
          user.name,

        totalQuestions:
          questions.length,

        attemptedQuestions:
          submissions.length,

        correctQuestions: 0,

        score: 0,

        status: "Completed",

        submittedAt:
          new Date().toISOString(),

        questionResults:
          submissions.map(
            (submission) => ({
              questionId:
                submission.questionId,

              questionTitle:
                submission.questionTitle,

              submittedCode:
                submission.code,

              language:
                submission.language,

              status: "Submitted",

              correct: false,
            })
          ),
      };

      const response =
        await fetch(
          `${API_URL}/results`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              resultData
            ),
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
            "Failed to save result"
        );
      }

      alert(
        "Coding exam submitted successfully!"
      );

      navigate(
        "/student-results"
      );
    } catch (error) {
      console.error(
        "Submit coding error:",
        error
      );

      alert(
        error.message ||
          "Failed to submit coding exam."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     MAIN SUBMIT
  ======================================================= */

  const submitExam = useCallback(
    async (autoSubmit = false) => {
      if (!exam || submitting) {
        return;
      }

      if (exam.type === "MCQ") {
        await submitMCQExam(
          autoSubmit
        );
      } else {
        await submitCodingExam(
          autoSubmit
        );
      }
    },
    [
      exam,
      submitting,
      answers,
      codingAnswers,
      codingLanguages,
      questions,
    ]
  );

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="online-exam-loading">
        <div className="loading-spinner"></div>

        <h2>
          Loading Exam...
        </h2>

        <p>
          Please wait while we prepare
          your exam.
        </p>
      </div>
    );
  }

  /* =======================================================
     EXAM NOT FOUND
  ======================================================= */

  if (!exam) {
    return (
      <div className="online-exam-loading">
        <h2>
          Exam not found
        </h2>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/student-exams"
            )
          }
        >
          Back to Exams
        </button>
      </div>
    );
  }

  /* =======================================================
     NO QUESTIONS
  ======================================================= */

  if (questions.length === 0) {
    return (
      <div className="online-exam-loading">
        <h2>
          {exam.title}
        </h2>

        <p>
          No questions have been
          assigned to this exam yet.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/student-exams"
            )
          }
        >
          Back to Exams
        </button>
      </div>
    );
  }

  /* =======================================================
     ANSWERED COUNT
  ======================================================= */

  const answeredCount =
    exam.type === "MCQ"
      ? questions.filter(
          (q) =>
            answers[q._id]
        ).length
      : questions.filter(
          (q) =>
            codingAnswers[
              q._id
            ] &&
            codingAnswers[
              q._id
            ].trim()
        ).length;

  const progressPercentage =
    questions.length > 0
      ? Math.round(
          (answeredCount /
            questions.length) *
            100
        )
      : 0;

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="online-exam-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="exam-header">

        <div className="exam-brand-area">

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate(
                "/student-exams"
              )
            }
          >
            ←
          </button>

          <div className="brand-content">

            <div className="brand-logo">
              <span>&lt;/&gt;</span>
              CODEIT
            </div>

            <h1>
              {exam.title}
            </h1>

            <p>
              {exam.type} Exam
              <span>•</span>
              {questions.length} Questions
            </p>

          </div>

        </div>

        {/* TIMER */}

        <div
          className={`exam-timer ${
            timeLeft <= 60
              ? "danger"
              : ""
          }`}
        >
          <span className="timer-label">
            Time Remaining
          </span>

          <strong>
            ⏱ {formatTime(timeLeft)}
          </strong>
        </div>

      </header>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="exam-container">

        {/* =================================================
            QUESTION SECTION
        ================================================= */}

        <main className="question-section">

          {/* QUESTION TOP */}

          <div className="question-top">

            <div className="question-number">
              Question{" "}
              <strong>
                {currentQuestion + 1}
              </strong>{" "}
              of{" "}
              <strong>
                {questions.length}
              </strong>
            </div>

            <div className="marks-badge">
              {question.marks || 1} Mark
            </div>

          </div>

          {/* =================================================
              MCQ
          ================================================= */}

          {exam.type === "MCQ" && (
            <div className="mcq-question">

              <div className="question-type-badge">
                MCQ QUESTION
              </div>

              <h2 className="mcq-question-title">
                {questionText}
              </h2>

              {question.description && (
                <p className="question-description">
                  {question.description}
                </p>
              )}

              <div className="mcq-options">

                {(
                  question.options ||
                  []
                ).map(
                  (
                    option,
                    index
                  ) => (
                    <label
                      key={index}
                      className={`mcq-option ${
                        answers[
                          question._id
                        ] === option
                          ? "selected"
                          : ""
                      }`}
                    >

                      <input
                        type="radio"
                        name={`question-${question._id}`}
                        value={option}
                        checked={
                          answers[
                            question._id
                          ] ===
                          option
                        }
                        onChange={() =>
                          handleAnswerChange(
                            question._id,
                            option
                          )
                        }
                      />

                      <span className="option-letter">
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      <span className="option-text">
                        {option}
                      </span>

                    </label>
                  )
                )}

              </div>

            </div>
          )}

          {/* =================================================
              CODING
          ================================================= */}

          {exam.type === "Coding" && (
            <div className="coding-question">

              <div className="question-type-badge coding-badge">
                CODING CHALLENGE
              </div>

              <h2 className="coding-question-title">
                {questionText}
              </h2>

              {question.description && (
                <p className="question-description">
                  {question.description}
                </p>
              )}

              {/* =============================================
                  TEST CASES
              ============================================= */}

              <div className="testcases-section">

                <div className="section-title-row">

                  <div>
                    <h3>
                      Test Cases
                    </h3>

                    <p>
                      Use these test cases
                      to check your solution.
                    </p>
                  </div>

                  <span>
                    {testCases.length} Test
                    {testCases.length !==
                    1
                      ? "s"
                      : ""}
                  </span>

                </div>

                {testCases.length ===
                0 ? (
                  <div className="no-testcases">
                    No test cases available.
                  </div>
                ) : (
                  <>
                    <div className="testcase-tabs">

                      {testCases.map(
                        (
                          testCase,
                          index
                        ) => (
                          <button
                            key={index}
                            type="button"
                            className={
                              selectedTestCase ===
                              index
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              setSelectedTestCase(
                                index
                              )
                            }
                          >
                            Test Case{" "}
                            {index + 1}
                          </button>
                        )
                      )}

                    </div>

                    <div className="testcase-content">

                      <div className="testcase-box">

                        <h4>
                          Input
                        </h4>

                        <pre>
                          {testCases[
                            selectedTestCase
                          ]?.input ||
                            "No input"}
                        </pre>

                      </div>

                      <div className="testcase-box">

                        <h4>
                          Expected Output
                        </h4>

                        <pre>
                          {testCases[
                            selectedTestCase
                          ]
                            ?.expectedOutput ||
                            testCases[
                              selectedTestCase
                            ]?.output ||
                            "Not provided"}
                        </pre>

                      </div>

                    </div>
                  </>
                )}

              </div>

              {/* =============================================
                  LANGUAGE + EDITOR
              ============================================= */}

              <div className="editor-card">

                <div className="editor-toolbar">

                  <div className="language-area">

                    <span className="language-icon">
                      ●
                    </span>

                    <select
                      value={
                        codingLanguages[
                          question._id
                        ] ||
                        "JavaScript"
                      }
                      onChange={(e) =>
                        handleLanguageChange(
                          question._id,
                          e.target.value
                        )
                      }
                      disabled={
                        runningCode ||
                        submitting
                      }
                    >

                      {LANGUAGES.map(
                        (language) => (
                          <option
                            key={
                              language.value
                            }
                            value={
                              language.value
                            }
                          >
                            {
                              language.name
                            }
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <button
                    type="button"
                    className="run-code-button"
                    onClick={
                      handleRunCode
                    }
                    disabled={
                      runningCode ||
                      submitting
                    }
                  >
                    {runningCode
                      ? "⏳ Running..."
                      : "▶ Run Code"}
                  </button>

                </div>

                <textarea
                  className="code-editor"
                  value={
                    codingAnswers[
                      question._id
                    ] || ""
                  }
                  onChange={(e) =>
                    handleCodingChange(
                      question._id,
                      e.target.value
                    )
                  }
                  disabled={
                    submitting
                  }
                  spellCheck="false"
                  placeholder="Write your code here..."
                />

              </div>

              {/* =============================================
                  OUTPUT
              ============================================= */}

              {output && (
                <div className="output-card">

                  <div className="output-header">

                    <div>
                      <h3>
                        Output
                      </h3>

                      <span>
                        {
                          codingLanguages[
                            question._id
                          ] ||
                          "JavaScript"
                        }
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setOutput("")
                      }
                    >
                      Clear
                    </button>

                  </div>

                  <pre className="output-content">
                    {output}
                  </pre>

                </div>
              )}

            </div>
          )}

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div className="question-navigation">

            <button
              type="button"
              className="previous-button"
              onClick={
                handlePrevious
              }
              disabled={
                currentQuestion ===
                0
              }
            >
              ← Previous
            </button>

            <div className="navigation-center">
              <span>
                {currentQuestion + 1} /{" "}
                {questions.length}
              </span>
            </div>

            {currentQuestion <
            questions.length - 1 ? (
              <button
                type="button"
                className="next-button"
                onClick={handleNext}
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                className="submit-exam-button"
                onClick={() =>
                  submitExam(false)
                }
                disabled={
                  submitting
                }
              >
                {submitting
                  ? "Submitting..."
                  : "✓ Submit Exam"}
              </button>
            )}

          </div>

        </main>

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="exam-sidebar">

          {/* PROGRESS */}

          <div className="progress-card">

            <div className="progress-heading">

              <div className="progress-icon">
                ✓
              </div>

              <div>
                <h3>
                  Exam Progress
                </h3>

                <p>
                  Keep going!
                </p>
              </div>

            </div>

            <div className="progress-info">

              <span>
                Answered
              </span>

              <strong>
                {answeredCount}
                <small>
                  /{questions.length}
                </small>
              </strong>

            </div>

            <div className="progress-bar">
              <div
                style={{
                  width: `${progressPercentage}%`,
                }}
              ></div>
            </div>

            <div className="progress-percent">
              {progressPercentage}%
              completed
            </div>

          </div>

          {/* QUESTION PALETTE */}

          <div className="palette-card">

            <div className="palette-heading">

              <h3>
                Questions
              </h3>

              <span>
                {questions.length}
              </span>

            </div>

            <div className="question-palette">

              {questions.map(
                (q, index) => {
                  const answered =
                    exam.type ===
                    "MCQ"
                      ? Boolean(
                          answers[
                            q._id
                          ]
                        )
                      : Boolean(
                          codingAnswers[
                            q._id
                          ]?.trim()
                        );

                  return (
                    <button
                      key={q._id}
                      type="button"
                      className={`
                        ${
                          currentQuestion ===
                          index
                            ? "active"
                            : ""
                        }
                        ${
                          answered
                            ? "answered"
                            : ""
                        }
                      `}
                      onClick={() =>
                        goToQuestion(
                          index
                        )
                      }
                    >
                      {index + 1}
                    </button>
                  );
                }
              )}

            </div>

          </div>

          {/* EXAM INFO */}

          <div className="exam-info-card">

            <p>
              <strong>
                Type:
              </strong>{" "}
              {exam.type}
            </p>

            <p>
              <strong>
                Questions:
              </strong>{" "}
              {questions.length}
            </p>

            <p>
              <strong>
                Duration:
              </strong>{" "}
              {exam.duration} minutes
            </p>

            {exam.type ===
              "Coding" && (
              <p>
                <strong>
                  Languages:
                </strong>{" "}
                10
              </p>
            )}

          </div>

        </aside>

      </div>

    </div>
  );
}

export default OnlineExam;