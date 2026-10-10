import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyAnnouncements.css";

const API_URL = "/api";

function FacultyAnnouncements({ darkMode, toggleTheme }) {
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target: "All Students",
    priority: "Normal",
  });

  const [error, setError] = useState("");

  const token = localStorage.getItem("auth-token");

  // ==============================
  // LOAD ANNOUNCEMENTS
  // ==============================

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/announcements`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load announcements."
        );
      }

      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // ==============================
  // INPUT CHANGE
  // ==============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // CREATE ANNOUNCEMENT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter announcement title.");
      return;
    }

    if (!formData.message.trim()) {
      alert("Please enter announcement message.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/announcements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            createdByName:
              localStorage.getItem("user-name") ||
              "Faculty",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create announcement."
        );
      }

      alert("Announcement created successfully.");

      setFormData({
        title: "",
        message: "",
        target: "All Students",
        priority: "Normal",
      });

      setShowForm(false);

      loadAnnouncements();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ==============================
  // DELETE
  // ==============================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/announcements/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete announcement."
        );
      }

      loadAnnouncements();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ==============================
  // DATE FORMAT
  // ==============================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem("placement-login");
    localStorage.removeItem("user-role");
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-id");
    localStorage.removeItem("user-name");
    localStorage.removeItem("user-email");
    localStorage.removeItem("faculty-id");

    navigate("/");
  };

  return (
    <div
      className={`faculty-announcements-page ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      {/* ==============================
          SIDEBAR
      ============================== */}

      <aside className="announcement-sidebar">
        <div className="announcement-logo">
          <div className="announcement-logo-icon">
            {"</>"}
          </div>

          <div>
            <h2>CodeIT</h2>
            <p>FACULTY PORTAL</p>
          </div>
        </div>

        <div className="announcement-menu">
          <p className="announcement-menu-title">
            MENU
          </p>

          <button
            onClick={() =>
              navigate("/faculty-dashboard")
            }
          >
            <span>🏠</span>
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/faculty-students")
            }
          >
            <span>👨‍🎓</span>
            Students
          </button>

          <button
            onClick={() =>
              navigate("/faculty-exams")
            }
          >
            <span>📝</span>
            Exams
          </button>

          <button
            onClick={() =>
              navigate("/faculty-questions")
            }
          >
            <span>❓</span>
            Question Bank
          </button>

          <button
            onClick={() =>
              navigate("/faculty-results")
            }
          >
            <span>📊</span>
            Results
          </button>

          <button
            onClick={() =>
              navigate("/faculty-analytics")
            }
          >
            <span>📈</span>
            Analytics
          </button>

          <button
            className="active"
            onClick={() =>
              navigate("/faculty-announcements")
            }
          >
            <span>📢</span>
            Announcements
          </button>
        </div>

        <div className="announcement-sidebar-bottom">
          <button
            className="announcement-logout"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ==============================
          MAIN CONTENT
      ============================== */}

      <main className="announcement-main">
        {/* HEADER */}

        <header className="announcement-header">
          <div>
            <p>FACULTY PORTAL</p>

            <h1>Announcements</h1>

            <span>
              Share important updates and
              notifications with students.
            </span>
          </div>

          <div className="announcement-header-actions">
            <button
              className="announcement-theme"
              onClick={toggleTheme}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button className="announcement-notification">
              🔔
            </button>

            <div className="announcement-profile">
              <div className="announcement-avatar">
                👨‍🏫
              </div>

              <div>
                <strong>
                  {localStorage.getItem("user-name") ||
                    "Faculty"}
                </strong>

                <span>Faculty</span>
              </div>
            </div>
          </div>
        </header>

        {/* ==============================
            PAGE TOP
        ============================== */}

        <section className="announcement-top">
          <div>
            <h2>Manage Announcements</h2>

            <p>
              Create and manage announcements for
              students.
            </p>
          </div>

          <button
            className="create-announcement-button"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            <span>➕</span>
            Create Announcement
          </button>
        </section>

        {/* ==============================
            CREATE FORM
        ============================== */}

        {showForm && (
          <section className="announcement-form-card">
            <div className="form-card-header">
              <div>
                <h2>
                  Create New Announcement
                </h2>

                <p>
                  Send an important message to
                  students.
                </p>
              </div>

              <button
                className="close-form"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Announcement Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter announcement title"
                />
              </div>

              <div className="form-group">
                <label>
                  Message
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your announcement..."
                  rows="5"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Target Audience
                  </label>

                  <select
                    name="target"
                    value={formData.target}
                    onChange={handleChange}
                  >
                    <option>
                      All Students
                    </option>

                    <option>
                      Faculty
                    </option>

                    <option>
                      Specific Student
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option>
                      Normal
                    </option>

                    <option>
                      Important
                    </option>

                    <option>
                      Urgent
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="publish-button"
                >
                  📢 Publish Announcement
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ==============================
            ERROR
        ============================== */}

        {error && (
          <div className="announcement-error">
            <strong>Error:</strong> {error}

            <button
              onClick={loadAnnouncements}
            >
              Retry
            </button>
          </div>
        )}

        {/* ==============================
            ANNOUNCEMENTS
        ============================== */}

        <section className="announcement-list-section">
          <div className="section-title">
            <div>
              <h2>
                Recent Announcements
              </h2>

              <p>
                {announcements.length} announcement
                {announcements.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={loadAnnouncements}
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div className="announcement-empty">
              <div className="loading-icon">
                ⏳
              </div>

              <h3>
                Loading announcements...
              </h3>
            </div>
          ) : announcements.length === 0 ? (
            <div className="announcement-empty">
              <div className="empty-icon">
                📢
              </div>

              <h3>
                No announcements yet
              </h3>

              <p>
                Create your first announcement
                to notify students.
              </p>

              <button
                onClick={() =>
                  setShowForm(true)
                }
              >
                Create Announcement
              </button>
            </div>
          ) : (
            <div className="announcement-list">
              {announcements.map(
                (announcement) => (
                  <article
                    className={`announcement-card priority-${announcement.priority.toLowerCase()}`}
                    key={announcement._id}
                  >
                    <div className="announcement-card-icon">
                      {announcement.priority ===
                      "Urgent"
                        ? "🚨"
                        : announcement.priority ===
                          "Important"
                        ? "⚠️"
                        : "📢"}
                    </div>

                    <div className="announcement-card-content">
                      <div className="announcement-card-top">
                        <div>
                          <h3>
                            {announcement.title}
                          </h3>

                          <div className="announcement-meta">
                            <span>
                              👤{" "}
                              {announcement.createdByName ||
                                "Faculty"}
                            </span>

                            <span>
                              🕒{" "}
                              {formatDate(
                                announcement.createdAt
                              )}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`priority-badge ${announcement.priority.toLowerCase()}`}
                        >
                          {announcement.priority}
                        </span>
                      </div>

                      <p className="announcement-message">
                        {announcement.message}
                      </p>

                      <div className="announcement-card-footer">
                        <span>
                          👥{" "}
                          {announcement.target}
                        </span>

                        <button
                          className="delete-announcement"
                          onClick={() =>
                            handleDelete(
                              announcement._id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default FacultyAnnouncements;