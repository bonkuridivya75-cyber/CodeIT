const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "codeit_super_secret_key_2026";

// ==========================================
// REGISTER
// ==========================================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      studentId,
      facultyId,
      designation,
      department,
      course,
      year,
    } = req.body;

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and role are required.",
      });
    }

    if (
      role !== "Student" &&
      role !== "Faculty"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    // ------------------------------------------
    // CHECK EXISTING USER
    // ------------------------------------------

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // ------------------------------------------
    // HASH PASSWORD
    // ------------------------------------------

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ------------------------------------------
    // CREATE USER
    // ------------------------------------------

    const userData = {
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role,
      department:
        department?.trim() ||
        "Information Technology",
    };

    if (role === "Student") {
      userData.studentId =
        studentId?.trim() || "";

      userData.course =
        course?.trim() || "B.Tech";

      userData.year =
        year?.trim() || "3rd Year";
    }

    if (role === "Faculty") {
      userData.facultyId =
        facultyId?.trim() || "";

      userData.designation =
        designation?.trim() || "";
    }

    const user =
      await User.create(userData);

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Registration successful.",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId:
          user.studentId || "",
        facultyId:
          user.facultyId || "",
        designation:
          user.designation || "",
        department:
          user.department || "",
        course:
          user.course || "",
        year:
          user.year || "",
      },
    });
  } catch (error) {
    console.error(
      "❌ Registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Registration failed.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
});

// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;

    console.log("================================");
    console.log("🔐 LOGIN REQUEST");
    console.log("Email:", email);
    console.log("Role:", role);
    console.log("================================");

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Email, password and role are required.",
      });
    }

    if (
      role !== "Student" &&
      role !== "Faculty"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    // ------------------------------------------
    // FIND USER
    // ------------------------------------------

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      console.log(
        "❌ User not found:",
        cleanEmail
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    console.log(
      "✅ User found:",
      user.email
    );

    console.log(
      "👤 Database role:",
      user.role
    );

    // ------------------------------------------
    // ROLE CHECK
    // ------------------------------------------

    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message:
          `This account is registered as ${user.role}.`,
      });
    }

    // ------------------------------------------
    // PASSWORD CHECK
    // ------------------------------------------

    let passwordMatch = false;

    const storedPassword =
      String(user.password || "");

    const isBcryptPassword =
      storedPassword.startsWith("$2a$") ||
      storedPassword.startsWith("$2b$") ||
      storedPassword.startsWith("$2y$");

    if (isBcryptPassword) {
      passwordMatch =
        await bcrypt.compare(
          password,
          storedPassword
        );
    } else {
      // Support old plain-text accounts
      passwordMatch =
        password === storedPassword;

      // Convert old password to bcrypt
      if (passwordMatch) {
        user.password =
          await bcrypt.hash(
            password,
            10
          );

        await user.save();

        console.log(
          "🔐 Old password converted to bcrypt."
        );
      }
    }

    if (!passwordMatch) {
      console.log(
        "❌ Password mismatch"
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    console.log(
      "✅ Password verified"
    );

    // ------------------------------------------
    // CREATE JWT
    // ------------------------------------------

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log(
      "✅ JWT created successfully"
    );

    // ------------------------------------------
    // SUCCESS
    // ------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Login successful.",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        studentId:
          user.studentId || "",

        facultyId:
          user.facultyId || "",

        designation:
          user.designation || "",

        department:
          user.department || "",

        course:
          user.course || "",

        year:
          user.year || "",
      },
    });
  } catch (error) {
    console.error(
      "================================"
    );

    console.error(
      "❌ LOGIN SERVER ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================"
    );

    return res.status(500).json({
      success: false,
      message:
        "Login failed due to a server error.",
      error: error.message,
    });
  }
});

module.exports = router;