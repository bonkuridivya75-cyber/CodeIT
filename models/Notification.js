const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
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

    type: {
      type: String,
      enum: [
        "Announcement",
        "Exam",
        "Assignment",
        "Result",
        "Reminder",
        "General",
      ],
      default: "General",
    },

    target: {
      type: String,
      enum: ["All Students", "Specific Student"],
      default: "All Students",
    },

    studentEmail: {
      type: String,
      default: "",
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: String,
      default: "Faculty",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);