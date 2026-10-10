const mongoose = require("mongoose");

const examSessionSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      trim: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    studentEmail: {
      type: String,
      required: true,
      trim: true,
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      default: null,
    },

    examTitle: {
      type: String,
      required: true,
      trim: true,
    },

    examType: {
      type: String,
      enum: ["MCQ", "Coding"],
      default: "MCQ",
    },

    status: {
      type: String,
      enum: ["Online", "Offline", "Submitted"],
      default: "Online",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    answeredQuestions: {
      type: Number,
      default: 0,
    },

    timeRemaining: {
      type: Number,
      default: 0,
    },

    suspiciousActivity: {
      type: Number,
      default: 0,
    },

    lastActivity: {
      type: Date,
      default: Date.now,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ExamSession",
  examSessionSchema
);