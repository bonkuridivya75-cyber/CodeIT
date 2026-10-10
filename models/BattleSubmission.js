const mongoose = require("mongoose");

const battleSubmissionSchema =
  new mongoose.Schema(
    {
      battleId: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        index: true,
      },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      playerName: {
        type: String,
        required: true,
        trim: true,
      },

      language: {
        type: String,
        required: true,
        trim: true,
      },

      code: {
        type: String,
        required: true,
      },

      passedTestCases: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalTestCases: {
        type: Number,
        default: 0,
        min: 0,
      },

      executionTime: {
        type: Number,
        default: 0,
        min: 0,
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Accepted",
          "Wrong Answer",
          "Compilation Error",
          "Runtime Error",
        ],
        default: "Pending",
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

battleSubmissionSchema.index({
  battleId: 1,
  submittedAt: -1,
});

module.exports =
  mongoose.model(
    "BattleSubmission",
    battleSubmissionSchema
  );