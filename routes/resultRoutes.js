const express = require("express");
const Result = require("../models/Result");

const router = express.Router();

/* =========================================
   GET ALL RESULTS - FACULTY
========================================= */

router.get("/", async (req, res) => {
  try {
    const results = await Result.find()
      .populate("examId")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Get all results error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch results",
    });
  }
});


/* =========================================
   GET STUDENT RESULTS
========================================= */

router.get("/student/:email", async (req, res) => {
  try {
    const email =
      decodeURIComponent(
        req.params.email
      ).toLowerCase();

    const results = await Result.find({
      studentEmail: email,
    })
      .populate("examId")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error(
      "Get student results error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student results",
    });
  }
});


/* =========================================
   GET SINGLE RESULT
========================================= */

router.get("/:id", async (req, res) => {
  try {
    const result =
      await Result.findById(
        req.params.id
      ).populate("examId");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "Get single result error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch result",
    });
  }
});


/* =========================================
   CREATE RESULT
========================================= */

router.post("/", async (req, res) => {
  try {
    const {
      examId,
      examTitle,
      examType,
      studentEmail,
      studentName,
      totalQuestions,
      attemptedQuestions,
      correctQuestions,
      score,
      status,
      submittedAt,
      questionResults,
    } = req.body;

    if (!examId) {
      return res.status(400).json({
        success: false,
        message: "Exam ID is required",
      });
    }

    if (!examTitle) {
      return res.status(400).json({
        success: false,
        message: "Exam title is required",
      });
    }

    if (!examType) {
      return res.status(400).json({
        success: false,
        message: "Exam type is required",
      });
    }

    if (!studentEmail) {
      return res.status(400).json({
        success: false,
        message: "Student email is required",
      });
    }

    /* -------------------------------------
       SAVE RESULT
    ------------------------------------- */

    const result = await Result.create({
      examId,
      examTitle,
      examType,
      studentEmail:
        studentEmail.toLowerCase(),
      studentName:
        studentName || "",
      totalQuestions:
        Number(totalQuestions) || 0,
      attemptedQuestions:
        Number(attemptedQuestions) || 0,
      correctQuestions:
        Number(correctQuestions) || 0,
      score:
        Number(score) || 0,
      status:
        status || "Submitted",
      submittedAt:
        submittedAt || new Date(),
      questionResults:
        questionResults || [],
    });

    return res.status(201).json({
      success: true,
      message: "Result saved successfully",
      result,
    });
  } catch (error) {
    console.error(
      "Create result error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to save result",
    });
  }
});


/* =========================================
   DELETE RESULT
========================================= */

router.delete("/:id", async (req, res) => {
  try {
    const result =
      await Result.findByIdAndDelete(
        req.params.id
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    return res.json({
      success: true,
      message: "Result deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete result error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete result",
    });
  }
});


module.exports = router;