import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = "/api";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // CLEAR OLD USER DATA
  // ==========================================

  const clearOldUserData = () => {
    const keys = [
      "auth-token",
      "placement-login",
      "user-role",
      "user-id",
      "user-name",
      "user-email",
      "student-id",
      "faculty-id",
      "faculty-designation",
      "user-department",
      "user-course",
      "user-year",
    ];

    keys.forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (event) => {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      alert("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          role,
        }),
      });

      // ==========================================
      // READ SERVER RESPONSE
      // ==========================================

      const responseText = await response.text();

      let data = {};

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (error) {
          console.error(
            "Backend returned invalid JSON:",
            responseText
          );

          throw new Error(
            `Server returned an invalid response (${response.status}).`
          );
        }
      }

      // ==========================================
      // SERVER ERROR
      // ==========================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Login failed. Server status: ${response.status}`
        );
      }

      // ==========================================
      // TOKEN CHECK
      // ==========================================

      if (!data.token) {
        throw new Error(
          data.message ||
            "Login response does not contain an authentication token."
        );
      }

      // ==========================================
      // USER CHECK
      // ==========================================

      if (!data.user) {
        throw new Error(
          "Login response does not contain user details."
        );
      }

      const loggedInUser = data.user;

      const loggedInRole =
        loggedInUser.role || role;

      // ==========================================
      // ROLE VALIDATION
      // ==========================================

      if (
        loggedInRole !== "Student" &&
        loggedInRole !== "Faculty"
      ) {
        throw new Error("Invalid user role received from server.");
      }

      if (loggedInRole !== role) {
        throw new Error(
          `This account is registered as ${loggedInRole}. Please select ${loggedInRole} and try again.`
        );
      }

      // ==========================================
      // CLEAR PREVIOUS LOGIN DATA
      // ==========================================

      clearOldUserData();

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      localStorage.setItem(
        "auth-token",
        data.token
      );

      // ==========================================
      // SAVE LOGIN STATE
      // ==========================================

      localStorage.setItem(
        "placement-login",
        "true"
      );

      localStorage.setItem(
        "user-role",
        loggedInRole
      );

      // ==========================================
      // COMMON USER DETAILS
      // ==========================================

      if (loggedInUser._id) {
        localStorage.setItem(
          "user-id",
          loggedInUser._id
        );
      }

      if (loggedInUser.name) {
        localStorage.setItem(
          "user-name",
          loggedInUser.name
        );
      }

      if (loggedInUser.email) {
        localStorage.setItem(
          "user-email",
          loggedInUser.email
        );
      }

      if (loggedInUser.department) {
        localStorage.setItem(
          "user-department",
          loggedInUser.department
        );
      }

      // ==========================================
      // STUDENT DETAILS
      // ==========================================

      if (loggedInRole === "Student") {
        if (loggedInUser.studentId) {
          localStorage.setItem(
            "student-id",
            loggedInUser.studentId
          );

          // Keep this key also because OnlineExam
          // can use it for registration number.
          localStorage.setItem(
            "user-student-id",
            loggedInUser.studentId
          );
        }

        if (loggedInUser.course) {
          localStorage.setItem(
            "user-course",
            loggedInUser.course
          );
        }

        if (loggedInUser.year) {
          localStorage.setItem(
            "user-year",
            loggedInUser.year
          );
        }
      }

      // ==========================================
      // FACULTY DETAILS
      // ==========================================

      if (loggedInRole === "Faculty") {
        if (loggedInUser.facultyId) {
          localStorage.setItem(
            "faculty-id",
            loggedInUser.facultyId
          );
        }

        if (loggedInUser.designation) {
          localStorage.setItem(
            "faculty-designation",
            loggedInUser.designation
          );
        }
      }

      // ==========================================
      // REMEMBER ME
      // ==========================================

      if (rememberMe) {
        localStorage.setItem(
          "remember-me",
          "true"
        );
      } else {
        localStorage.removeItem(
          "remember-me"
        );
      }

      // ==========================================
      // UPDATE APP LOGIN STATE
      // ==========================================

      if (onLogin) {
        onLogin();
      }

      // ==========================================
      // REDIRECT
      // ==========================================

      if (loggedInRole === "Student") {
        navigate("/student-dashboard");
      } else {
        navigate("/faculty-dashboard");
      }
    } catch (error) {
      console.error("❌ Login error:", error);

      alert(
        error.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ROLE CHANGE
  // ==========================================

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);

    // Clear password when changing role
    setPassword("");
    setShowPassword(false);
  };

  return (
    <div className="login-page">

      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <div className="bg-circle bg-circle-one"></div>
      <div className="bg-circle bg-circle-two"></div>
      <div className="bg-circle bg-circle-three"></div>

      <div className="code-pattern pattern-one">
        &lt;/&gt;
      </div>

      <div className="code-pattern pattern-two">
        {"{ }"}
      </div>

      <div className="code-pattern pattern-three">
        01
      </div>

      {/* ==========================================
          LOGIN CARD
      ========================================== */}

      <div className="login-card">

        {/* ========================================
            BRAND
        ======================================== */}

        <div className="brand">

          <div className="brand-logo">
            C
          </div>

          <div>
            <h2>CodeIT</h2>
            <p>Academic Portal</p>
          </div>

        </div>

        {/* ========================================
            WELCOME
        ======================================== */}

        <div className="welcome">

          <h1>Welcome back</h1>

          <p>
            Please enter your details to continue
          </p>

        </div>

        {/* ========================================
            ROLE SELECTION
        ======================================== */}

        <div className="role-buttons">

          <button
            type="button"
            className={
              role === "Student"
                ? "role active"
                : "role"
            }
            onClick={() =>
              handleRoleChange("Student")
            }
          >
            <span className="role-icon">
              🎓
            </span>

            Student
          </button>

          <button
            type="button"
            className={
              role === "Faculty"
                ? "role active"
                : "role"
            }
            onClick={() =>
              handleRoleChange("Faculty")
            }
          >
            <span className="role-icon">
              👨‍🏫
            </span>

            Faculty
          </button>

        </div>

        {/* ========================================
            LOGIN FORM
        ======================================== */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="form-group">

            <label>
              {role === "Student"
                ? "Student Email"
                : "Faculty Email"}
            </label>

            <input
              type="email"
              placeholder={
                role === "Student"
                  ? "Enter student email"
                  : "Enter faculty email"
              }
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              disabled={loading}
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label>Password</label>

            <div className="password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
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
                disabled={loading}
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>

          {/* LOGIN OPTIONS */}

          <div className="login-options">

            <label>

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(
                    event.target.checked
                  )
                }
                disabled={loading}
              />

              <span>
                Remember me
              </span>

            </label>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                alert(
                  "Please contact your faculty/admin to reset your password."
                )
              }
            >
              Forgot Password?
            </button>

          </div>

          {/* SIGN IN */}

          <button
            type="submit"
            className="signin"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        {/* ========================================
            REGISTER
        ======================================== */}

        <div className="register">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
            disabled={loading}
          >
            Register
          </button>

        </div>

        {/* ========================================
            BACK TO WEBSITE
        ======================================== */}

        <div className="back-to-website">

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

        {/* ========================================
            FOOTER
        ======================================== */}

        <div className="login-footer">

          <span>CodeIT</span>

          <span>•</span>

          <span>Academic Portal</span>

        </div>

      </div>

    </div>
  );
}

export default Login;