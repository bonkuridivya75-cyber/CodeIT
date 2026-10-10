import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const API_URL = "/api";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Student");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState(
    "Information Technology"
  );

  // Student
  const [studentId, setStudentId] = useState("");
  const [course, setCourse] = useState("B.Tech");
  const [year, setYear] = useState("3rd Year");

  // Faculty
  const [facultyId, setFacultyId] = useState("");
  const [designation, setDesignation] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // CHANGE ROLE
  // ==========================================

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);

    setPassword("");
    setConfirmPassword("");

    if (selectedRole === "Student") {
      setFacultyId("");
      setDesignation("");
    } else {
      setStudentId("");
      setCourse("B.Tech");
      setYear("3rd Year");
    }
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = async (event) => {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // ========================================
    // COMMON VALIDATION
    // ========================================

    if (!cleanName) {
      alert("Please enter your name.");
      return;
    }

    if (!cleanEmail) {
      alert("Please enter your email.");
      return;
    }

    if (!department.trim()) {
      alert("Please enter your department.");
      return;
    }

    // ========================================
    // STUDENT VALIDATION
    // ========================================

    if (role === "Student") {
      if (!studentId.trim()) {
        alert("Please enter your Student ID.");
        return;
      }

      if (!course.trim()) {
        alert("Please enter your course.");
        return;
      }

      if (!year.trim()) {
        alert("Please select your year.");
        return;
      }
    }

    // ========================================
    // FACULTY VALIDATION
    // ========================================

    if (role === "Faculty") {
      if (!facultyId.trim()) {
        alert("Please enter your Faculty ID.");
        return;
      }

      if (!designation.trim()) {
        alert("Please enter your designation.");
        return;
      }
    }

    // ========================================
    // PASSWORD VALIDATION
    // ========================================

    if (!password) {
      alert("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // ========================================
      // REQUEST BODY
      // ========================================

      const requestBody = {
        name: cleanName,
        email: cleanEmail,
        password,
        role,
        department: department.trim(),

        // Student
        studentId:
          role === "Student"
            ? studentId.trim()
            : "",

        course:
          role === "Student"
            ? course.trim()
            : "",

        year:
          role === "Student"
            ? year.trim()
            : "",

        // Faculty
        facultyId:
          role === "Faculty"
            ? facultyId.trim()
            : "",

        designation:
          role === "Faculty"
            ? designation.trim()
            : "",
      };

      // ========================================
      // API REQUEST
      // ========================================

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // ========================================
      // SAFE RESPONSE
      // ========================================

      const responseText = await response.text();

      let data = {};

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (error) {
          console.error(
            "Invalid backend response:",
            responseText
          );

          throw new Error(
            `Server returned an invalid response (${response.status}).`
          );
        }
      }

      // ========================================
      // ERROR
      // ========================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Registration failed. Server status: ${response.status}`
        );
      }

      // ========================================
      // SUCCESS
      // ========================================

      alert(
        data.message ||
          "Registration successful!"
      );

      // Go to login
      navigate("/login");

    } catch (error) {
      console.error(
        "❌ Registration error:",
        error
      );

      alert(
        error.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* ========================================
          REGISTER CARD
      ======================================== */}

      <div className="register-card">

        {/* BRAND */}

        <div className="register-brand">

          <div className="register-logo">
            C
          </div>

          <div>
            <h2>CodeIT</h2>
            <p>Academic Portal</p>
          </div>

        </div>

        {/* HEADING */}

        <div className="register-heading">

          <h1>Create Account</h1>

          <p>
            Register for your CodeIT account
          </p>

        </div>

        {/* ROLE */}

        <div className="register-role-buttons">

          <button
            type="button"
            className={
              role === "Student"
                ? "register-role active"
                : "register-role"
            }
            onClick={() =>
              handleRoleChange("Student")
            }
            disabled={loading}
          >
            🎓 Student
          </button>

          <button
            type="button"
            className={
              role === "Faculty"
                ? "register-role active"
                : "register-role"
            }
            onClick={() =>
              handleRoleChange("Faculty")
            }
            disabled={loading}
          >
            👨‍🏫 Faculty
          </button>

        </div>

        {/* ========================================
            FORM
        ======================================== */}

        <form onSubmit={handleRegister}>

          {/* NAME */}

          <div className="register-form-group">

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              disabled={loading}
              required
            />

          </div>

          {/* EMAIL */}

          <div className="register-form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
              required
            />

          </div>

          {/* DEPARTMENT */}

          <div className="register-form-group">

            <label>Department</label>

            <input
              type="text"
              placeholder="Enter department"
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
              disabled={loading}
              required
            />

          </div>

          {/* ======================================
              STUDENT FIELDS
          ====================================== */}

          {role === "Student" && (
            <>
              <div className="register-form-group">

                <label>Student ID</label>

                <input
                  type="text"
                  placeholder="Enter student ID"
                  value={studentId}
                  onChange={(e) =>
                    setStudentId(e.target.value)
                  }
                  disabled={loading}
                  required
                />

              </div>

              <div className="register-two-column">

                <div className="register-form-group">

                  <label>Course</label>

                  <select
                    value={course}
                    onChange={(e) =>
                      setCourse(e.target.value)
                    }
                    disabled={loading}
                  >
                    <option value="B.Tech">
                      B.Tech
                    </option>

                    <option value="M.Tech">
                      M.Tech
                    </option>

                    <option value="BCA">
                      BCA
                    </option>

                    <option value="MCA">
                      MCA
                    </option>
                  </select>

                </div>

                <div className="register-form-group">

                  <label>Year</label>

                  <select
                    value={year}
                    onChange={(e) =>
                      setYear(e.target.value)
                    }
                    disabled={loading}
                  >
                    <option value="1st Year">
                      1st Year
                    </option>

                    <option value="2nd Year">
                      2nd Year
                    </option>

                    <option value="3rd Year">
                      3rd Year
                    </option>

                    <option value="4th Year">
                      4th Year
                    </option>
                  </select>

                </div>

              </div>
            </>
          )}

          {/* ======================================
              FACULTY FIELDS
          ====================================== */}

          {role === "Faculty" && (
            <>
              <div className="register-form-group">

                <label>Faculty ID</label>

                <input
                  type="text"
                  placeholder="Enter faculty ID"
                  value={facultyId}
                  onChange={(e) =>
                    setFacultyId(e.target.value)
                  }
                  disabled={loading}
                  required
                />

              </div>

              <div className="register-form-group">

                <label>Designation</label>

                <input
                  type="text"
                  placeholder="Example: Assistant Professor"
                  value={designation}
                  onChange={(e) =>
                    setDesignation(e.target.value)
                  }
                  disabled={loading}
                  required
                />

              </div>
            </>
          )}

          {/* PASSWORD */}

          <div className="register-form-group">

            <label>Password</label>

            <div className="register-password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                disabled={loading}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="register-form-group">

            <label>Confirm Password</label>

            <div className="register-password-box">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                disabled={loading}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) => !previous
                  )
                }
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>

          {/* REGISTER BUTTON */}

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* LOGIN */}

        <div className="already-account">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            disabled={loading}
          >
            Sign In
          </button>

        </div>

        {/* BACK */}

        <div className="register-back">

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            disabled={loading}
          >
            ← Back to Website
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;