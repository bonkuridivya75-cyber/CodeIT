const express = require("express");
const Assignment = require("../models/Assignment");
const Notification = require("../models/Notification");

const router = express.Router();

/* GET ALL ASSIGNMENTS */
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error("Get assignments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load assignments.",
    });
  }
});

/* GET SINGLE ASSIGNMENT */
router.get("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(
      req.params.id
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    res.status(200).json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error("Get assignment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load assignment.",
    });
  }
});

/* CREATE ASSIGNMENT */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      subject,
      description,
      dueDate,
      totalMarks,
    } = req.body;

    if (
      !title ||
      !subject ||
      !dueDate ||
      !totalMarks
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, subject, due date and total marks are required.",
      });
    }

    /* CREATE ASSIGNMENT */
    const assignment = await Assignment.create({
      title,
      subject,
      description,
      dueDate,
      totalMarks,
      status: "Active",
      createdBy: "Faculty",
    });

    /* CREATE STUDENT NOTIFICATION */
    try {
      await Notification.create({
        title: `New Assignment: ${title}`,

        message:
          `A new ${subject} assignment has been added. ` +
          `Due Date: ${new Date(dueDate).toLocaleDateString()} | ` +
          `Total Marks: ${totalMarks}`,

        type: "Assignment",

        target: "All Students",

        studentEmail: "",

        createdBy: "Faculty",
      });

      console.log("✅ Assignment notification created.");
    } catch (notificationError) {
      console.error(
        "⚠️ Assignment notification error:",
        notificationError
      );
    }

    res.status(201).json({
      success: true,
      message:
        "Assignment created successfully and students notified.",
      assignment,
    });
  } catch (error) {
    console.error("Create assignment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create assignment.",
    });
  }
});

/* UPDATE ASSIGNMENT */
router.put("/:id", async (req, res) => {
  try {
    const assignment =
      await Assignment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully.",
      assignment,
    });
  } catch (error) {
    console.error("Update assignment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update assignment.",
    });
  }
});

/* DELETE ASSIGNMENT */
router.delete("/:id", async (req, res) => {
  try {
    const assignment =
      await Assignment.findByIdAndDelete(
        req.params.id
      );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete assignment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete assignment.",
    });
  }
});

module.exports = router;