const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["Student", "Faculty"],
    },

    // ==========================================
    // STUDENT DETAILS
    // ==========================================

    studentId: {
      type: String,
      default: "",
      trim: true,
    },

    course: {
      type: String,
      default: "B.Tech",
      trim: true,
    },

    year: {
      type: String,
      default: "3rd Year",
      trim: true,
    },

    // ==========================================
    // FACULTY DETAILS
    // ==========================================

    facultyId: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // COMMON
    // ==========================================

    department: {
      type: String,
      default: "Information Technology",
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "User",
    userSchema
  );