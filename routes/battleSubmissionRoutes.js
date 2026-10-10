const express = require("express");

const Battle = require("../models/Battle");
const BattleSubmission =
  require("../models/BattleSubmission");

const router = express.Router();


// =========================================================
// JUDGE0
// =========================================================

const JUDGE0_URL =
  process.env.JUDGE0_URL ||
  "https://ce.judge0.com";

const JUDGE0_API_KEY =
  process.env.JUDGE0_API_KEY ||
  "";

const JUDGE0_HOST =
  process.env.JUDGE0_HOST ||
  "judge0-ce.p.rapidapi.com";


// =========================================================
// LANGUAGE IDS
// =========================================================

const LANGUAGE_IDS = {
  javascript: 63,
  js: 63,

  python: 71,
  python3: 71,

  java: 62,

  c: 50,

  cpp: 54,
  "c++": 54,
};


// =========================================================
// LANGUAGE
// =========================================================

function getLanguageId(language) {
  return (
    LANGUAGE_IDS[
      String(language || "")
        .trim()
        .toLowerCase()
    ] || null
  );
}


// =========================================================
// NORMALIZE OUTPUT
// =========================================================

function normalizeOutput(value) {
  return String(
    value ?? ""
  )
    .replace(/\r\n/g, "\n")
    .trim();
}


// =========================================================
// JUDGE0 HEADERS
// =========================================================

function judgeHeaders() {
  const headers = {
    "Content-Type":
      "application/json",
  };

  if (JUDGE0_API_KEY) {
    headers[
      "X-RapidAPI-Key"
    ] = JUDGE0_API_KEY;

    headers[
      "X-RapidAPI-Host"
    ] = JUDGE0_HOST;
  }

  return headers;
}


// =========================================================
// SUBMIT TO JUDGE0
// =========================================================

async function createJudgeSubmission({
  code,
  languageId,
  input,
}) {
  const response =
    await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
      {
        method: "POST",

        headers:
          judgeHeaders(),

        body: JSON.stringify({
          source_code:
            code,

          language_id:
            languageId,

          stdin:
            input || "",

          cpu_time_limit: 5,

          wall_time_limit: 10,
        }),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `Judge0 error ${response.status}`
    );
  }

  if (!data.token) {
    throw new Error(
      "Judge0 did not return a token."
    );
  }

  return data.token;
}


// =========================================================
// GET RESULT
// =========================================================

async function getJudgeResult(
  token
) {
  const response =
    await fetch(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
      {
        method: "GET",

        headers:
          judgeHeaders(),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        "Unable to get Judge0 result."
    );
  }

  return data;
}


// =========================================================
// WAIT FOR RESULT
// =========================================================

async function waitForResult(
  token
) {
  for (
    let attempt = 0;
    attempt < 30;
    attempt++
  ) {
    const result =
      await getJudgeResult(
        token
      );

    const statusId =
      result.status?.id;

    // 1 = queue
    // 2 = processing
    // 3+ = completed

    if (
      statusId &&
      statusId >= 3
    ) {
      return result;
    }

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          700
        )
    );
  }

  throw new Error(
    "Code execution timed out."
  );
}


// =========================================================
// RUN ONE TEST CASE
// =========================================================

async function runTestCase({
  code,
  languageId,
  input,
  expectedOutput,
}) {
  const token =
    await createJudgeSubmission({
      code,
      languageId,
      input,
    });

  const result =
    await waitForResult(
      token
    );

  const statusId =
    result.status?.id;

  const actual =
    normalizeOutput(
      result.stdout
    );

  const expected =
    normalizeOutput(
      expectedOutput
    );

  // Compilation Error
  if (statusId === 6) {
    return {
      passed: false,

      status:
        "Compilation Error",

      executionTime:
        Number(result.time || 0),
    };
  }

  // Time Limit
  if (statusId === 5) {
    return {
      passed: false,

      status:
        "Runtime Error",

      executionTime:
        Number(result.time || 0),
    };
  }

  // Runtime Error
  if (
    statusId >= 7
  ) {
    return {
      passed: false,

      status:
        "Runtime Error",

      executionTime:
        Number(result.time || 0),
    };
  }

  const passed =
    actual === expected;

  return {
    passed,

    status: passed
      ? "Accepted"
      : "Wrong Answer",

    executionTime:
      Number(result.time || 0),
  };
}


