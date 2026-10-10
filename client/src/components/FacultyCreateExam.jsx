import React, { useState } from "react";
import "./FacultyCreateExam.css";

const API_URL = "/api";

function FacultyCreateExam({
  darkMode,
  toggleTheme,
  onBack,
}) {
  /* =====================================================
     EXAM DETAILS
  ===================================================== */

  const [examType, setExamType] = useState("MCQ");

  const [examTitle, setExamTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  /* =====================================================
     QUESTION FORM
  ===================================================== */

  const emptyQuestion = {
    title: "",
    description: "",
    input: "",
    output: "",
    marks: "1",

    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",

    starterCode: "",

    testInput: "",
    expectedOutput: "",
  };

  const [questionForm, setQuestionForm] =
    useState(emptyQuestion);

  /* =====================================================
     CREATED QUESTIONS
  ===================================================== */

  const [createdQuestions, setCreatedQuestions] =
    useState([]);

  const [saving, setSaving] = useState(false);

  /* =====================================================
     QUESTION FORM CHANGE
  ===================================================== */

  const handleQuestionChange = (field, value) => {
    setQuestionForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =====================================================
     CHANGE EXAM TYPE
  ===================================================== */

  const handleExamTypeChange = (type) => {
    setExamType(type);

    setQuestionForm(emptyQuestion);

    setCreatedQuestions([]);
  };

  /* =====================================================
     VALIDATE QUESTION
  ===================================================== */

  const validateQuestion = () => {
    if (!questionForm.title.trim()) {
      alert("Please enter question title.");
      return false;
    }

    if (!questionForm.description.trim()) {
      alert("Please enter question description.");
      return false;
    }

    if (
      !questionForm.marks ||
      Number(questionForm.marks) < 1
    ) {
      alert("Please enter valid marks.");
      return false;
    }

    /* ================= MCQ ================= */

    if (examType === "MCQ") {
      if (
        !questionForm.optionA.trim() ||
        !questionForm.optionB.trim() ||
        !questionForm.optionC.trim() ||
        !questionForm.optionD.trim()
      ) {
        alert("Please enter all four options.");
        return false;
      }

      if (!questionForm.correctAnswer.trim()) {
        alert("Please select the correct answer.");
        return false;
      }
    }

    /* ================= CODING ================= */

    if (examType === "Coding") {
      if (!questionForm.input.trim()) {
        alert("Please enter input description.");
        return false;
      }

      if (!questionForm.output.trim()) {
        alert("Please enter output description.");
        return false;
      }

      if (!questionForm.starterCode.trim()) {
        alert("Please enter starter code.");
        return false;
      }

      if (!questionForm.testInput.trim()) {
        alert("Please enter test case input.");
        return false;
      }

      if (!questionForm.expectedOutput.trim()) {
        alert("Please enter expected output.");
        return false;
      }
    }

    return true;
  };

  /* =====================================================
     ADD QUESTION
  ===================================================== */

  const handleAddQuestion = () => {
    if (!validateQuestion()) {
      return;
    }

    const newQuestion = {
      ...questionForm,
      type: examType,
      id: Date.now(),
    };

    setCreatedQuestions((previous) => [
      ...previous,
      newQuestion,
    ]);

    setQuestionForm(emptyQuestion);

    alert(
      `${examType} question added successfully.`
    );
  };

  /* =====================================================
     REMOVE QUESTION
  ===================================================== */

  const handleRemoveQuestion = (id) => {
    setCreatedQuestions((previous) =>
      previous.filter(
        (question) => question.id !== id
      )
    );
  };

  /* =====================================================
     CREATE EXAM
  ===================================================== */

  const handleCreateExam = async (event) => {
    event.preventDefault();

    if (!examTitle.trim()) {
      alert("Please enter exam title.");
      return;
    }

    if (!subject.trim()) {
      alert("Please enter subject.");
      return;
    }

    if (!duration || Number(duration) < 1) {
      alert("Please enter valid duration.");
      return;
    }

    if (!startDate || !startTime) {
      alert("Please select exam start date and time.");
      return;
    }

    if (!endDate || !endTime) {
      alert("Please select exam end date and time.");
      return;
    }

    if (createdQuestions.length === 0) {
      alert(
        "Please create at least one question."
      );
      return;
    }

    const startDateTime = new Date(
      `${startDate}T${startTime}`
    );

    const endDateTime = new Date(
      `${endDate}T${endTime}`
    );

    if (endDateTime <= startDateTime) {
      alert(
        "End date/time must be after start date/time."
      );
      return;
    }

    const facultyId =
      localStorage.getItem("user-id");

    if (!facultyId) {
      alert(
        "Faculty ID not found. Please login again."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/exams`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: examTitle.trim(),

            subject: subject.trim(),

            type: examType,

            duration: Number(duration),

            questions:
              createdQuestions.length,

            startDate,

            startTime,

            endDate,

            endTime,

            createdBy: facultyId,

            createdQuestions:
              createdQuestions.map(
                (question) => ({
                  title:
                    question.title.trim(),

                  description:
                    question.description.trim(),

                  type: examType,

                  input:
                    question.input.trim(),

                  output:
                    question.output.trim(),

                  marks:
                    Number(question.marks),

                  options:
                    examType === "MCQ"
                      ? [
                          question.optionA.trim(),
                          question.optionB.trim(),
                          question.optionC.trim(),
                          question.optionD.trim(),
                        ]
                      : [],

                  correctAnswer:
                    examType === "MCQ"
                      ? question.correctAnswer.trim()
                      : "",

                  starterCode:
                    examType === "Coding"
                      ? {
                          JavaScript:
                            question.starterCode,
                          Python:
                            question.starterCode,
                          Java:
                            question.starterCode,
                          "C++":
                            question.starterCode,
                        }
                      : {},

                  testCases:
                    examType === "Coding"
                      ? [
                          {
                            input:
                              question.testInput.trim(),
                            expectedOutput:
                              question.expectedOutput.trim(),
                          },
                        ]
                      : [],
                })
              ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to create exam."
        );
      }

      alert(
        "Exam and questions created successfully!"
      );

      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error(
        "Create exam error:",
        error
      );

      alert(
        error.message ||
          "Failed to create exam."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className={`faculty-create-exam-page ${
        darkMode ? "dark" : "light"
      }`}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="create-exam-header">

        <div className="create-exam-header-left">

          <button
            type="button"
            className="create-back-btn"
            onClick={onBack}
          >
            ← Back to Exams
          </button>

          <div>
            <h1>Create Examination</h1>

            <p>
              Create an examination and add
              your own questions.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="create-theme-btn"
          onClick={toggleTheme}
        >
          {darkMode
            ? "☀️ Light Mode"
            : "🌙 Dark Mode"}
        </button>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="create-exam-container">

        <form
          onSubmit={handleCreateExam}
        >

          {/* =================================================
              1. EXAM TYPE
          ================================================= */}

          <section className="create-section">

            <div className="section-heading">
              <span>1</span>

              <div>
                <h2>Choose Exam Type</h2>

                <p>
                  Select the type of examination
                  you want to create.
                </p>
              </div>
            </div>


            <div className="exam-type-grid">

              <button
                type="button"
                className={`exam-type-option ${
                  examType === "MCQ"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleExamTypeChange("MCQ")
                }
              >

                <div className="type-icon">
                  📝
                </div>

                <div>
                  <strong>
                    MCQ Exam
                  </strong>

                  <small>
                    Multiple choice questions
                  </small>
                </div>

              </button>


              <button
                type="button"
                className={`exam-type-option ${
                  examType === "Coding"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleExamTypeChange(
                    "Coding"
                  )
                }
              >

                <div className="type-icon">
                  💻
                </div>

                <div>
                  <strong>
                    Coding Exam
                  </strong>

                  <small>
                    Programming problems
                  </small>
                </div>

              </button>

            </div>

          </section>


          {/* =================================================
              2. EXAM DETAILS
          ================================================= */}

          <section className="create-section">

            <div className="section-heading">
              <span>2</span>

              <div>
                <h2>Exam Details</h2>

                <p>
                  Enter the basic examination
                  information.
                </p>
              </div>
            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Exam Title
                </label>

                <input
                  type="text"
                  placeholder={
                    examType === "MCQ"
                      ? "Example: Java MCQ Assessment"
                      : "Example: Java Coding Challenge"
                  }
                  value={examTitle}
                  onChange={(event) =>
                    setExamTitle(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Example: Java Programming"
                  value={subject}
                  onChange={(event) =>
                    setSubject(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Duration (Minutes)
                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="60"
                  value={duration}
                  onChange={(event) =>
                    setDuration(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

          </section>


          {/* =================================================
              3. SCHEDULE
          ================================================= */}

          <section className="create-section">

            <div className="section-heading">
              <span>3</span>

              <div>
                <h2>Exam Schedule</h2>

                <p>
                  Set when students can access
                  this examination.
                </p>
              </div>
            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Start Time
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    setStartTime(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  End Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(event) =>
                    setEndDate(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  End Time
                </label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(event) =>
                    setEndTime(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

          </section>


          {/* =================================================
              4. CREATE YOUR OWN QUESTION
          ================================================= */}

          <section className="create-section question-builder">

            <div className="section-heading">
              <span>4</span>

              <div>
                <h2>
                  Create Your Own Questions
                </h2>

                <p>
                  Add the questions that students
                  will see in this examination.
                </p>
              </div>
            </div>


            {/* QUESTION BASIC */}

            <div className="question-builder-card">

              <h3>
                {examType} Question
              </h3>


              <div className="form-group">

                <label>
                  Question Title
                </label>

                <input
                  type="text"
                  placeholder={
                    examType === "MCQ"
                      ? "Example: What is Java?"
                      : "Example: Find the largest number"
                  }
                  value={questionForm.title}
                  onChange={(event) =>
                    handleQuestionChange(
                      "title",
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Question Description
                </label>

                <textarea
                  rows="4"
                  placeholder="Enter the complete question description..."
                  value={
                    questionForm.description
                  }
                  onChange={(event) =>
                    handleQuestionChange(
                      "description",
                      event.target.value
                    )
                  }
                />

              </div>


              {/* =================================================
                  MCQ FIELDS
              ================================================= */}

              {examType === "MCQ" && (

                <div className="mcq-builder">

                  <h4>
                    Answer Options
                  </h4>


                  <div className="options-grid">

                    <div className="form-group">

                      <label>
                        Option A
                      </label>

                      <input
                        type="text"
                        placeholder="Option A"
                        value={
                          questionForm.optionA
                        }
                        onChange={(event) =>
                          handleQuestionChange(
                            "optionA",
                            event.target.value
                          )
                        }
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Option B
                      </label>

                      <input
                        type="text"
                        placeholder="Option B"
                        value={
                          questionForm.optionB
                        }
                        onChange={(event) =>
                          handleQuestionChange(
                            "optionB",
                            event.target.value
                          )
                        }
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Option C
                      </label>

                      <input
                        type="text"
                        placeholder="Option C"
                        value={
                          questionForm.optionC
                        }
                        onChange={(event) =>
                          handleQuestionChange(
                            "optionC",
                            event.target.value
                          )
                        }
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Option D
                      </label>

                      <input
                        type="text"
                        placeholder="Option D"
                        value={
                          questionForm.optionD
                        }
                        onChange={(event) =>
                          handleQuestionChange(
                            "optionD",
                            event.target.value
                          )
                        }
                      />

                    </div>

                  </div>


                  <div className="form-row">

                    <div className="form-group">

                      <label>
                        Correct Answer
                      </label>

                      <select
                        value={
                          questionForm.correctAnswer
                        }
                        onChange={(event) =>
                          handleQuestionChange(
                            "correctAnswer",
                            event.target.value
                          )
                        }
                      >

                        <option value="">
                          Select Correct Answer
                        </option>

                        <option
                          value={
                            questionForm.optionA
                          }
                          disabled={
                            !questionForm.optionA
                          }
                        >
                          A -{" "}
                          {questionForm.optionA ||
                            "Option A"}
                        </option>

                        <option
                          value={
                            questionForm.optionB
                          }
                          disabled={
                            !questionForm.optionB
                          }
                        >
                          B -{" "}
                          {questionForm.optionB ||
                            "Option B"}
                        </option>

                        <option
                          value={
                            questionForm.optionC
                          }
                          disabled={
                            !questionForm.optionC
                          }
                        >
                          C -{" "}
                          {questionForm.optionC ||
                            "Option C"}
                        </option>

                        <option
                          value={
                            questionForm.optionD
                          }
                          disabled={
                            !questionForm.optionD
                          }
                        >
                          D -{" "}
                          {questionForm.optionD ||
                            "Option D"}
                        </option>

                      </select>

                    </div>


                    <div className="form-group small-field">

                      <label>
                        Marks
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          questionForm.marks
                        }
                        onChange={(event) =>
                          handleQuestionChange(
                            "marks",
                            event.target.value
                          )
                        }
                      />

                    </div>

                  </div>

                </div>
              )}


              {/* =================================================
                  CODING FIELDS
              ================================================= */}

              {examType === "Coding" && (

                <div className="coding-builder">

                  <div className="form-row">

                    <div className="form-group">

                      <label>
                        Input
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Explain the input format..."
                        value={
                          questionForm.input
                        }
                        onChange={(event) =>
                          handleQuestionChange(
                            "input",
                            event.target.value
                          )
                        }
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Output
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Explain the expected output..."
                        value={
                          questionForm.output
                        }
                        onChange={(event) =>
                          handleQuestionChange(
                            "output",
                            event.target.value
                          )
                        }
                      />

                    </div>

                  </div>


                  <div className="form-group">

                    <label>
                      Starter Code
                    </label>

                    <textarea
                      className="code-input"
                      rows="8"
                      placeholder="Enter starter code..."
                      value={
                        questionForm.starterCode
                      }
                      onChange={(event) =>
                        handleQuestionChange(
                          "starterCode",
                          event.target.value
                        )
                      }
                    />

                  </div>


                  <div className="form-row">

                    <div className="form-group">

                      <label>
                        Test Case Input
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Example: 10 20"
                        value={
                          questionForm.testInput
                        }
                        onChange={(event) =>
                          handleQuestionChange(
                            "testInput",
                            event.target.value
                          )
                        }
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Expected Output
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Example: 30"
                        value={
                          questionForm.expectedOutput
                        }
                        onChange={(event) =>
                          handleQuestionChange(
                            "expectedOutput",
                            event.target.value
                          )
                        }
                      />

                    </div>

                  </div>


                  <div className="form-group small-field">

                    <label>
                      Marks
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={
                        questionForm.marks
                      }
                      onChange={(event) =>
                        handleQuestionChange(
                          "marks",
                          event.target.value
                        )
                      }
                    />

                  </div>

                </div>
              )}


              {/* ADD QUESTION */}

              <button
                type="button"
                className="add-question-btn"
                onClick={
                  handleAddQuestion
                }
              >
                ＋ Add {examType} Question
              </button>

            </div>


            {/* =================================================
                CREATED QUESTIONS
            ================================================= */}

            <div className="created-questions-section">

              <div className="created-question-header">

                <div>
                  <h3>
                    Your Created Questions
                  </h3>

                  <p>
                    {createdQuestions.length}{" "}
                    question
                    {createdQuestions.length !==
                    1
                      ? "s"
                      : ""}{" "}
                    added
                  </p>
                </div>

                <span className="question-count-badge">
                  {createdQuestions.length}
                </span>

              </div>


              {createdQuestions.length === 0 ? (

                <div className="no-created-questions">

                  <div>
                    📝
                  </div>

                  <h4>
                    No questions created yet
                  </h4>

                  <p>
                    Create your first question
                    using the form above.
                  </p>

                </div>

              ) : (

                <div className="created-question-list">

                  {createdQuestions.map(
                    (question, index) => (

                      <div
                        className="created-question-item"
                        key={question.id}
                      >

                        <div className="created-number">
                          {index + 1}
                        </div>

                        <div className="created-question-info">

                          <div className="created-question-title">
                            {question.title}
                          </div>

                          <div className="created-question-meta">

                            <span>
                              {examType}
                            </span>

                            <span>
                              {question.marks}{" "}
                              Mark
                            </span>

                          </div>

                        </div>

                        <button
                          type="button"
                          className="remove-question-btn"
                          onClick={() =>
                            handleRemoveQuestion(
                              question.id
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </section>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="create-exam-actions">

            <button
              type="button"
              className="cancel-create-btn"
              onClick={onBack}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="final-create-btn"
              disabled={saving}
            >
              {saving
                ? "Creating Exam..."
                : "✓ Create Exam"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default FacultyCreateExam;