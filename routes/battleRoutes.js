const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");

const Battle = require("../models/Battle");

const router = express.Router();

/* =========================================================
   GENERATE BATTLE ID
========================================================= */

function generateBattleId() {
  return crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase();
}

/* =========================================================
   SANITIZE TEST CASES
========================================================= */

function sanitizeTestCases(testCases) {
  if (!Array.isArray(testCases)) {
    return [];
  }

  return testCases
    .filter(Boolean)
    .map((testCase) => ({
      input:
        testCase.input !== undefined &&
        testCase.input !== null
          ? String(testCase.input)
          : "",

      expectedOutput:
        testCase.expectedOutput !== undefined &&
        testCase.expectedOutput !== null
          ? String(testCase.expectedOutput)
          : "",

      hidden: Boolean(testCase.hidden),
    }));
}

/* =========================================================
   CREATE BATTLE
   POST /api/battles
========================================================= */

router.post("/", async (req, res) => {
  try {
    console.log(
      "===================================="
    );

    console.log(
      "⚔️ CREATE BATTLE REQUEST"
    );

    console.log(
      "Body:",
      req.body
    );

    console.log(
      "===================================="
    );

    const {
      problemId,
      problemTitle,
      problemDescription,
      testCases,
      userId,
      playerName,
    } = req.body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (
      problemId === undefined ||
      problemId === null ||
      problemId === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Problem ID is required.",
      });
    }

    if (!problemTitle) {
      return res.status(400).json({
        success: false,
        message: "Problem title is required.",
      });
    }

    /* =====================================================
       TEST CASES
    ===================================================== */

    const safeTestCases =
      sanitizeTestCases(testCases);

    if (safeTestCases.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "At least one test case is required.",
      });
    }

    const invalidTestCase =
      safeTestCases.some(
        (testCase) =>
          testCase.expectedOutput.trim() === ""
      );

    if (invalidTestCase) {
      return res.status(400).json({
        success: false,
        message:
          "Every test case must have expected output.",
      });
    }

    /* =====================================================
       GENERATE UNIQUE BATTLE ID
    ===================================================== */

    let battleId;
    let exists = true;

    while (exists) {
      battleId =
        generateBattleId();

      exists =
        await Battle.exists({
          battleId,
        });
    }

    /* =====================================================
       USER ID
    ===================================================== */

    let validUserId = null;

    if (
      userId &&
      mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      validUserId = userId;
    }

    /* =====================================================
       PLAYER NAME
    ===================================================== */

    const safePlayerName =
      typeof playerName === "string" &&
      playerName.trim()
        ? playerName.trim()
        : "Player 1";

    /* =====================================================
       CREATE BATTLE
    ===================================================== */

    const battle =
      await Battle.create({
        battleId,

        problemId:
          Number(problemId),

        problemTitle:
          String(problemTitle).trim(),

        problemDescription:
          problemDescription
            ? String(
                problemDescription
              ).trim()
            : "",

        testCases:
          safeTestCases,

        status:
          "Waiting",

        player1: {
          userId:
            validUserId,

          name:
            safePlayerName,

          joinedAt:
            new Date(),

          submitted:
            false,

          passedTestCases:
            0,

          totalTestCases:
            safeTestCases.length,

          submissionTime:
            null,
        },

        player2: {
          userId:
            null,

          name:
            "Player 2",

          joinedAt:
            null,

          submitted:
            false,

          passedTestCases:
            0,

          totalTestCases:
            safeTestCases.length,

          submissionTime:
            null,
        },

        winner:
          null,

        startedAt:
          null,

        completedAt:
          null,
      });

    console.log(
      "✅ Battle created:",
      battle.battleId
    );

    /* =====================================================
       HIDE HIDDEN TEST CASES
    ===================================================== */

    const responseBattle =
      battle.toObject();

    const visibleTestCases =
      safeTestCases
        .filter(
          (testCase) =>
            !testCase.hidden
        )
        .map(
          (testCase) => ({
            input:
              testCase.input,

            expectedOutput:
              testCase.expectedOutput,

            hidden:
              false,
          })
        );

    const hiddenTestCaseCount =
      safeTestCases.filter(
        (testCase) =>
          testCase.hidden
      ).length;

    responseBattle.testCases =
      visibleTestCases;

    responseBattle.hiddenTestCaseCount =
      hiddenTestCaseCount;

    /* =====================================================
       SUCCESS
    ===================================================== */

    return res.status(201).json({
      success: true,

      message:
        "Battle created successfully.",

      battle:
        responseBattle,
    });
  } catch (error) {
    console.error(
      "===================================="
    );

    console.error(
      "❌ CREATE BATTLE ERROR"
    );

    console.error(
      error
    );

    console.error(
      "===================================="
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create battle.",

      error:
        error.message,

      errorName:
        error.name,
    });
  }
});

