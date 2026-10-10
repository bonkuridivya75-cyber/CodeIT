import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
import "./BattleRoom.css";

const API_URL = "/api";

const SOCKET_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : window.location.origin;

const LANGUAGE_OPTIONS = [
  {
    value: "javascript",
    label: "JavaScript",
    monaco: "javascript",
  },
  {
    value: "python",
    label: "Python",
    monaco: "python",
  },
  {
    value: "java",
    label: "Java",
    monaco: "java",
  },
  {
    value: "cpp",
    label: "C++",
    monaco: "cpp",
  },
  {
    value: "c",
    label: "C",
    monaco: "c",
  },
  {
    value: "csharp",
    label: "C#",
    monaco: "csharp",
  },
  {
    value: "php",
    label: "PHP",
    monaco: "php",
  },
  {
    value: "kotlin",
    label: "Kotlin",
    monaco: "kotlin",
  },
];

const STARTER_CODE = {
  javascript: `function solution() {
  // Write your solution here

}

console.log(solution());`,

  python: `def solution():
    # Write your solution here
    pass

print(solution())`,

  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here

    return 0;
}`,

  c: `#include <stdio.h>

int main() {
    // Write your solution here

    return 0;
}`,

  csharp: `using System;

class Program {
    static void Main() {
        // Write your solution here
    }
}`,

  php: `<?php

// Write your solution here