// =========================================================
// FIND PLAYER
// =========================================================

function findPlayer(
  battle,
  userId,
  playerName
) {
  if (
    userId &&
    battle.player1?.userId &&
    String(
      battle.player1.userId
    ) === String(userId)
  ) {
    return "player1";
  }

  if (
    userId &&
    battle.player2?.userId &&
    String(
      battle.player2.userId
    ) === String(userId)
  ) {
    return "player2";
  }

  const name =
    String(
      playerName || ""
    )
      .trim()
      .toLowerCase();

  if (
    name &&
    String(
      battle.player1?.name ||
        ""
    )
      .trim()
      .toLowerCase() ===
      name
  ) {
    return "player1";
  }

  if (
    name &&
    String(
      battle.player2?.name ||
        ""
    )
      .trim()
      .toLowerCase() ===
      name
  ) {
    return "player2";
  }

  return null;
}


// =========================================================
// WINNER
// =========================================================

function calculateWinner(
  battle
) {
  const p1 =
    battle.player1;

  const p2 =
    battle.player2;

  const p1Score =
    Number(
      p1.passedTestCases || 0
    );

  const p2Score =
    Number(
      p2.passedTestCases || 0
    );

  if (
    p1Score >
    p2Score
  ) {
    return "Player 1";
  }

  if (
    p2Score >
    p1Score
  ) {
    return "Player 2";
  }

  const p1Time =
    Number(
      p1.submissionTime ??
        Number.MAX_SAFE_INTEGER
    );

  const p2Time =
    Number(
      p2.submissionTime ??
        Number.MAX_SAFE_INTEGER
    );

  if (
    p1Time <
    p2Time
  ) {
    return "Player 1";
  }

  if (
    p2Time <
    p1Time
  ) {
    return "Player 2";
  }

  return "Draw";
}


// =========================================================
// SUBMIT
// POST /api/battles/:battleId/submit
// =========================================================

