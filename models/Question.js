const mongoose = require("mongoose");

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

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["MCQ", "Coding"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    marks: {
      type: Number,
      default: 5,
    },

    subject: {
      type: String,
      default: "Programming",
    },

    options: {
      type: [String],
      default: [],
    },

    correctAnswer: {
      type: String,
      default: "",
    },

    starterCode: {
      JavaScript: {
        type: String,
        default: "// Write your solution here",
      },

      Python: {
        type: String,
        default: "# Write your solution here",
      },

      Java: {
        type: String,
        default: "// Write your solution here",
      },

      "C++": {
        type: String,
        default: "// Write your solution here",
      },

      C: {
        type: String,
        default: "// Write your solution here",
      },

      CSharp: {
        type: String,
        default: "// Write your solution here",
      },

      Go: {
        type: String,
        default: "// Write your solution here",
      },

      Rust: {
        type: String,
        default: "// Write your solution here",
      },

      PHP: {
        type: String,
        default: "<?php\n// Write your solution here",
      },

      Kotlin: {
        type: String,
        default: "// Write your solution here",
      },
    },

    testCases: {
      type: [testCaseSchema],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);