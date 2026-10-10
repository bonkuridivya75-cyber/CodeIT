import React, { useState } from "react";
import "./FacultyAddMCQQuestions.css";

const API_URL = "http://localhost:5000/api";

const FacultyAddMCQQuestions = ({ onBack }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [marks, setMarks] = useState(1);

  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter question title.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter question description.");
      return;
    }

    if (options.some((option) => !option.trim())) {
      setError("Please enter all four options.");
      return;
    }

    if (!correctAnswer) {
      setError("Please select the correct answer.");
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
          title: title.trim(),
          type: "MCQ",
          description: description.trim(),
          difficulty,
          options: options.map((option) => option.trim()),
          correctAnswer,
          marks: Number(marks),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to save MCQ.");
        return;
      }

      setSuccess("MCQ question saved successfully!");

      setTitle("");
      setDescription("");
      setDifficulty("Easy");
      setMarks(1);
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
    } catch (err) {
      console.error("MCQ error:", err);

      setError(
        "Unable to connect to server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mcq-page">

      <div className="mcq-header">
        <div>
          <h1>Add MCQ Question</h1>
          <p>Create multiple-choice questions for student exams.</p>
        </div>

        {onBack && (
          <button className="back-btn" onClick={onBack}>
            ← Back
          </button>
        )}
      </div>

      <form className="mcq-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Question Title</label>

          <input
            type="text"
            placeholder="Example: What is React?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Question</label>

          <textarea
            rows="4"
            placeholder="Enter the question..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Difficulty</label>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Marks</label>

            <input
              type="number"
              min="1"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
            />
          </div>

        </div>

        <h2>Options</h2>

        {options.map((option, index) => (
          <div className="option-row" key={index}>

            <span className="option-label">
              {String.fromCharCode(65 + index)}
            </span>

            <input
              type="text"
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
              value={option}
              onChange={(e) =>
                handleOptionChange(index, e.target.value)
              }
            />

          </div>
        ))}

        <div className="form-group correct-answer">
          <label>Correct Answer</label>

          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          >
            <option value="">Select correct answer</option>

            {options.map((option, index) => (
              <option
                key={index}
                value={option}
                disabled={!option.trim()}
              >
                {String.fromCharCode(65 + index)} - {option}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mcq-message error">
            {error}
          </div>
        )}

        {success && (
          <div className="mcq-message success">
            {success}
          </div>
        )}

        <button
          type="submit"
          className="save-mcq-btn"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save MCQ Question"}
        </button>

      </form>
    </div>
  );
};

export default FacultyAddMCQQuestions;