router.post(
  "/:battleId/submit",
  async (req, res) => {
    try {
      const battleId =
        String(
          req.params.battleId
        )
          .trim()
          .toUpperCase();

      const {
        userId,
        playerName,
        language,
        code,
      } = req.body;

      if (!language) {
        return res.status(400).json({
          success: false,
          message:
            "Programming language is required.",
        });
      }

      if (
        !code ||
        !String(code).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Code is required.",
        });
      }

      const languageId =
        getLanguageId(
          language
        );

      if (!languageId) {
        return res.status(400).json({
          success: false,
          message:
            `Unsupported language: ${language}`,
        });
      }

      const battle =
        await Battle.findOne({
          battleId,
        });

      if (!battle) {
        return res.status(404).json({
          success: false,
          message:
            "Battle not found.",
        });
      }

      if (
        battle.status !== "Active"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Battle is not active.",
        });
      }

      const playerKey =
        findPlayer(
          battle,
          userId,
          playerName
        );

      if (!playerKey) {
        return res.status(403).json({
          success: false,
          message:
            "You are not a participant in this battle.",
        });
      }

      const player =
        battle[playerKey];

      if (player.submitted) {
        return res.status(400).json({
          success: false,
          message:
            "You have already submitted.",
        });
      }

      const testCases =
        battle.testCases || [];

      if (
        testCases.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No test cases are available.",
        });
      }

      // ===================================================
      // JUDGE ALL TEST CASES
      // ===================================================

      let passed = 0;

      let finalStatus =
        "Accepted";

      let totalExecutionTime =
        0;

      const testResults = [];

      for (
        let i = 0;
        i < testCases.length;
        i++
      ) {
        const testCase =
          testCases[i];

        const result =
          await runTestCase({
            code:
              String(code),

            languageId,

            input:
              testCase.input,

            expectedOutput:
              testCase.expectedOutput,
          });

        if (result.passed) {
          passed++;
        }

        if (
          result.status ===
          "Compilation Error"
        ) {
          finalStatus =
            "Compilation Error";
        } else if (
          result.status ===
          "Runtime Error" &&
          finalStatus !==
            "Compilation Error"
        ) {
          finalStatus =
            "Runtime Error";
        } else if (
          !result.passed &&
          finalStatus ===
            "Accepted"
        ) {
          finalStatus =
            "Wrong Answer";
        }

        totalExecutionTime +=
          Number(
            result.executionTime ||
              0
          );

        // Only return safe information
        testResults.push({
          testCase:
            i + 1,

          passed:
            result.passed,

          status:
            result.status,

          executionTime:
            result.executionTime,
        });
      }

      // ===================================================
      // SERVER-SIDE SUBMISSION TIME
      // ===================================================

      const now =
        new Date();

      const startTime =
        battle.startedAt ||
        battle.createdAt ||
        now;

      const submissionTime =
        Math.max(
          0,
          now.getTime() -
            new Date(
              startTime
            ).getTime()
        );

      // ===================================================
      // SAVE SUBMISSION
      // ===================================================

      const submission =
        await BattleSubmission.create({
          battleId,

          userId:
            player.userId ||
            null,

          playerName:
            player.name ||
            playerName ||
            "Student",

          language:
            String(language),

          code:
            String(code),

          passedTestCases:
            passed,

          totalTestCases:
            testCases.length,

          executionTime:
            submissionTime,

          status:
            finalStatus,

          submittedAt:
            now,
        });

      // ===================================================
      // UPDATE PLAYER
      // ===================================================

      player.submitted =
        true;

      player.passedTestCases =
        passed;

      player.totalTestCases =
        testCases.length;

      player.submissionTime =
        submissionTime;

      let battleCompleted =
        false;

      let winner = null;

      // ===================================================
      // BOTH SUBMITTED
      // ===================================================

      if (
        battle.player1.submitted &&
        battle.player2.submitted
      ) {
        winner =
          calculateWinner(
            battle
          );

        battle.winner =
          winner;

        battle.status =
          "Completed";

        battle.completedAt =
          now;

        battleCompleted =
          true;
      }

      await battle.save();

      // ===================================================
      // SOCKET.IO
      // ===================================================

      const io =
        req.app.get("io");

      if (io) {
        io.to(battleId).emit(
          "opponent-submitted",
          {
            battleId,

            playerName:
              player.name ||
              playerName ||
              "Opponent",

            passedTestCases:
              passed,

            totalTestCases:
              testCases.length,

            status:
              finalStatus,

            submittedAt:
              now,
          }
        );

        if (battleCompleted) {
          io.to(battleId).emit(
            "battle-finished",
            {
              battleId,

              winner,

              player1: {
                name:
                  battle.player1.name,

                passedTestCases:
                  battle.player1
                    .passedTestCases,

                totalTestCases:
                  battle.player1
                    .totalTestCases,

                submissionTime:
                  battle.player1
                    .submissionTime,
              },

              player2: {
                name:
                  battle.player2.name,

                passedTestCases:
                  battle.player2
                    .passedTestCases,

                totalTestCases:
                  battle.player2
                    .totalTestCases,

                submissionTime:
                  battle.player2
                    .submissionTime,
              },

              completedAt:
                battle.completedAt,
            }
          );
        }
      }

      return res.status(201).json({
        success: true,

        message:
          battleCompleted
            ? "Battle completed."
            : "Code judged successfully.",

        submission: {
          id:
            submission._id,

          status:
            finalStatus,

          passedTestCases:
            passed,

          totalTestCases:
            testCases.length,

          executionTime:
            submissionTime,

          testResults,
        },

        battle: {
          battleId,

          status:
            battle.status,

          winner:
            battle.winner,

          completed:
            battleCompleted,
        },
      });
    } catch (error) {
      console.error(
        "Battle judge error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to judge submission.",

        error:
          error.message,
      });
    }
  }
);


// =========================================================
// GET BATTLE SUBMISSIONS
// GET /api/battles/:battleId/submissions
// =========================================================

router.get(
  "/:battleId/submissions",
  async (req, res) => {
    try {
      const battleId =
        String(
          req.params.battleId
        )
          .trim()
          .toUpperCase();

      const submissions =
        await BattleSubmission.find({
          battleId,
        })
          .select(
            "-code"
          )
          .sort({
            submittedAt: 1,
          });

      return res.json({
        success: true,

        submissions,
      });
    } catch (error) {
      console.error(
        "Get submissions error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to get submissions.",
        error: error.message,
      });
    }
  }
);


module.exports = router;