?>`,

  kotlin: `fun main() {
    // Write your solution here
}`,
};

function getStoredUser() {
  return {
    userId: localStorage.getItem("user-id") || "",
    name: localStorage.getItem("user-name") || "Student",
    email: localStorage.getItem("user-email") || "",
    studentId: localStorage.getItem("student-id") || "",
  };
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds);

  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function getPlayerUserId(player) {
  if (!player) return "";

  if (typeof player.userId === "string") {
    return player.userId;
  }

  if (player.userId?._id) {
    return player.userId._id;
  }

  return "";
}

function getPlayerName(player) {
  if (!player) return "Waiting...";

  return (
    player.name ||
    player.userId?.name ||
    "Player"
  );
}

function getPlayerStatus(player) {
  if (!player) return "Waiting for opponent";

  if (player.submitted) {
    return "Solution submitted";
  }

  return "Coding...";
}

export default function BattleRoom() {
  const { battleId } = useParams();
  const navigate = useNavigate();

  const currentUser = useMemo(() => getStoredUser(), []);

  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(STARTER_CODE.javascript);

  const [output, setOutput] = useState(
    "Run your code to see the output here."
  );
  const [outputType, setOutputType] = useState("default");

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [socketConnected, setSocketConnected] = useState(false);

  const [opponentConnected, setOpponentConnected] = useState(false);

  /* =========================================================
     CURRENT PLAYER
  ========================================================= */

  const currentPlayer = useMemo(() => {
    if (!battle) return null;

    const currentId = String(currentUser.userId || "");

    if (
      battle.player1 &&
      String(getPlayerUserId(battle.player1)) === currentId
    ) {
      return battle.player1;
    }

    if (
      battle.player2 &&
      String(getPlayerUserId(battle.player2)) === currentId
    ) {
      return battle.player2;
    }

    return null;
  }, [battle, currentUser.userId]);

  /* =========================================================
     OPPONENT
  ========================================================= */

  const opponent = useMemo(() => {
    if (!battle) return null;

    const currentId = String(currentUser.userId || "");

    if (
      battle.player1 &&
      String(getPlayerUserId(battle.player1)) === currentId
    ) {
      return battle.player2;
    }

    if (
      battle.player2 &&
      String(getPlayerUserId(battle.player2)) === currentId
    ) {
      return battle.player1;
    }

    if (battle.player1?.name) {
      return battle.player2;
    }

    return battle.player1;
  }, [battle, currentUser.userId]);

  /* =========================================================
     LOAD BATTLE
  ========================================================= */

  const loadBattle = async () => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/battles/${encodeURIComponent(battleId)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load battle."
        );
      }

      const loadedBattle = data.battle || data;

      setBattle(loadedBattle);

      const hasOpponent =
        loadedBattle.player1?.name &&
        loadedBattle.player2?.name;

      setOpponentConnected(Boolean(hasOpponent));

      if (loadedBattle.startedAt) {
        const startedAt = new Date(
          loadedBattle.startedAt
        ).getTime();

        const elapsed = Math.floor(
          (Date.now() - startedAt) / 1000
        );

        const remaining = Math.max(
          30 * 60 - elapsed,
          0
        );

        setTimeLeft(remaining);
      } else {
        setTimeLeft(30 * 60);
      }
    } catch (err) {
      console.error("Load battle error:", err);
      setError(
        err.message || "Failed to load battle."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!battleId) {
      setError("Invalid battle ID.");
      setLoading(false);
      return;
    }

    loadBattle();
  }, [battleId]);

  /* =========================================================
     POLL BATTLE
  ========================================================= */

  useEffect(() => {
    if (!battleId) return;

    const interval = setInterval(() => {
      loadBattle();
    }, 5000);

    return () => clearInterval(interval);
  }, [battleId]);

  /* =========================================================
     SOCKET.IO
  ========================================================= */

  useEffect(() => {
    if (!battleId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setSocketConnected(true);

      socket.emit("join-battle", {
        battleId,
        userId: currentUser.userId,
        playerName: currentUser.name,
      });
    });

    socket.on("battle-room-joined", (data) => {
      if (data?.battle) {
        setBattle(data.battle);
      }
    });

    socket.on("player-joined", (data) => {
      setOpponentConnected(true);

      if (data?.battle) {
        setBattle(data.battle);
      } else {
        loadBattle();
      }
    });

    socket.on("battle-finished", (data) => {
      if (data?.battle) {
        setBattle(data.battle);
      }

      if (data?.winner) {
        setOutput(
          `Battle completed.\nWinner: ${data.winner}`
        );
        setOutputType("success");
      }
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    return () => {
      socket.emit("leave-battle", {
        battleId,
        userId: currentUser.userId,
      });

      socket.disconnect();
    };
  }, [battleId, currentUser.userId, currentUser.name]);

  /* =========================================================
     TIMER
  ========================================================= */

  useEffect(() => {
    if (!battle) return;

    if (battle.status === "Completed") {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [battle]);

  /* =========================================================
     AUTO SUBMIT WHEN TIME ENDS
  ========================================================= */

  useEffect(() => {
    if (timeLeft !== 0) return;
    if (!battle) return;
    if (submitting) return;
    if (battle.status === "Completed") return;

    submitSolution(true);
  }, [timeLeft]);

  /* =========================================================
     LANGUAGE CHANGE
  ========================================================= */

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    setLanguage(selectedLanguage);
    setCode(
      STARTER_CODE[selectedLanguage] ||
        "// Write your solution here"
    );

    setOutput("Run your code to see the output here.");
    setOutputType("default");
  };

  /* =========================================================
     RUN CODE
  ========================================================= */

  const runCode = async () => {
    if (!code.trim()) {
      setOutput("Please write some code first.");
      setOutputType("error");
      return;
    }

    try {
      setRunning(true);
      setOutput("Running your code...");
      setOutputType("default");

      const response = await fetch(`${API_URL}/code/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code,
          input: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Code execution failed."
        );
      }

      let result = "";

      if (data.output !== undefined) {
        result = data.output;
      } else if (data.stdout !== undefined) {
        result = data.stdout;
      } else if (data.compile_output) {
        result = data.compile_output;
      } else if (data.stderr) {
        result = data.stderr;
      } else {
        result = "Code executed successfully.";
      }

      setOutput(
        result || "Code executed successfully with no output."
      );

      if (
        data.stderr ||
        data.compile_output ||
        data.error
      ) {
        setOutputType("error");
      } else {
        setOutputType("success");
      }
    } catch (err) {
      console.error("Run code error:", err);

      setOutput(
        err.message || "Unable to execute code."
      );

      setOutputType("error");
    } finally {
      setRunning(false);
    }
  };

  /* =========================================================
     SUBMIT SOLUTION
  ========================================================= */

  const submitSolution = async (automatic = false) => {
    if (submitting) return;

    if (!currentUser.userId) {
      setOutput(
        "User information not found. Please login again."
      );
      setOutputType("error");
      return;
    }

    try {
      setSubmitting(true);

      setOutput(
        automatic
          ? "Time is over. Submitting your solution..."
          : "Submitting your solution..."
      );

      setOutputType("default");

      const executionTime =
        30 * 60 - Math.max(timeLeft, 0);

      const submitResponse = await fetch(
        `${API_URL}/battles/${encodeURIComponent(
          battleId
        )}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.userId,
            playerName: currentUser.name,
            language,
            code,
            executionTime,
          }),
        }
      );

      const submitData = await submitResponse.json();

      if (!submitResponse.ok) {
        throw new Error(
          submitData.message ||
            "Failed to submit solution."
        );
      }

      const passed =
        submitData.passedTestCases ??
        submitData.passed ??
        0;

      const total =
        submitData.totalTestCases ??
        submitData.total ??
        battle?.testCases?.length ??
        0;

      const status =
        submitData.status ||
        submitData.message ||
        "Submission completed.";

      setOutput(
        `Submission Result\n\nPassed Test Cases: ${passed}/${total}\nStatus: ${status}`
      );

      setOutputType(
        passed > 0 ? "success" : "error"
      );

      if (submitData.battle) {
        setBattle(submitData.battle);
      } else {
        await loadBattle();
      }
    } catch (err) {
      console.error("Submit solution error:", err);

      setOutput(
        err.message || "Unable to submit solution."
      );

      setOutputType("error");
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     BACK TO DASHBOARD
  ========================================================= */

  const goToDashboard = () => {
    navigate("/student-dashboard");
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="battle-loading">
        <div className="battle-loading-card">
          <div className="loading-spinner"></div>

          <h2>Loading Battle Room</h2>

          <p>
            Please wait while we connect you to the
            battle.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !battle) {
    return (
      <div className="battle-loading">
        <div className="battle-error-card">
          <div className="error-icon">!</div>

          <h2>Battle Room Error</h2>

          <p>
            {error || "Battle could not be found."}
          </p>

          <button onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const problemTitle =
    battle.problemTitle || "Coding Challenge";

  const problemDescription =
    battle.problemDescription ||
    "Solve the given coding problem within the allotted time.";

  const testCases = Array.isArray(battle.testCases)
    ? battle.testCases
    : [];

  const isDanger = timeLeft <= 5 * 60;

  const battleCompleted =
    battle.status === "Completed";

  const editorLanguage =
    LANGUAGE_OPTIONS.find(
      (item) => item.value === language
    ) || LANGUAGE_OPTIONS[0];

  return (
    <div className="battle-room">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="battle-header">
        <div className="battle-brand">
          <div className="battle-logo">
            &lt;/&gt;
          </div>

          <div>
            <div className="battle-brand-name">
              Code<span>IT</span>
            </div>

            <div className="battle-brand-subtitle">
              CODE BATTLE
            </div>
          </div>
        </div>

        <div className="battle-id-wrapper">
          <span>Battle ID</span>
          <strong>{battle.battleId}</strong>
        </div>

        <div className="battle-live-area">
          <span
            className={`connection-dot ${
              socketConnected ? "online" : ""
            }`}
          ></span>

          <span>
            {socketConnected
              ? "Connected"
              : "Connecting..."}
          </span>

          <div
            className={`battle-timer ${
              isDanger ? "danger" : ""
            }`}
          >
            <span className="timer-icon">◷</span>
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="battle-main">
        {/* PLAYERS */}

        <section className="battle-players">
          <div className="battle-player-card player-blue">
            <div className="player-avatar">
              {currentUser.name
                ? currentUser.name
                    .charAt(0)
                    .toUpperCase()
                : "Y"}
            </div>

            <div className="player-details">
              <span className="player-label">
                YOU
              </span>

              <h3>{currentUser.name}</h3>

              <p>
                <span className="status-dot"></span>
                {getPlayerStatus(currentPlayer)}
              </p>
            </div>
          </div>

          <div className="battle-vs">VS</div>

          <div className="battle-player-card player-purple">
            <div className="player-avatar">
              {opponent?.name
                ? opponent.name
                    .charAt(0)
                    .toUpperCase()
                : "?"}
            </div>

            <div className="player-details">
              <span className="player-label">
                OPPONENT
              </span>

              <h3>
                {getPlayerName(opponent)}
              </h3>

              <p
                className={
                  opponent ? "" : "waiting-status"
                }
              >
                <span className="status-dot"></span>
                {opponent
                  ? getPlayerStatus(opponent)
                  : "Waiting for opponent"}
              </p>
            </div>
          </div>
        </section>

        {/* WAITING */}

        {!opponentConnected &&
          !opponent?.name &&
          !battleCompleted && (
            <div className="waiting-banner">
              <div className="waiting-icon">
                ⏳
              </div>

              <div>
                <strong>
                  Waiting for opponent
                </strong>

                <p>
                  Share the Battle ID with your
                  opponent. The battle will begin when
                  they join.
                </p>
              </div>
            </div>
          )}

        {/* COMPLETED */}

        {battleCompleted && (
          <div className="battle-completed-banner">
            <div className="completed-icon">
              ✓
            </div>

            <div>
              <strong>Battle Completed</strong>

              <p>
                This battle has been completed.
                {battle.winner
                  ? ` Winner: ${battle.winner}`
                  : ""}
              </p>
            </div>
          </div>
        )}

        {/* PROBLEM */}

        <section className="problem-card">
          <div className="problem-top">
            <span className="problem-tag">
              CODING CHALLENGE
            </span>

            <span className="problem-difficulty">
              {battle.difficulty || "Programming"}
            </span>
          </div>

          <h1>{problemTitle}</h1>

          <p>{problemDescription}</p>

          {battle.input && (
            <div className="problem-extra">
              <h4>Input Format</h4>
              <pre>{battle.input}</pre>
            </div>
          )}

          {battle.output && (
            <div className="problem-extra">
              <h4>Output Format</h4>
              <pre>{battle.output}</pre>
            </div>
          )}
        </section>

        {/* TEST CASES */}

        <section className="testcases-card">
          <div className="section-heading">
            <div>
              <span className="section-small">
                TESTING
              </span>

              <h2>Test Cases</h2>
            </div>

            <span className="test-count">
              {testCases.length} Test
              {testCases.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          {testCases.length > 0 ? (
            <div className="testcases-grid">
              {testCases.map(
                (testCase, index) => (
                  <div
                    className="testcase-card"
                    key={index}
                  >
                    <div className="testcase-header">
                      Test Case {index + 1}
                    </div>

                    <div className="testcase-block">
                      <span>INPUT</span>

                      <pre>
                        {testCase.input || "—"}
                      </pre>
                    </div>

                    <div className="testcase-block">
                      <span>
                        EXPECTED OUTPUT
                      </span>

                      <pre>
                        {testCase.expectedOutput ||
                          "—"}
                      </pre>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="no-tests">
              No test cases available.
            </div>
          )}
        </section>

        {/* EDITOR */}

        <section className="editor-card">
          <div className="editor-toolbar">
            <div className="editor-language">
              <span className="editor-dot"></span>

              <select
                value={language}
                onChange={handleLanguageChange}
                disabled={
                  running ||
                  submitting ||
                  battleCompleted
                }
              >
                {LANGUAGE_OPTIONS.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="editor-toolbar-right">
              <span className="editor-file-name">
                main
              </span>

              <button
                className="run-button"
                onClick={runCode}
                disabled={
                  running ||
                  submitting ||
                  battleCompleted
                }
              >
                {running ? (
                  <>
                    <span className="button-spinner"></span>
                    Running...
                  </>
                ) : (
                  <>
                    <span>▶</span>
                    Run Code
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="editor-wrapper">
            <Editor
              height="520px"
              language={editorLanguage.monaco}
              value={code}
              onChange={(value) =>
                setCode(value || "")
              }
              theme="vs-dark"
              options={{
                minimap: {
                  enabled: true,
                },
                fontSize: 14,
                lineHeight: 22,
                padding: {
                  top: 16,
                },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                tabSize: 4,
                insertSpaces: true,
                readOnly:
                  battleCompleted ||
                  submitting,
              }}
            />
          </div>
        </section>

        {/* OUTPUT */}

        <section className="output-card">
          <div className="output-header">
            <div>
              <span className="section-small">
                EXECUTION
              </span>

              <h2>Output</h2>
            </div>

            <span
              className={`output-status ${
                outputType
              }`}
            >
              {outputType === "success"
                ? "Success"
                : outputType === "error"
                ? "Error"
                : "Ready"}
            </span>
          </div>

          <pre className="output-box">
            {output}
          </pre>
        </section>

        {/* SUBMIT */}

        <section className="battle-submit-section">
          <button
            className="back-button"
            onClick={goToDashboard}
            disabled={submitting}
          >
            ← Dashboard
          </button>

          <button
            className="submit-button"
            onClick={() =>
              submitSolution(false)
            }
            disabled={
              submitting ||
              battleCompleted ||
              timeLeft <= 0
            }
          >
            {submitting ? (
              <>
                <span className="button-spinner"></span>
                Submitting...
              </>
            ) : battleCompleted ? (
              "Battle Completed"
            ) : (
              <>
                ✓ Submit Solution
              </>
            )}
          </button>
        </section>
      </main>
    </div>
  );
}