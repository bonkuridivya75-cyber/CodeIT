import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyProfile.css";

function MyProfile() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Student Name",
    email: "student@codeit.com",
    phone: "+91 98765 43210",
    location: "India",
    college: "Your College",
    branch: "Computer Science Engineering",
    year: "B.Tech - 3rd Year",
    about:
      "Passionate computer science student interested in software development, problem solving and emerging technologies.",
  });

  const [skills, setSkills] = useState([
    "Java",
    "Python",
    "C",
    "React",
    "JavaScript",
    "Data Structures",
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    const skill = window.prompt("Enter a new skill:");

    if (skill && skill.trim()) {
      setSkills((prev) => [...prev, skill.trim()]);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills((prev) =>
      prev.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleEdit = () => {
    if (isEditing) {
      alert("Profile updated successfully!");
    }

    setIsEditing((prev) => !prev);
  };

  return (
    <div className="profile-page">

      {/* ================= NAVBAR ================= */}

      <nav className="profile-navbar">

        <div
          className="profile-logo"
          onClick={() => navigate("/student-dashboard")}
        >
          <span>&lt;</span>
          CODEIT
          <span>/&gt;</span>
        </div>

        <div className="profile-nav-title">
          MY PROFILE
        </div>

        <button
          type="button"
          className="profile-dashboard-btn"
          onClick={() => navigate("/student-dashboard")}
        >
          <span className="dashboard-arrow">←</span>
          <span>Dashboard</span>
        </button>

      </nav>

      {/* ================= MAIN ================= */}

      <main className="profile-main">

        {/* ================= HEADER ================= */}

        <section className="profile-header">

          <div>

            <div className="profile-label">
              CODEIT STUDENT PROFILE
            </div>

            <h1>
              My <span>Profile</span>
            </h1>

            <p>
              Manage your personal information, academic details,
              skills and achievements.
            </p>

          </div>

          <button
            type="button"
            className={`profile-edit-btn ${
              isEditing ? "saving" : ""
            }`}
            onClick={handleEdit}
          >
            <span className="btn-icon">
              {isEditing ? "✓" : "✦"}
            </span>

            <span>
              {isEditing ? "Save Profile" : "Edit Profile"}
            </span>

            <span className="btn-arrow">
              →
            </span>
          </button>

        </section>

        {/* ================= PROFILE CARD ================= */}

        <section className="profile-main-card">

          <div className="profile-avatar">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div className="profile-basic">

            <h2>{profile.name}</h2>

            <p>{profile.branch}</p>

            <div className="profile-meta">

              <span>
                🎓 {profile.year}
              </span>

              <span>
                📍 {profile.location}
              </span>

              <span className="verified">
                ● Verified Student
              </span>

            </div>

          </div>

          <div className="profile-complete">

            <strong>85%</strong>

            <span>
              Profile Complete
            </span>

            <div className="completion-bar">
              <div className="completion-fill"></div>
            </div>

          </div>

        </section>

        {/* ================= PERSONAL ================= */}

        <section className="profile-section">

          <div className="section-heading">

            <span className="section-number">
              01
            </span>

            <div>
              <small>PERSONAL</small>
              <h2>Personal Information</h2>
            </div>

          </div>

          <div className="profile-fields">

            <div className="profile-field">

              <label>Full Name</label>

              {isEditing ? (
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              ) : (
                <div className="field-value">
                  {profile.name}
                </div>
              )}

            </div>

            <div className="profile-field">

              <label>Email Address</label>

              {isEditing ? (
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              ) : (
                <div className="field-value">
                  {profile.email}
                </div>
              )}

            </div>

            <div className="profile-field">

              <label>Phone Number</label>

              {isEditing ? (
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              ) : (
                <div className="field-value">
                  {profile.phone}
                </div>
              )}

            </div>

            <div className="profile-field">

              <label>Location</label>

              {isEditing ? (
                <input
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                />
              ) : (
                <div className="field-value">
                  {profile.location}
                </div>
              )}

            </div>

          </div>

        </section>

        {/* ================= EDUCATION ================= */}

        <section className="profile-section">

          <div className="section-heading">

            <span className="section-number">
              02
            </span>

            <div>
              <small>EDUCATION</small>
              <h2>Academic Details</h2>
            </div>

          </div>

          <div className="profile-fields">

            <div className="profile-field">

              <label>College / University</label>

              {isEditing ? (
                <input
                  name="college"
                  value={profile.college}
                  onChange={handleChange}
                />
              ) : (
                <div className="field-value">
                  {profile.college}
                </div>
              )}

            </div>

            <div className="profile-field">

              <label>Branch</label>

              {isEditing ? (
                <input
                  name="branch"
                  value={profile.branch}
                  onChange={handleChange}
                />
              ) : (
                <div className="field-value">
                  {profile.branch}
                </div>
              )}

            </div>

            <div className="profile-field">

              <label>Year</label>

              {isEditing ? (
                <input
                  name="year"
                  value={profile.year}
                  onChange={handleChange}
                />
              ) : (
                <div className="field-value">
                  {profile.year}
                </div>
              )}

            </div>

          </div>

        </section>

        {/* ================= ABOUT ================= */}

        <section className="profile-section">

          <div className="section-heading">

            <span className="section-number">
              03
            </span>

            <div>
              <small>ABOUT ME</small>
              <h2>About Me</h2>
            </div>

          </div>

          {isEditing ? (
            <textarea
              className="about-input"
              name="about"
              value={profile.about}
              onChange={handleChange}
            />
          ) : (
            <p className="about-text">
              {profile.about}
            </p>
          )}

        </section>

        {/* ================= SKILLS ================= */}

        <section className="profile-section">

          <div className="section-heading">

            <span className="section-number">
              04
            </span>

            <div>
              <small>TECHNICAL</small>
              <h2>Skills & Technologies</h2>
            </div>

          </div>

          <div className="skills-wrapper">

            {skills.map((skill, index) => (
              <div
                className="skill-chip"
                key={`${skill}-${index}`}
              >
                <span>#</span>
                {skill}

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {isEditing && (
              <button
                type="button"
                className="add-skill-btn"
                onClick={addSkill}
              >
                + Add Skill
              </button>
            )}

          </div>

        </section>

        {/* ================= ACHIEVEMENTS ================= */}

        <section className="profile-section">

          <div className="section-heading">

            <span className="section-number">
              05
            </span>

            <div>
              <small>ACHIEVEMENTS</small>
              <h2>Achievements</h2>
            </div>

          </div>

          <div className="achievement-grid">

            <div className="achievement-card">
              <div className="achievement-icon">🏆</div>
              <strong>Problem Solver</strong>
              <span>50+ coding problems solved</span>
            </div>

            <div className="achievement-card">
              <div className="achievement-icon">⚡</div>
              <strong>Fast Learner</strong>
              <span>Active coding practice</span>
            </div>

            <div className="achievement-card">
              <div className="achievement-icon">🎯</div>
              <strong>Career Ready</strong>
              <span>Profile 85% complete</span>
            </div>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="profile-footer">

        <div>
          &lt;CODE<span>IT</span>/&gt;
        </div>

        <p>
          Code. Practice. Learn. Grow.
        </p>

      </footer>

    </div>
  );
}

export default MyProfile;