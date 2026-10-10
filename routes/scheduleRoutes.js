const express = require("express");
const Schedule = require("../models/Schedule");

const router = express.Router();

// ==========================================
// GET ALL SCHEDULES
// ==========================================

router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("examId", "title examType duration")
      .sort({
        date: 1,
        startTime: 1,
      });

    res.status(200).json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (error) {
    console.error("❌ Get schedules error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load schedules.",
    });
  }
});

// ==========================================
// GET SINGLE SCHEDULE
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const schedule = await Schedule.findById(
      req.params.id
    ).populate(
      "examId",
      "title examType duration"
    );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
    }

    res.status(200).json({
      success: true,
      schedule,
    });
  } catch (error) {
    console.error(
      "❌ Get schedule error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load schedule.",
    });
  }
});

// ==========================================
// CREATE SCHEDULE
// ==========================================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      examId,
      examType,
      date,
      startTime,
      endTime,
      room,
      description,
      target,
      status,
      createdBy,
    } = req.body;

    if (
      !title ||
      !date ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, date, start time and end time are required.",
      });
    }

    const schedule = await Schedule.create({
      title,
      examId: examId || null,
      examType: examType || "Other",
      date,
      startTime,
      endTime,
      room: room || "",
      description: description || "",
      target: target || "All Students",
      status: status || "Scheduled",
      createdBy: createdBy || "Faculty",
    });

    res.status(201).json({
      success: true,
      message: "Schedule created successfully.",
      schedule,
    });
  } catch (error) {
    console.error(
      "❌ Create schedule error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create schedule.",
    });
  }
});

// ==========================================
// UPDATE SCHEDULE
// ==========================================

router.put("/:id", async (req, res) => {
  try {
    const schedule =
      await Schedule.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Schedule updated successfully.",
      schedule,
    });
  } catch (error) {
    console.error(
      "❌ Update schedule error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update schedule.",
    });
  }
});

// ==========================================
// DELETE SCHEDULE
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const schedule =
      await Schedule.findByIdAndDelete(
        req.params.id
      );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Schedule deleted successfully.",
    });
  } catch (error) {
    console.error(
      "❌ Delete schedule error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete schedule.",
    });
  }
});

module.exports = router;