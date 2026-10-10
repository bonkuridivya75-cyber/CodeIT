const mongoose = require("mongoose");

const codingSubmissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studentName: {
      type: String,
      default: "",
    },

    registrationNumber: {
      type: String,
      default: "",
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      default: null,
    },

    examName: {
      type: String,
      default: "",
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      default: null,
    },

    questionTitle: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "",
    },

    code: {
      type: String,
      required: true,
    },

    input: {
      type: String,
      default: "",
    },

    output: {
      type: String,
      default: "",
    },

    expectedOutput: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Submitted",
    },

    score: {
      type: Number,
      default: 0,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "CodingSubmission",
    codingSubmissionSchema
  );