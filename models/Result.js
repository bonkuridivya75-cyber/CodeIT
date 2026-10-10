const mongoose = require("mongoose");

const questionResultSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },

    questionTitle: {
      type: String,
      default: "",
    },

    submittedCode: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Submitted",
    },

    correct: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const resultSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    examTitle: {
      type: String,
      required: true,
    },

    examType: {
      type: String,
      enum: ["MCQ", "Coding"],
      required: true,
    },

    studentEmail: {
      type: String,
      required: true,
      trim: true,
    },

    studentName: {
      type: String,
      default: "",
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    attemptedQuestions: {
      type: Number,
      default: 0,
    },

    correctQuestions: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "In Progress",
        "Submitted",
        "Completed",
      ],
      default: "In Progress",
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    questionResults: [
      questionResultSchema,
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Result",
  resultSchema
);