import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentCodingPractice.css";

const API_URL = "/api";

function StudentCodingPractice() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/questions/coding`);
      const data = await response.json();

      if (data.success) {
        setQuestions(data.questions || []);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error("Failed to fetch coding questions:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesDifficulty =
      difficulty === "All" || question.difficulty === difficulty;

    return matchesSearch && matchesDifficulty;
  });

  const easyCount = questions.filter(
    (q) => q.difficulty === "Easy"
  ).length;

  const mediumCount = questions.filter(
    (q) => q.difficulty === "Medium"
  ).length;

  const hardCount = questions.filter(
    (q) => q.difficulty === "Hard"
  ).length;

  return (
    <div className="coding-practice-page">
      <header className="coding-header">
        <div>
          <h1>💻 Coding Practice</h1>
          <p>
            Practice coding problems and improve your programming skills.
          </p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/student-dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      {/* Stats */}
      <div className="coding-stats">
        <div className="coding-stat-card total">
          <div className="stat-icon">📝</div>
          <div>
            <h3>{questions.length}</h3>
            <p>Total Questions</p>
          </div>
        </div>

        <div className="coding-stat-card easy">
          <div className="stat-icon">🟢</div>
          <div>
            <h3>{easyCount}</h3>
            <p>Easy</p>
          </div>
        </div>

        <div className="coding-stat-card medium">
          <div className="stat-icon">🟡</div>
          <div>
            <h3>{mediumCount}</h3>
            <p>Medium</p>
          </div>
        </div>

        <div className="coding-stat-card hard">
          <div className="stat-icon">🔴</div>
          <div>
            <h3>{hardCount}</h3>
            <p>Hard</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="coding-controls">
        <div className="search-box">
          🔍
          <input
            type="text"
            placeholder="Search coding questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="difficulty-buttons">
          <button
            className={difficulty === "All" ? "active" : ""}
            onClick={() => setDifficulty("All")}
          >
            All
          </button>

          <button
            className={difficulty === "Easy" ? "active easy-btn" : ""}
            onClick={() => setDifficulty("Easy")}
          >
            🟢 Easy
          </button>

          <button
            className={difficulty === "Medium" ? "active medium-btn" : ""}
            onClick={() => setDifficulty("Medium")}
          >
            🟡 Medium
          </button>

          <button
            className={difficulty === "Hard" ? "active hard-btn" : ""}
            onClick={() => setDifficulty("Hard")}
          >
            🔴 Hard
          </button>
        </div>
      </div>

      {/* Questions */}
      {loading ? (
        <div className="coding-loading">
          <div className="loader"></div>
          <p>Loading coding questions...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="coding-empty">
          <div>🔎</div>
          <h2>No Questions Found</h2>
          <p>Try another search or difficulty filter.</p>
        </div>
      ) : (
        <div className="coding-question-grid">
          {filteredQuestions.map((question, index) => (
            <div className="coding-question-card" key={question._id}>
              <div className="question-top">
                <span className="question-number">
                  #{index + 1}
                </span>

                <span
                  className={`difficulty ${question.difficulty?.toLowerCase()}`}
                >
                  {question.difficulty}
                </span>
              </div>

              <h2>{question.title}</h2>

              <p className="question-description">
                {question.description ||
                  "Solve this coding problem using your preferred programming language."}
              </p>

              <div className="question-footer">
                <span>⭐ {question.marks || 1} Marks</span>

                <button
                  className="solve-btn"
                  onClick={() =>
                    navigate(
                      `/student-coding-question/${question._id}`
                    )
                  }
                >
                  Solve →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentCodingPractice;