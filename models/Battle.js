const mongoose = require("mongoose");

/* =========================================================
   TEST CASE
========================================================= */

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      default: "",
    },

    expectedOutput: {
      type: String,
      default: "",
    },

    hidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   PLAYER
========================================================= */

const playerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    name: {
      type: String,
      default: "",
      trim: true,
    },

    joinedAt: {
      type: Date,
      default: null,
    },

    submitted: {
      type: Boolean,
      default: false,
    },

    passedTestCases: {
      type: Number,
      default: 0,
    },

    totalTestCases: {
      type: Number,
      default: 0,
    },

    submissionTime: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   BATTLE
========================================================= */

const battleSchema = new mongoose.Schema(
  {
    battleId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    problemId: {
      type: Number,
      required: true,
    },

    problemTitle: {
      type: String,
      required: true,
      trim: true,
    },

    problemDescription: {
      type: String,
      default: "",
    },

    testCases: {
      type: [testCaseSchema],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "Waiting",
        "Active",
        "Completed",
      ],
      default: "Waiting",
    },

    player1: {
      type: playerSchema,
      required: true,
    },

    player2: {
      type: playerSchema,
      required: true,
    },

    winner: {
      type: String,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Battle",
  battleSchema
);