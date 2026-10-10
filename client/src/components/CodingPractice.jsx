import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CodingPractice.css";

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Given an array of integers and a target value, find two numbers whose sum equals the target.",
  },
  {
    id: 2,
    title: "Palindrome Number",
    difficulty: "Easy",
    category: "Math",
    description:
      "Determine whether a given integer reads the same forward and backward.",
  },
  {
    id: 3,
    title: "Binary Search",
    difficulty: "Easy",
    category: "Searching",
    description:
      "Search for a target value in a sorted array using binary search.",
  },
  {
    id: 4,
    title: "Reverse String",
    difficulty: "Easy",
    category: "Strings",
    description:
      "Write a program to reverse a string without changing the characters.",
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Medium",
    category: "Stack",
    description:
      "Check whether brackets in a string are correctly balanced.",
  },
  {
    id: 6,
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Find the contiguous subarray having the maximum possible sum.",
  },
  {
    id: 7,
    title: "Merge Two Sorted Lists",
    difficulty: "Medium",
    category: "Linked List",
    description:
      "Merge two sorted linked lists into one sorted linked list.",
  },
  {
    id: 8,
    title: "Fibonacci Number",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description:
      "Calculate the nth Fibonacci number efficiently.",
  },
];

function CodingPractice() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        problem.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        problem.category
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "All" ||
        problem.difficulty === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [search, difficulty]);

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("placement-login");
    localStorage.removeItem("user-role");
    localStorage.removeItem("user-email");
    localStorage.removeItem("user-name");
    localStorage.removeItem("user-id");
    localStorage.removeItem("userId");
    localStorage.removeItem("user_id");

    navigate("/login");
  };

  const openProblem = (problem) => {
    navigate(`/coding-practice/${problem.id}`);
  };

  return (
    <div
      className={`coding-practice-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >

      {/* =========================
          HEADER
      ========================= */}

      <header className="coding-header">

        <div className="coding-brand">

          <div className="coding-logo">
            &lt;/&gt;
          </div>

          <div>
            <h2>CodeIT</h2>
            <span>Coding Practice</span>
          </div>

        </div>

        <div className="coding-header-actions">

          <button
            onClick={() =>
              navigate("/student-dashboard")
            }
            className="coding-header-btn"
          >
            ← Dashboard
          </button>

          <button
            onClick={() =>
              setDarkMode((previous) => !previous)
            }
            className="coding-header-btn"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button
            onClick={handleLogout}
            className="coding-logout-btn"
          >
            Logout
          </button>

        </div>

      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="coding-main">

        {/* HERO */}

        <section className="coding-hero">

          <span className="coding-eyebrow">
            PRACTICE ARENA
          </span>

          <h1>
            Coding Practice
          </h1>

          <p>
            Solve programming problems and improve your
            problem-solving skills.
          </p>

        </section>

        {/* =========================
            SEARCH
        ========================= */}

        <section className="coding-controls">

          <div className="coding-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          <div className="difficulty-buttons">

            {["All", "Easy", "Medium"].map(
              (level) => (
                <button
                  key={level}
                  className={
                    difficulty === level
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setDifficulty(level)
                  }
                >
                  {level}
                </button>
              )
            )}

          </div>

        </section>

        {/* =========================
            STATS
        ========================= */}

        <section className="coding-stats">

          <div className="coding-stat">
            <strong>
              {problems.length}
            </strong>

            <span>
              Problems
            </span>
          </div>

          <div className="coding-stat">
            <strong>
              {
                problems.filter(
                  (p) => p.difficulty === "Easy"
                ).length
              }
            </strong>

            <span>
              Easy
            </span>
          </div>

          <div className="coding-stat">
            <strong>
              {
                problems.filter(
                  (p) => p.difficulty === "Medium"
                ).length
              }
            </strong>

            <span>
              Medium
            </span>
          </div>

        </section>

        {/* =========================
            PROBLEMS
        ========================= */}

        <section className="problems-section">

          <div className="problems-heading">

            <div>
              <h2>
                Practice Problems
              </h2>

              <p>
                Select a problem and start coding.
              </p>
            </div>

            <span>
              {filteredProblems.length} Problems
            </span>

          </div>

          {filteredProblems.length === 0 ? (
            <div className="no-problems">
              <div>🔍</div>

              <h3>
                No problems found
              </h3>

              <p>
                Try a different search term.
              </p>
            </div>
          ) : (
            <div className="problem-grid">

              {filteredProblems.map(
                (problem, index) => (
                  <article
                    className="problem-card"
                    key={problem.id}
                  >

                    <div className="problem-number">
                      #{String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="problem-top">

                      <span
                        className={`difficulty ${problem.difficulty.toLowerCase()}`}
                      >
                        {problem.difficulty}
                      </span>

                      <span className="category">
                        {problem.category}
                      </span>

                    </div>

                    <h3>
                      {problem.title}
                    </h3>

                    <p>
                      {problem.description}
                    </p>

                    <button
                      className="solve-btn"
                      onClick={() =>
                        openProblem(problem)
                      }
                    >
                      Solve Problem →
                    </button>

                  </article>
                )
              )}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default CodingPractice;