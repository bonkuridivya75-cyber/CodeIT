const express = require("express");
const Announcement = require("../models/Announcement");
const Notification = require("../models/Notification");

const router = express.Router();

/*
  GET ALL ANNOUNCEMENTS
*/
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    console.error("❌ Get announcements error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load announcements.",
    });
  }
});


/*
  CREATE ANNOUNCEMENT
  ALSO CREATES STUDENT NOTIFICATION
*/
router.post("/", async (req, res) => {
  try {
    const {
      title,
      message,
      target,
      studentEmail,
      createdBy,
      createdByName,
      priority,
    } = req.body;

    // Validation
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required.",
      });
    }

    // Create announcement
    const announcement = await Announcement.create({
      title: title.trim(),
      message: message.trim(),
      target: target || "All Students",
      studentEmail:
        target === "Specific Student"
          ? studentEmail || ""
          : "",
      createdBy: createdBy || "Faculty",
      createdByName: createdByName || "",
      priority: priority || "Normal",
      isActive: true,
    });

    /*
      CREATE NOTIFICATION FOR STUDENTS
    */

    // Notification for all students
    if (announcement.target === "All Students") {
      await Notification.create({
        title: announcement.title,
        message: announcement.message,
        type: "Announcement",
        target: "All Students",
        studentEmail: "",
        createdBy:
          announcement.createdByName ||
          announcement.createdBy ||
          "Faculty",
        isRead: false,
      });
    }

    // Notification for one specific student
    if (
      announcement.target === "Specific Student" &&
      announcement.studentEmail
    ) {
      await Notification.create({
        title: announcement.title,
        message: announcement.message,
        type: "Announcement",
        target: "Specific Student",
        studentEmail: announcement.studentEmail,
        createdBy:
          announcement.createdByName ||
          announcement.createdBy ||
          "Faculty",
        isRead: false,
      });
    }

    return res.status(201).json({
      success: true,
      message:
        "Announcement created and student notification sent successfully.",
      announcement,
    });
  } catch (error) {
    console.error("❌ Create announcement error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create announcement.",
      error: error.message,
    });
  }
});


/*
  UPDATE ANNOUNCEMENT
*/
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      message,
      target,
      studentEmail,
      priority,
      isActive,
    } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        title,
        message,
        target,
        studentEmail:
          target === "Specific Student"
            ? studentEmail || ""
            : "",
        priority,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully.",
      announcement,
    });
  } catch (error) {
    console.error("❌ Update announcement error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update announcement.",
    });
  }
});


/*
  DELETE ANNOUNCEMENT
*/
router.delete("/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(
      req.params.id
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Delete announcement error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete announcement.",
    });
  }
});


module.exports = router;