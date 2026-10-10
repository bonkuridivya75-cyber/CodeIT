import React, { useState } from "react";

const API_URL = "http://localhost:5000/api";

const FacultyAddCodingQuestions = ({ onBack }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [marks, setMarks] = useState(1);

  const [javaCode, setJavaCode] = useState("");
  const [pythonCode, setPythonCode] = useState("");
  const [cppCode, setCppCode] = useState("");
  const [jsCode, setJsCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please enter question title and description.");
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
          type: "Coding",
          description: description.trim(),
          difficulty,
          input: input.trim(),
          output: output.trim(),
          starterCode: {
            Java: javaCode,
            Python: pythonCode,
            "C++": cppCode,
            JavaScript: jsCode,
          },
          marks: Number(marks),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to save question.");
        return;
      }

      setMessage("Coding question saved successfully!");

      setTitle("");
      setDescription("");
      setDifficulty("Easy");
      setInput("");
      setOutput("");
      setMarks(1);
      setJavaCode("");
      setPythonCode("");
      setCppCode("");
      setJsCode("");
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faculty-question-page">
      <div className="faculty-question-header">
        <div>
          <h1>Add Coding Question</h1>
          <p>Create a coding question for student exams.</p>
        </div>

        {onBack && (
          <button onClick={onBack} className="back-btn">
            ← Back
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="coding-question-form">

        <div className="form-group">
          <label>Question Title</label>
          <input
            type="text"
            placeholder="Example: Two Sum"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Enter the coding problem description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
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

        <div className="form-group">
          <label>Input</label>
          <textarea
            placeholder="Enter input format..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Output</label>
          <textarea
            placeholder="Enter output format..."
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            rows="3"
          />
        </div>

        <h2>Starter Code</h2>

        <div className="form-group">
          <label>Java</label>
          <textarea
            placeholder="Enter Java starter code..."
            value={javaCode}
            onChange={(e) => setJavaCode(e.target.value)}
            rows="6"
          />
        </div>

        <div className="form-group">
          <label>Python</label>
          <textarea
            placeholder="Enter Python starter code..."
            value={pythonCode}
            onChange={(e) => setPythonCode(e.target.value)}
            rows="6"
          />
        </div>

        <div className="form-group">
          <label>C++</label>
          <textarea
            placeholder="Enter C++ starter code..."
            value={cppCode}
            onChange={(e) => setCppCode(e.target.value)}
            rows="6"
          />
        </div>

        <div className="form-group">
          <label>JavaScript</label>
          <textarea
            placeholder="Enter JavaScript starter code..."
            value={jsCode}
            onChange={(e) => setJsCode(e.target.value)}
            rows="6"
          />
        </div>

        {error && (
          <div className="question-error">
            {error}
          </div>
        )}

        {message && (
          <div className="question-success">
            {message}
          </div>
        )}

        <button
          type="submit"
          className="save-question-btn"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Coding Question"}
        </button>

      </form>
    </div>
  );
};

export default FacultyAddCodingQuestions;