/* =========================================================
   GET BATTLE
   GET /api/battles/:battleId
========================================================= */

router.get(
  "/:battleId",
  async (req, res) => {
    try {
      const battleId =
        String(
          req.params.battleId
        )
          .trim()
          .toUpperCase();

      const battle =
        await Battle.findOne({
          battleId,
        })
          .populate(
            "player1.userId",
            "name email"
          )
          .populate(
            "player2.userId",
            "name email"
          );

      if (!battle) {
        return res.status(404).json({
          success: false,
          message:
            "Battle not found.",
        });
      }

      const battleData =
        battle.toObject();

      const allTestCases =
        Array.isArray(
          battleData.testCases
        )
          ? battleData.testCases
          : [];

      const visibleTestCases =
        allTestCases
          .filter(
            (testCase) =>
              !testCase.hidden
          )
          .map(
            (testCase) => ({
              input:
                testCase.input || "",

              expectedOutput:
                testCase.expectedOutput ||
                "",

              hidden:
                false,
            })
          );

      const hiddenTestCaseCount =
        allTestCases.filter(
          (testCase) =>
            testCase.hidden
        ).length;

      battleData.testCases =
        visibleTestCases;

      battleData.hiddenTestCaseCount =
        hiddenTestCaseCount;

      return res.status(200).json({
        success: true,

        battle:
          battleData,
      });
    } catch (error) {
      console.error(
        "Get battle error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to get battle.",

        error:
          error.message,
      });
    }
  }
);

/* =========================================================
   JOIN BATTLE
   POST /api/battles/:battleId/join
========================================================= */

router.post(
  "/:battleId/join",
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
      } = req.body;

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
        battle.status !==
        "Waiting"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "This battle is no longer available.",
        });
      }

      if (
        battle.player2 &&
        battle.player2.joinedAt
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Battle is already full.",
        });
      }

      let validUserId = null;

      if (
        userId &&
        mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        validUserId =
          userId;
      }

      const safePlayerName =
        typeof playerName ===
          "string" &&
        playerName.trim()
          ? playerName.trim()
          : "Player 2";

      battle.player2 = {
        userId:
          validUserId,

        name:
          safePlayerName,

        joinedAt:
          new Date(),

        submitted:
          false,

        passedTestCases:
          0,

        totalTestCases:
          battle.testCases.length,

        submissionTime:
          null,
      };

      battle.status =
        "Active";

      battle.startedAt =
        new Date();

      await battle.save();

      const responseBattle =
        battle.toObject();

      responseBattle.testCases =
        responseBattle.testCases
          .filter(
            (testCase) =>
              !testCase.hidden
          )
          .map(
            (testCase) => ({
              input:
                testCase.input,

              expectedOutput:
                testCase.expectedOutput,

              hidden:
                false,
            })
          );

      return res.status(200).json({
        success: true,

        message:
          "Joined battle successfully.",

        battle:
          responseBattle,
      });
    } catch (error) {
      console.error(
        "Join battle error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to join battle.",

        error:
          error.message,
      });
    }
  }
);

/* =========================================================
   DELETE BATTLE
========================================================= */

router.delete(
  "/:battleId",
  async (req, res) => {
    try {
      const battleId =
        String(
          req.params.battleId
        )
          .trim()
          .toUpperCase();

      const deleted =
        await Battle.findOneAndDelete({
          battleId,
        });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message:
            "Battle not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Battle deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete battle error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete battle.",
        error:
          error.message,
      });
    }
  }
);

module.exports = router;