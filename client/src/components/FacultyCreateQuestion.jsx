import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyCreateQuestion.css";

const API_URL = "/api";

function FacultyCreateQuestion() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "Option A",
    marks: 1,
    difficulty: "Medium",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.question.trim()) {
      setError("Please enter the question.");
      return;
    }

    if (
      !form.optionA.trim() ||
      !form.optionB.trim() ||
      !form.optionC.trim() ||
      !form.optionD.trim()
    ) {
      setError("Please fill all four options.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "MCQ",
          question: form.question.trim(),

          optionA: form.optionA.trim(),
          optionB: form.optionB.trim(),
          optionC: form.optionC.trim(),
          optionD: form.optionD.trim(),

          correctAnswer: form.correctAnswer,

          marks: Number(form.marks),
          difficulty: form.difficulty,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create question"
        );
      }

      setMessage("MCQ question created successfully!");

      setForm({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "Option A",
        marks: 1,
        difficulty: "Medium",
      });

      setTimeout(() => {
        navigate("/faculty-questions");
      }, 900);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to create question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fcq-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* HEADER */}

      <header className="fcq-header">
        <div className="fcq-brand">
          <div className="fcq-logo">&lt;/&gt;</div>

          <div>
            <h1>CodeIT</h1>
            <span>Faculty Question Bank</span>
          </div>
        </div>

        <div className="fcq-header-actions">
          <button
            onClick={() => navigate("/faculty-questions")}
            className="fcq-header-button"
          >
            ← Questions
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="fcq-header-button"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* MAIN */}

      <main className="fcq-container">
        <div className="fcq-heading">
          <div>
            <span>QUESTION BANK / CREATE</span>

            <h2>Create MCQ Question</h2>

            <p>
              Create your own multiple-choice question for
              student examinations.
            </p>
          </div>
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="fcq-success">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="fcq-error">
            ⚠️ {error}
          </div>
        )}

        {/* FORM */}

        <form
          className="fcq-form"
          onSubmit={handleSubmit}
        >
          {/* QUESTION */}

          <section className="fcq-card">
            <div className="fcq-card-heading">
              <div className="fcq-number">01</div>

              <div>
                <h3>Question</h3>
                <p>Enter the question for students.</p>
              </div>
            </div>

            <label>
              Question Text <span>*</span>
            </label>

            <textarea
              name="question"
              value={form.question}
              onChange={handleChange}
              placeholder="Enter your question here..."
              rows="5"
            />
          </section>

          {/* OPTIONS */}

          <section className="fcq-card">
            <div className="fcq-card-heading">
              <div className="fcq-number">02</div>

              <div>
                <h3>Answer Options</h3>
                <p>Enter four possible answers.</p>
              </div>
            </div>

            <div className="fcq-options-grid">

              <div className="fcq-field">
                <label>
                  Option A <span>*</span>
                </label>

                <input
                  type="text"
                  name="optionA"
                  value={form.optionA}
                  onChange={handleChange}
                  placeholder="Enter option A"
                />
              </div>

              <div className="fcq-field">
                <label>
                  Option B <span>*</span>
                </label>

                <input
                  type="text"
                  name="optionB"
                  value={form.optionB}
                  onChange={handleChange}
                  placeholder="Enter option B"
                />
              </div>

              <div className="fcq-field">
                <label>
                  Option C <span>*</span>
                </label>

                <input
                  type="text"
                  name="optionC"
                  value={form.optionC}
                  onChange={handleChange}
                  placeholder="Enter option C"
                />
              </div>

              <div className="fcq-field">
                <label>
                  Option D <span>*</span>
                </label>

                <input
                  type="text"
                  name="optionD"
                  value={form.optionD}
                  onChange={handleChange}
                  placeholder="Enter option D"
                />
              </div>

            </div>
          </section>

          {/* SETTINGS */}

          <section className="fcq-card">
            <div className="fcq-card-heading">
              <div className="fcq-number">03</div>

              <div>
                <h3>Question Settings</h3>
                <p>Configure the answer and marks.</p>
              </div>
            </div>

            <div className="fcq-settings-grid">

              <div className="fcq-field">
                <label>
                  Correct Answer <span>*</span>
                </label>

                <select
                  name="correctAnswer"
                  value={form.correctAnswer}
                  onChange={handleChange}
                >
                  <option value="Option A">
                    Option A
                  </option>

                  <option value="Option B">
                    Option B
                  </option>

                  <option value="Option C">
                    Option C
                  </option>

                  <option value="Option D">
                    Option D
                  </option>
                </select>
              </div>

              <div className="fcq-field">
                <label>
                  Marks <span>*</span>
                </label>

                <input
                  type="number"
                  name="marks"
                  min="1"
                  value={form.marks}
                  onChange={handleChange}
                />
              </div>

              <div className="fcq-field">
                <label>Difficulty</label>

                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
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
          </section>

          {/* PREVIEW */}

          <section className="fcq-preview">
            <div className="fcq-preview-label">
              LIVE PREVIEW
            </div>

            <h3>
              {form.question ||
                "Your question will appear here..."}
            </h3>

            <div className="fcq-preview-options">

              {[
                ["A", form.optionA],
                ["B", form.optionB],
                ["C", form.optionC],
                ["D", form.optionD],
              ].map(([letter, value]) => (
                <div
                  className={`fcq-preview-option ${
                    form.correctAnswer ===
                    `Option ${letter}`
                      ? "correct"
                      : ""
                  }`}
                  key={letter}
                >
                  <strong>{letter}</strong>

                  <span>
                    {value || `Option ${letter}`}
                  </span>
                </div>
              ))}

            </div>
          </section>

          {/* BUTTONS */}

          <div className="fcq-actions">

            <button
              type="button"
              className="fcq-cancel"
              onClick={() =>
                navigate("/faculty-questions")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="fcq-submit"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "✓ Create MCQ Question"}
            </button>

          </div>
        </form>
      </main>
    </div>
  );
}

export default FacultyCreateQuestion;