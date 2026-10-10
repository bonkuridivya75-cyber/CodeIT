const express = require("express");
const mongoose = require("mongoose");
const CodingSubmission = require("../models/CodingSubmission");

const router = express.Router();

/* ==========================================
   SAVE MULTIPLE CODING SUBMISSIONS
========================================== */

router.post("/bulk", async (req, res) => {
  try {
    const {
      examId,
      studentEmail,
      studentName,
      submissions,
    } = req.body;

    if (!examId) {
      return res.status(400).json({
        success: false,
        message: "Exam ID is required.",
      });
    }

    if (!studentEmail) {
      return res.status(400).json({
        success: false,
        message: "Student email is required.",
      });
    }

    if (
      !Array.isArray(submissions) ||
      submissions.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No coding submissions received.",
      });
    }

    const documents = submissions.map((submission) => ({
      examId:
        mongoose.Types.ObjectId.isValid(examId)
          ? examId
          : null,

      studentEmail,

      studentName:
        studentName || "",

      questionId:
        submission.questionId &&
        mongoose.Types.ObjectId.isValid(
          submission.questionId
        )
          ? submission.questionId
          : null,

      questionTitle:
        submission.questionTitle || "",

      code:
        submission.code || "",

      language:
        submission.language || "JavaScript",

      status: "Submitted",

      score: 0,

      submittedAt: new Date(),
    }));

    const savedSubmissions =
      await CodingSubmission.insertMany(
        documents
      );

    return res.status(201).json({
      success: true,
      message:
        "Coding submissions saved successfully.",
      count: savedSubmissions.length,
      submissions: savedSubmissions,
    });
  } catch (error) {
    console.error(
      "❌ Bulk coding submission error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to save coding submissions.",
      error: error.message,
    });
  }
});

/* ==========================================
   GET ALL CODING SUBMISSIONS
========================================== */

router.get("/", async (req, res) => {
  try {
    const submissions =
      await CodingSubmission.find()
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error(
      "❌ Fetch coding submissions error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch coding submissions.",
    });
  }
});

/* ==========================================
   GET STUDENT SUBMISSIONS
========================================== */

router.get(
  "/student/:email",
  async (req, res) => {
    try {
      const submissions =
        await CodingSubmission.find({
          studentEmail: req.params.email,
        }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        submissions,
      });
    } catch (error) {
      console.error(
        "❌ Student submissions error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch student submissions.",
      });
    }
  }
);

module.exports = router;