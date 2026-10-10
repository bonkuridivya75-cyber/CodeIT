import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentProfile.css";

const API_URL = "/api";

const StudentProfile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    studentId: "",
    email: "",
    department: "Information Technology",
    course: "B.Tech",
    year: "3rd Year",
  });

  const [editProfile, setEditProfile] = useState(profile);

  // ==============================
  // FETCH PROFILE FROM MONGODB
  // ==============================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const email = localStorage.getItem("user-email");

      if (!email) {
        alert("Student login information not found.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/student-profile/${encodeURIComponent(email)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load profile");
      }

      const user = data.user;

      const profileData = {
        name: user.name || "",
        studentId: user.studentId || "",
        email: user.email || email,
        department:
          user.department || "Information Technology",
        course: user.course || "B.Tech",
        year: user.year || "3rd Year",
      };

      setProfile(profileData);
      setEditProfile(profileData);

      // Keep login name updated
      localStorage.setItem("user-name", user.name || "");
    } catch (error) {
      console.error("Profile fetch error:", error);

      alert("Unable to load student profile.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // HANDLE INPUT
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // EDIT
  // ==============================

  const handleEdit = () => {
    setEditProfile(profile);
    setIsEditing(true);
  };

  // ==============================
  // CANCEL
  // ==============================

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  // ==============================
  // SAVE TO MONGODB
  // ==============================

  const handleSave = async () => {
    try {
      if (!editProfile.name.trim()) {
        alert("Please enter your name.");
        return;
      }

      const email = localStorage.getItem("user-email");

      if (!email) {
        alert("Student email not found.");
        return;
      }

      setSaving(true);

      const response = await fetch(
        `${API_URL}/student-profile/${encodeURIComponent(email)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editProfile.name,
            studentId: editProfile.studentId,
            department: editProfile.department,
            course: editProfile.course,
            year: editProfile.year,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Profile update failed");
      }

      const user = data.user;

      const updatedProfile = {
        name: user.name || "",
        studentId: user.studentId || "",
        email: user.email || email,
        department:
          user.department || "Information Technology",
        course: user.course || "B.Tech",
        year: user.year || "3rd Year",
      };

      setProfile(updatedProfile);
      setEditProfile(updatedProfile);
      setIsEditing(false);

      // Update local login name
      localStorage.setItem("user-name", updatedProfile.name);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);

      alert(error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem("placement-login");
    localStorage.removeItem("user-role");
    localStorage.removeItem("user-email");
    localStorage.removeItem("user-name");
    localStorage.removeItem("user-id");

    navigate("/login");
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="student-profile-page">
        <div className="student-profile-card">
          <div className="profile-loading">
            Loading student profile...
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================

  return (
    <div className="student-profile-page">

      {/* TOP BAR */}
      <div className="profile-topbar">

        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/student-dashboard")}
        >
          ← Back to Dashboard
        </button>

        <button
          className="profile-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* PROFILE CARD */}
      <div className="student-profile-card">

        {/* HEADER */}
        <div className="profile-header">

          <div className="profile-avatar">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : "S"}
          </div>

          <h1>Student Profile</h1>

          <p>
            View and manage your personal and academic information
          </p>

        </div>

        {/* PROFILE CONTENT */}
        <div className="profile-content">

          {/* NAME */}
          <div className="profile-field">
            <label>Full Name</label>

            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editProfile.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            ) : (
              <div className="profile-value">
                {profile.name || "Not provided"}
              </div>
            )}
          </div>

          {/* STUDENT ID */}
          <div className="profile-field">
            <label>Student ID</label>

            {isEditing ? (
              <input
                type="text"
                name="studentId"
                value={editProfile.studentId}
                onChange={handleChange}
                placeholder="Enter student ID"
              />
            ) : (
              <div className="profile-value">
                {profile.studentId || "Not provided"}
              </div>
            )}
          </div>

          {/* EMAIL */}
          <div className="profile-field">
            <label>Email</label>

            <div className="profile-value email-value">
              {profile.email}
            </div>

            {isEditing && (
              <small className="readonly-text">
                Email cannot be changed here.
              </small>
            )}
          </div>

          {/* DEPARTMENT */}
          <div className="profile-field">
            <label>Department</label>

            {isEditing ? (
              <select
                name="department"
                value={editProfile.department}
                onChange={handleChange}
              >
                <option value="Information Technology">
                  Information Technology
                </option>

                <option value="Computer Science Engineering">
                  Computer Science Engineering
                </option>

                <option value="Artificial Intelligence">
                  Artificial Intelligence
                </option>

                <option value="Electronics and Communication Engineering">
                  Electronics and Communication Engineering
                </option>

                <option value="Electrical and Electronics Engineering">
                  Electrical and Electronics Engineering
                </option>

                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>

                <option value="Civil Engineering">
                  Civil Engineering
                </option>
              </select>
            ) : (
              <div className="profile-value">
                {profile.department}
              </div>
            )}
          </div>

          {/* COURSE */}
          <div className="profile-field">
            <label>Course</label>

            {isEditing ? (
              <select
                name="course"
                value={editProfile.course}
                onChange={handleChange}
              >
                <option value="B.Tech">B.Tech</option>
                <option value="B.E">B.E</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MCA">MCA</option>
              </select>
            ) : (
              <div className="profile-value">
                {profile.course}
              </div>
            )}
          </div>

          {/* YEAR */}
          <div className="profile-field">
            <label>Year</label>

            {isEditing ? (
              <select
                name="year"
                value={editProfile.year}
                onChange={handleChange}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            ) : (
              <div className="profile-value">
                {profile.year}
              </div>
            )}
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="profile-actions">

          {!isEditing ? (
            <button
              className="edit-profile-btn"
              onClick={handleEdit}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <>
              <button
                className="save-profile-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "✓ Save Changes"}
              </button>

              <button
                className="cancel-profile-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                ✕ Cancel
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default StudentProfile;