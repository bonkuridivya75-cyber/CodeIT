const express = require("express");
const User = require("../models/User");

const router = express.Router();

// ==========================================
// GET ALL STUDENTS
// ==========================================

router.get("/students", async (req, res) => {
  try {
    const students = await User.find({
      role: "Student",
    })
      .select(
        "_id name email studentId department course year createdAt"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error(
      "❌ Get students error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load students.",
    });
  }
});

// ==========================================
// GET ALL FACULTY
// ==========================================

router.get("/faculty", async (req, res) => {
  try {
    const faculty = await User.find({
      role: "Faculty",
    })
      .select(
        "_id name email facultyId designation department createdAt"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: faculty.length,
      faculty,
    });
  } catch (error) {
    console.error(
      "❌ Get faculty error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load faculty.",
    });
  }
});

// ==========================================
// GET USER BY ID
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "❌ Get user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load user.",
    });
  }
});

module.exports = router;