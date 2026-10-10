const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    target: {
      type: String,
      enum: ["All Students", "Faculty", "Specific Student"],
      default: "All Students",
    },

    studentEmail: {
      type: String,
      default: "",
      trim: true,
    },

    createdBy: {
      type: String,
      default: "Faculty",
    },

    createdByName: {
      type: String,
      default: "",
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Normal", "Important", "Urgent"],
      default: "Normal",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Announcement", announcementSchema);