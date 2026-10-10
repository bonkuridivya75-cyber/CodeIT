const express = require("express");
const User = require("../models/User");

const router = express.Router();

/* ==============================
   GET STUDENT PROFILE
   ============================== */

router.get("/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase();

    const user = await User.findOne({
      email,
      role: "Student",
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student profile",
    });
  }
});

/* ==============================
   UPDATE STUDENT PROFILE
   ============================== */

router.put("/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase();

    const {
      name,
      studentId,
      department,
      course,
      year,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        email,
        role: "Student",
      },
      {
        name: name.trim(),
        studentId: studentId || "",
        department: department || "Information Technology",
        course: course || "B.Tech",
        year: year || "3rd Year",
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update student profile",
    });
  }
});

module.exports = router;