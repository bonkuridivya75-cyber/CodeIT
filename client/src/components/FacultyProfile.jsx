import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyProfile.css";

const FacultyProfile = ({ darkMode, toggleTheme }) => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("profile");
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({
    name: localStorage.getItem("user-name") || "",
    email: localStorage.getItem("user-email") || "",
    facultyId: localStorage.getItem("faculty-id") || "",
    designation: localStorage.getItem("faculty-designation") || "",
    department: localStorage.getItem("department") || "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    examNotifications: true,
    studentNotifications: true,
    announcementNotifications: true,
    emailNotifications: false,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile = () => {
    localStorage.setItem("user-name", profile.name);
    localStorage.setItem("user-email", profile.email);
    localStorage.setItem("faculty-id", profile.facultyId);
    localStorage.setItem(
      "faculty-designation",
      profile.designation
    );
    localStorage.setItem("department", profile.department);

    setMessage("Profile updated successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const changePassword = () => {
    if (
      !password.currentPassword ||
      !password.newPassword ||
      !password.confirmPassword
    ) {
      setMessage("Please fill all password fields.");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    if (password.newPassword.length < 6) {
      setMessage("New password must contain at least 6 characters.");
      return;
    }

    setPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setMessage(
      "Password change request saved. Connect backend API to update it permanently."
    );

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const saveNotifications = () => {
    localStorage.setItem(
      "faculty-notifications",
      JSON.stringify(notifications)
    );

    setMessage("Notification settings saved.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("placement-login");
    localStorage.removeItem("user-role");
    localStorage.removeItem("user-id");

    navigate("/login");
  };

  return (
    <div className={`faculty-profile-page ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="faculty-profile-sidebar">
        <div className="profile-logo">
          <div className="profile-logo-icon">C</div>

          <div>
            <h2>CodeIT</h2>
            <span>FACULTY PORTAL</span>
          </div>
        </div>

        <nav className="profile-navigation">
          <button
            onClick={() => navigate("/faculty-dashboard")}
          >
            <span>📊</span>
            Dashboard
          </button>

          <button
            onClick={() => navigate("/faculty-students")}
          >
            <span>👨‍🎓</span>
            Students
          </button>

          <button
            onClick={() => navigate("/faculty-exams")}
          >
            <span>📝</span>
            Exams
          </button>

          <button
            onClick={() => navigate("/faculty-questions")}
          >
            <span>❓</span>
            Question Bank
          </button>

          <button
            onClick={() => navigate("/faculty-results")}
          >
            <span>📈</span>
            Results
          </button>

          <button
            onClick={() => navigate("/faculty-analytics")}
          >
            <span>📊</span>
            Analytics
          </button>

          <button
            onClick={() => navigate("/faculty-announcements")}
          >
            <span>📢</span>
            Announcements
          </button>

          <button
            onClick={() => navigate("/faculty-schedule")}
          >
            <span>📅</span>
            Schedule
          </button>

          <button
            onClick={() => navigate("/faculty-reports")}
          >
            <span>📄</span>
            Reports
          </button>

          <button
            className="active"
            onClick={() => setActiveSection("profile")}
          >
            <span>👤</span>
            Profile & Settings
          </button>
        </nav>

        <div className="profile-sidebar-bottom">
          <button onClick={toggleTheme}>
            <span>{darkMode ? "☀️" : "🌙"}</span>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            className="logout-button"
            onClick={logout}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="faculty-profile-main">
        <header className="profile-header">
          <div>
            <h1>Profile & Settings</h1>
            <p>
              Manage your faculty profile and account settings
            </p>
          </div>

          <div className="profile-user">
            <div className="profile-avatar">
              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "F"}
            </div>

            <div>
              <strong>{profile.name || "Faculty"}</strong>
              <span>{profile.designation || "Faculty"}</span>
            </div>
          </div>
        </header>

        {message && (
          <div className="profile-message">
            {message}
          </div>
        )}

        <div className="profile-layout">
          {/* Settings Menu */}
          <div className="settings-menu">
            <button
              className={
                activeSection === "profile"
                  ? "selected"
                  : ""
              }
              onClick={() => setActiveSection("profile")}
            >
              <span>👤</span>
              Personal Information
            </button>

            <button
              className={
                activeSection === "password"
                  ? "selected"
                  : ""
              }
              onClick={() => setActiveSection("password")}
            >
              <span>🔐</span>
              Change Password
            </button>

            <button
              className={
                activeSection === "notifications"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setActiveSection("notifications")
              }
            >
              <span>🔔</span>
              Notifications
            </button>

            <button
              className={
                activeSection === "appearance"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setActiveSection("appearance")
              }
            >
              <span>🎨</span>
              Appearance
            </button>
          </div>

          {/* Content */}
          <section className="settings-content">
            {activeSection === "profile" && (
              <div className="settings-card">
                <div className="settings-title">
                  <h2>Personal Information</h2>
                  <p>
                    Update your faculty account information.
                  </p>
                </div>

                <div className="large-profile">
                  <div className="large-avatar">
                    {profile.name
                      ? profile.name
                          .charAt(0)
                          .toUpperCase()
                      : "F"}
                  </div>

                  <div>
                    <h3>{profile.name || "Faculty Name"}</h3>
                    <p>
                      {profile.designation ||
                        "Faculty Member"}
                    </p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      placeholder="Enter email"
                    />
                  </div>

                  <div className="form-group">
                    <label>Faculty ID</label>
                    <input
                      type="text"
                      name="facultyId"
                      value={profile.facultyId}
                      onChange={handleProfileChange}
                      placeholder="Faculty ID"
                    />
                  </div>

                  <div className="form-group">
                    <label>Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={profile.designation}
                      onChange={handleProfileChange}
                      placeholder="Assistant Professor"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Department</label>
                    <input
                      type="text"
                      name="department"
                      value={profile.department}
                      onChange={handleProfileChange}
                      placeholder="Information Technology"
                    />
                  </div>
                </div>

                <div className="settings-actions">
                  <button
                    className="primary-button"
                    onClick={saveProfile}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeSection === "password" && (
              <div className="settings-card">
                <div className="settings-title">
                  <h2>Change Password</h2>
                  <p>
                    Keep your faculty account secure.
                  </p>
                </div>

                <div className="password-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={password.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={password.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={password.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="settings-actions">
                  <button
                    className="primary-button"
                    onClick={changePassword}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="settings-card">
                <div className="settings-title">
                  <h2>Notification Settings</h2>
                  <p>
                    Choose which notifications you want to
                    receive.
                  </p>
                </div>

                <div className="notification-list">
                  <label className="notification-item">
                    <div>
                      <strong>Exam Notifications</strong>
                      <span>
                        Receive notifications about exams.
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={
                        notifications.examNotifications
                      }
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          examNotifications:
                            e.target.checked,
                        })
                      }
                    />
                  </label>

                  <label className="notification-item">
                    <div>
                      <strong>Student Notifications</strong>
                      <span>
                        Receive updates about students.
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={
                        notifications.studentNotifications
                      }
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          studentNotifications:
                            e.target.checked,
                        })
                      }
                    />
                  </label>

                  <label className="notification-item">
                    <div>
                      <strong>Announcement Notifications</strong>
                      <span>
                        Receive announcement updates.
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={
                        notifications.announcementNotifications
                      }
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          announcementNotifications:
                            e.target.checked,
                        })
                      }
                    />
                  </label>

                  <label className="notification-item">
                    <div>
                      <strong>Email Notifications</strong>
                      <span>
                        Receive important updates through email.
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={
                        notifications.emailNotifications
                      }
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailNotifications:
                            e.target.checked,
                        })
                      }
                    />
                  </label>
                </div>

                <div className="settings-actions">
                  <button
                    className="primary-button"
                    onClick={saveNotifications}
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className="settings-card">
                <div className="settings-title">
                  <h2>Appearance</h2>
                  <p>
                    Customize how the faculty portal looks.
                  </p>
                </div>

                <div className="appearance-box">
                  <div>
                    <strong>Theme</strong>
                    <span>
                      Current theme:{" "}
                      {darkMode ? "Dark" : "Light"}
                    </span>
                  </div>

                  <button
                    className="theme-button"
                    onClick={toggleTheme}
                  >
                    {darkMode
                      ? "☀️ Switch to Light"
                      : "🌙 Switch to Dark"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default FacultyProfile;