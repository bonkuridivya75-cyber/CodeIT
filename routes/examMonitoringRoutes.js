const express = require("express");
const ExamSession = require("../models/ExamSession");

const router = express.Router();

// ==========================================
// GET ALL ACTIVE EXAM SESSIONS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const sessions = await ExamSession.find({
      status: {
        $in: ["Online", "Offline"],
      },
    })
      .populate(
        "examId",
        "title examType duration"
      )
      .sort({
        lastActivity: -1,
      });

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error(
      "❌ Get monitoring sessions error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load monitoring sessions.",
    });
  }
});

// ==========================================
// GET SINGLE SESSION
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const session =
      await ExamSession.findById(
        req.params.id
      ).populate(
        "examId",
        "title examType duration"
      );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Exam session not found.",
      });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error(
      "❌ Get exam session error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load exam session.",
    });
  }
});

// ==========================================
// CREATE / START SESSION
// ==========================================

router.post("/", async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      studentEmail,
      examId,
      examTitle,
      examType,
      totalQuestions,
      timeRemaining,
    } = req.body;

    if (
      !studentId ||
      !studentName ||
      !studentEmail ||
      !examTitle
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student details and exam title are required.",
      });
    }

    // Check existing active session
    const existingSession =
      await ExamSession.findOne({
        studentEmail,
        examTitle,
        status: {
          $in: ["Online", "Offline"],
        },
      });

    if (existingSession) {
      return res.status(200).json({
        success: true,
        message:
          "Existing exam session found.",
        session: existingSession,
      });
    }

    const session =
      await ExamSession.create({
        studentId,
        studentName,
        studentEmail,
        examId: examId || null,
        examTitle,
        examType: examType || "MCQ",
        totalQuestions:
          totalQuestions || 0,
        timeRemaining:
          timeRemaining || 0,
        status: "Online",
        progress: 0,
        answeredQuestions: 0,
        suspiciousActivity: 0,
        lastActivity: new Date(),
        startedAt: new Date(),
      });

    res.status(201).json({
      success: true,
      message:
        "Exam session started successfully.",
      session,
    });
  } catch (error) {
    console.error(
      "❌ Create exam session error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create exam session.",
    });
  }
});

// ==========================================
// UPDATE SESSION
// ==========================================

router.put("/:id", async (req, res) => {
  try {
    const allowedFields = [
      "status",
      "progress",
      "totalQuestions",
      "answeredQuestions",
      "timeRemaining",
      "suspiciousActivity",
      "lastActivity",
      "submittedAt",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.lastActivity = new Date();

    const session =
      await ExamSession.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Exam session not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Exam session updated successfully.",
      session,
    });
  } catch (error) {
    console.error(
      "❌ Update exam session error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update exam session.",
    });
  }
});

// ==========================================
// SUBMIT SESSION
// ==========================================

router.put("/:id/submit", async (req, res) => {
  try {
    const session =
      await ExamSession.findByIdAndUpdate(
        req.params.id,
        {
          status: "Submitted",
          progress: 100,
          submittedAt: new Date(),
          lastActivity: new Date(),
        },
        {
          new: true,
        }
      );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Exam session not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Exam session submitted successfully.",
      session,
    });
  } catch (error) {
    console.error(
      "❌ Submit exam session error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to submit exam session.",
    });
  }
});

// ==========================================
// DELETE SESSION
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const session =
      await ExamSession.findByIdAndDelete(
        req.params.id
      );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Exam session not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Exam session deleted successfully.",
    });
  } catch (error) {
    console.error(
      "❌ Delete exam session error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete exam session.",
    });
  }
});

module.exports = router;