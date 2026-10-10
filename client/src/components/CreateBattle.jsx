import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateBattle.css";

const API_URL = "/api";

function CreateBattle() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  // =========================================================
  // CURRENT USER
  // =========================================================

  const currentUser = useMemo(() => {
    let user = {};

    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        user = JSON.parse(savedUser);
      }
    } catch (error) {
      console.log("User JSON not available");
    }

    return {
      userId:
        user?._id ||
        user?.id ||
        localStorage.getItem("user-id") ||
        null,

      playerName:
        user?.name ||
        localStorage.getItem("user-name") ||
        "Student",
    };
  }, []);

  // =========================================================
  // NORMALIZE QUESTIONS
  // Supports different backend response formats
  // =========================================================

  const normalizeQuestion = (question, index) => {
    const rawId =
      question?.problemId ??
      question?.questionId ??
      question?.id ??
      question?._id ??
      index + 1;

    const numericId = Number(rawId);

    return {
      ...question,

      problemId:
        Number.isFinite(numericId) && numericId > 0
          ? numericId
          : index + 1,

      questionId: question?.questionId || question?._id || index + 1,

      title:
        question?.title ||
        question?.name ||
        question?.questionTitle ||
        `Coding Question ${index + 1}`,

      description:
        question?.description ||
        question?.problemDescription ||
        question?.question ||
        "Solve this coding problem.",

      difficulty:
        question?.difficulty ||
        question?.level ||
        "Easy",

      testCases:
        Array.isArray(question?.testCases)
          ? question.testCases
          : Array.isArray(question?.sampleTestCases)
          ? question.sampleTestCases
          : [],

      language:
        question?.language ||
        question?.supportedLanguage ||
        "JavaScript",
    };
  };

  // =========================================================
  // LOAD ALL FACULTY CODING QUESTIONS
  // =========================================================

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoadingQuestions(true);
      setError("");

      const possibleEndpoints = [
        `${API_URL}/questions/coding`,
        `${API_URL}/questions`,
      ];

      let finalQuestions = [];

      for (const endpoint of possibleEndpoints) {
        try {
          const response = await fetch(endpoint);

          if (!response.ok) {
            continue;
          }

          const data = await response.json();

          const received =
            Array.isArray(data)
              ? data
              : Array.isArray(data.questions)
              ? data.questions
              : Array.isArray(data.data)
              ? data.data
              : Array.isArray(data.codingQuestions)
              ? data.codingQuestions
              : Array.isArray(data.results)
              ? data.results
              : [];

          if (received.length > 0) {
            finalQuestions = received;
            break;
          }
        } catch (endpointError) {
          console.log(
            `Question endpoint failed: ${endpoint}`,
            endpointError
          );
        }
      }

      const normalized = finalQuestions
        .map(normalizeQuestion)
        .filter((question) => {
          const type = String(
            question.type ||
              question.questionType ||
              question.category ||
              "coding"
          ).toLowerCase();

          return (
            type.includes("coding") ||
            type.includes("program") ||
            !question.type
          );
        });

      // Remove duplicate questions
      const uniqueQuestions = normalized.filter(
        (question, index, array) =>
          index ===
          array.findIndex(
            (item) =>
              String(item.title).toLowerCase() ===
              String(question.title).toLowerCase()
          )
      );

      setQuestions(uniqueQuestions);

      if (uniqueQuestions.length === 0) {
        setError(
          "No coding questions found. Please create coding questions from Faculty Questions."
        );
      }
    } catch (error) {
      console.error("Load questions error:", error);

      setError(
        "Unable to load coding questions. Please check the backend."
      );
    } finally {
      setLoadingQuestions(false);
    }
  };

  // =========================================================
  // FILTER QUESTIONS
  // =========================================================

  const filteredQuestions = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesSearch =
        !searchText ||
        String(question.title)
          .toLowerCase()
          .includes(searchText) ||
        String(question.description)
          .toLowerCase()
          .includes(searchText);

      const matchesDifficulty =
        difficulty === "All" ||
        String(question.difficulty).toLowerCase() ===
          difficulty.toLowerCase();

      return matchesSearch && matchesDifficulty;
    });
  }, [questions, search, difficulty]);

  // =========================================================
  // SELECT QUESTION
  // =========================================================

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    setError("");
  };

  // =========================================================
  // CREATE BATTLE
  // =========================================================

  const handleCreateBattle = async () => {
    if (!selectedQuestion) {
      setError("Please select a coding question first.");
      return;
    }

    if (!selectedQuestion.testCases?.length) {
      setError(
        "This coding question does not have test cases."
      );
      return;
    }

    try {
      setCreating(true);
      setError("");

      const cleanTestCases =
        selectedQuestion.testCases.map((testCase) => ({
          input:
            testCase?.input ??
            testCase?.stdin ??
            "",

          expectedOutput:
            testCase?.expectedOutput ??
            testCase?.output ??
            testCase?.expected ??
            "",

          hidden:
            Boolean(testCase?.hidden),
        }));

      const response = await fetch(`${API_URL}/battles`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          problemId: selectedQuestion.problemId,

          problemTitle: selectedQuestion.title,

          problemDescription:
            selectedQuestion.description,

          testCases: cleanTestCases,

          userId: currentUser.userId,

          playerName: currentUser.playerName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create battle."
        );
      }

      const battle =
        data.battle ||
        data.data?.battle ||
        data;

      const battleId =
        battle?.battleId ||
        data?.battleId;

      if (!battleId) {
        throw new Error(
          "Battle was created but Battle ID was not returned."
        );
      }

      // Save Battle ID
      localStorage.setItem(
        "current-battle-id",
        String(battleId)
      );

      // Go directly to battle room
      navigate(`/battle/${battleId}`);
    } catch (error) {
      console.error(
        "Create battle error:",
        error
      );

      setError(
        error.message ||
          "Unable to create battle."
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================================================
  // DIFFICULTY COLOR
  // =========================================================

  const getDifficultyClass = (value) => {
    const difficultyValue =
      String(value || "Easy").toLowerCase();

    if (difficultyValue === "hard") {
      return "difficulty-hard";
    }

    if (difficultyValue === "medium") {
      return "difficulty-medium";
    }

    return "difficulty-easy";
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="battle-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="battle-header">

        <div
          className="battle-brand"
          onClick={() =>
            navigate("/student-dashboard")
          }
        >
          <div className="battle-logo">
            &lt;/&gt;
          </div>

          <div className="battle-brand-text">
            <h1>
              CODE<span>IT</span>
            </h1>

            <p>Battle Arena</p>
          </div>
        </div>

        <div className="battle-header-actions">

          <button
            type="button"
            className="join-battle-header-btn"
            onClick={() =>
              navigate("/join-battle")
            }
          >
            ⚔️ Join Battle
          </button>

          <button
            type="button"
            className="dashboard-btn"
            onClick={() =>
              navigate("/student-dashboard")
            }
          >
            ← Dashboard
          </button>

        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="battle-content">

        {/* PAGE TITLE */}

        <section className="battle-title-section">

          <div>
            <div className="section-label">
              CODING CHALLENGES
            </div>

            <h2>Select Coding Problem</h2>

            <p>
              Choose a coding problem and challenge
              another student.
            </p>
          </div>

          <div className="question-count">
            {questions.length}
          </div>

        </section>

        {/* ===================================================
            SEARCH / FILTER
        ==================================================== */}

        <section className="question-tools">

          <div className="search-wrapper">

            <span>🔎</span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search coding questions..."
            />

          </div>

          <div className="difficulty-filters">

            {["All", "Easy", "Medium", "Hard"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    difficulty === item
                      ? "filter-btn active"
                      : "filter-btn"
                  }
                  onClick={() =>
                    setDifficulty(item)
                  }
                >
                  {item}
                </button>
              )
            )}

          </div>

        </section>

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="battle-error">
            <span>!</span>
            <div>
              <strong>Unable to continue</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* ===================================================
            LOADING
        ==================================================== */}

        {loadingQuestions ? (
          <section className="question-loading">

            <div className="loading-spinner"></div>

            <h3>Loading coding questions...</h3>

            <p>
              Fetching faculty-created coding
              questions.
            </p>

          </section>
        ) : (
          <>
            {/* =================================================
                QUESTIONS
            ================================================== */}

            {filteredQuestions.length > 0 ? (
              <section className="questions-grid">

                {filteredQuestions.map(
                  (question, index) => {

                    const isSelected =
                      selectedQuestion &&
                      (
                        String(
                          selectedQuestion.questionId
                        ) ===
                        String(
                          question.questionId
                        ) ||
                        String(
                          selectedQuestion.title
                        ) ===
                        String(question.title)
                      );

                    return (
                      <button
                        type="button"
                        key={`${question.questionId}-${index}`}
                        className={
                          isSelected
                            ? "question-card selected"
                            : "question-card"
                        }
                        onClick={() =>
                          handleSelectQuestion(
                            question
                          )
                        }
                      >

                        <div className="question-card-top">

                          <span className="question-number">
                            #{index + 1}
                          </span>

                          <span
                            className={`difficulty-badge ${getDifficultyClass(
                              question.difficulty
                            )}`}
                          >
                            {String(
                              question.difficulty ||
                                "Easy"
                            ).toUpperCase()}
                          </span>

                        </div>

                        <div className="coding-label">
                          💻 CODING
                        </div>

                        <h3>
                          {question.title}
                        </h3>

                        <p>
                          {question.description}
                        </p>

                        <div className="question-card-footer">

                          <span>
                            🧪{" "}
                            {
                              question.testCases
                                ?.length
                            }{" "}
                            Tests
                          </span>

                          {isSelected && (
                            <span className="selected-mark">
                              ✓ Selected
                            </span>
                          )}

                        </div>

                      </button>
                    );
                  }
                )}

              </section>
            ) : (
              <section className="no-questions">

                <div>🔍</div>

                <h3>No coding questions found</h3>

                <p>
                  Try another search or difficulty
                  filter.
                </p>

              </section>
            )}
          </>
        )}

        {/* ===================================================
            SELECTED QUESTION PREVIEW
        ==================================================== */}

        {selectedQuestion && (
          <section className="selected-preview">

            <div className="selected-preview-header">

              <div>
                <span>
                  SELECTED QUESTION
                </span>

                <h3>
                  {selectedQuestion.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedQuestion(null)
                }
              >
                ✕
              </button>

            </div>

            <p>
              {selectedQuestion.description}
            </p>

            <div className="preview-info">

              <span>
                Difficulty:{" "}
                <strong>
                  {selectedQuestion.difficulty}
                </strong>
              </span>

              <span>
                Tests:{" "}
                <strong>
                  {selectedQuestion.testCases?.length ||
                    0}
                </strong>
              </span>

            </div>

          </section>
        )}

      </main>

      {/* =====================================================
          BOTTOM ACTIONS
      ====================================================== */}

      <div className="battle-bottom-actions">

        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate("/student-dashboard")
          }
        >
          ← Back
        </button>

        <div className="battle-action-group">

          <button
            type="button"
            className="join-battle-btn"
            onClick={() =>
              navigate("/join-battle")
            }
          >
            ⚔️ Join Battle
          </button>

          <button
            type="button"
            className="create-battle-btn"
            onClick={handleCreateBattle}
            disabled={
              !selectedQuestion ||
              creating
            }
          >
            {creating
              ? "Creating Battle..."
              : "⚔️ Create Battle"}
          </button>

        </div>

      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="battle-footer">
        <span className="footer-dot"></span>
        CodeIT Battle Arena
        <span className="footer-separator">
          •
        </span>
        Secure live coding environment
      </footer>

    </div>
  );
}

export default CreateBattle;