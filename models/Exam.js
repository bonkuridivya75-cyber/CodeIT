const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["MCQ", "Coding"],
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    questions: {
      type: Number,
      required: true,
      min: 1,
    },

    startDate: {
      type: String,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "Active",
        "Completed",
        "Inactive",
      ],
      default: "Draft",
    },

    codingQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    mcqQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Exam",
    examSchema
  );