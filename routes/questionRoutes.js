const express = require("express");
const mongoose = require("mongoose");
const Question = require("../models/Question");

const router = express.Router();

/* =====================================================
   GET ALL QUESTIONS
===================================================== */

router.get("/", async (req, res) => {
  try {
    const questions = await Question.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Get questions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
});

/* =====================================================
   GET ALL CODING QUESTIONS
===================================================== */

router.get("/coding", async (req, res) => {
  try {
    const questions = await Question.find({
      type: "Coding",
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Get coding questions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch coding questions",
    });
  }
});

/* =====================================================
   GET SINGLE QUESTION
===================================================== */

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID",
      });
    }

    const question = await Question.findById(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Get question error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch question",
    });
  }
});

/* =====================================================
   CREATE QUESTION
===================================================== */

router.post("/", async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      difficulty,
      marks,
      subject,
      options,
      correctAnswer,
      starterCode,
      testCases,
      createdBy,
    } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Question type is required",
      });
    }

    if (!["MCQ", "Coding"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question type",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question title is required",
      });
    }

    if (type === "Coding") {
      if (!description || !description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Coding problem description is required",
        });
      }

      if (
        !Array.isArray(testCases) ||
        testCases.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "At least one test case is required for coding questions",
        });
      }
    }

    const cleanedTestCases = Array.isArray(testCases)
      ? testCases
          .filter(
            (test) =>
              test &&
              String(test.expectedOutput ?? "").trim() !== ""
          )
          .map((test) => ({
            input: String(test.input ?? ""),
            expectedOutput: String(
              test.expectedOutput ?? ""
            ),
            hidden: Boolean(test.hidden),
          }))
      : [];

    const question = await Question.create({
      type,

      title: title.trim(),

      description:
        description?.trim() || "",

      difficulty:
        ["Easy", "Medium", "Hard"].includes(difficulty)
          ? difficulty
          : "Medium",

      marks:
        Number(marks) > 0
          ? Number(marks)
          : 5,

      subject:
        subject?.trim() || "Programming",

      options:
        Array.isArray(options)
          ? options
          : [],

      correctAnswer:
        correctAnswer || "",

      starterCode:
        starterCode || {},

      testCases:
        cleanedTestCases,

      createdBy:
        createdBy &&
        mongoose.Types.ObjectId.isValid(createdBy)
          ? createdBy
          : null,
    });

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    console.error("Create question error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create question",
      error: error.message,
    });
  }
});

/* =====================================================
   DELETE QUESTION
===================================================== */

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID",
      });
    }

    const question = await Question.findByIdAndDelete(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete question error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete question",
    });
  }
});

module.exports = router;