import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultySchedule.css";

const API_URL = "/api";

function FacultySchedule({ darkMode, toggleTheme }) {
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    examType: "MCQ",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    description: "",
    target: "All Students",
    status: "Scheduled",
  });

  const token = localStorage.getItem("auth-token");

  // ==========================================
  // LOAD SCHEDULES
  // ==========================================

  const loadSchedules = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/schedules`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load schedules."
        );
      }

      setSchedules(data.schedules || []);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      title: "",
      examType: "MCQ",
      date: "",
      startTime: "",
      endTime: "",
      room: "",
      description: "",
      target: "All Students",
      status: "Scheduled",
    });

    setEditingId(null);
  };

  // ==========================================
  // OPEN CREATE FORM
  // ==========================================

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  // ==========================================
  // EDIT SCHEDULE
  // ==========================================

  const handleEdit = (schedule) => {
    setEditingId(schedule._id);

    setFormData({
      title: schedule.title || "",
      examType: schedule.examType || "MCQ",
      date: schedule.date || "",
      startTime: schedule.startTime || "",
      endTime: schedule.endTime || "",
      room: schedule.room || "",
      description: schedule.description || "",
      target: schedule.target || "All Students",
      status: schedule.status || "Scheduled",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime
    ) {
      alert(
        "Please fill Title, Date, Start Time and End Time."
      );
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/schedules/${editingId}`
        : `${API_URL}/schedules`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          createdBy:
            localStorage.getItem("user-name") ||
            "Faculty",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save schedule."
        );
      }

      alert(
        editingId
          ? "Schedule updated successfully."
          : "Schedule created successfully."
      );

      setShowForm(false);
      resetForm();
      loadSchedules();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this schedule?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/schedules/${id}`,
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
            "Failed to delete schedule."
        );
      }

      alert("Schedule deleted successfully.");

      loadSchedules();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // GET DAY
  // ==========================================

  const getDay = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString("en-IN", {
      weekday: "short",
    });
  };

  // ==========================================
  // LOGOUT
  // ==========================================

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
      className={`faculty-schedule-page ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside className="schedule-sidebar">
        <div className="schedule-logo">
          <div className="schedule-logo-icon">
            {"</>"}
          </div>

          <div>
            <h2>CodeIT</h2>
            <p>FACULTY PORTAL</p>
          </div>
        </div>

        <div className="schedule-menu">
          <p className="schedule-menu-title">
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
            onClick={() =>
              navigate("/faculty-announcements")
            }
          >
            <span>📢</span>
            Announcements
          </button>

          <button
            className="active"
            onClick={() =>
              navigate("/faculty-schedule")
            }
          >
            <span>📅</span>
            Schedule
          </button>
        </div>

        <div className="schedule-sidebar-bottom">
          <button
            onClick={handleLogout}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="schedule-main">

        {/* HEADER */}

        <header className="schedule-header">
          <div>
            <p>FACULTY PORTAL</p>

            <h1>
              Schedule / Exam Calendar
            </h1>

            <span>
              Plan and manage upcoming
              examinations and events.
            </span>
          </div>

          <div className="schedule-header-right">
            <button
              className="schedule-theme-button"
              onClick={toggleTheme}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button className="schedule-notification-button">
              🔔
            </button>

            <div className="schedule-profile">
              <div className="schedule-avatar">
                👨‍🏫
              </div>

              <div>
                <strong>
                  {localStorage.getItem(
                    "user-name"
                  ) || "Faculty"}
                </strong>

                <span>Faculty</span>
              </div>
            </div>
          </div>
        </header>

        {/* ==========================================
            PAGE TOP
        ========================================== */}

        <section className="schedule-page-top">
          <div>
            <h2>
              Exam Schedule
            </h2>

            <p>
              View, create and manage
              examination schedules.
            </p>
          </div>

          <button
            className="add-schedule-button"
            onClick={openCreateForm}
          >
            ➕ Add Schedule
          </button>
        </section>

        {/* ==========================================
            FORM
        ========================================== */}

        {showForm && (
          <section className="schedule-form-card">
            <div className="schedule-form-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Schedule"
                    : "Create Schedule"}
                </h2>

                <p>
                  Enter examination schedule
                  details below.
                </p>
              </div>

              <button
                className="close-schedule-form"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="schedule-form-grid">

                <div className="schedule-form-group full">
                  <label>
                    Exam / Event Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Example: Java Programming Assessment"
                  />
                </div>

                <div className="schedule-form-group">
                  <label>
                    Exam Type
                  </label>

                  <select
                    name="examType"
                    value={formData.examType}
                    onChange={handleChange}
                  >
                    <option value="MCQ">
                      MCQ
                    </option>

                    <option value="Coding">
                      Coding
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="schedule-form-group">
                  <label>
                    Date *
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

                <div className="schedule-form-group">
                  <label>
                    Start Time *
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>

                <div className="schedule-form-group">
                  <label>
                    End Time *
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>

                <div className="schedule-form-group">
                  <label>
                    Room / Lab
                  </label>

                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    placeholder="Example: Lab 2"
                  />
                </div>

                <div className="schedule-form-group">
                  <label>
                    Target
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
                      Specific Batch
                    </option>
                  </select>
                </div>

                <div className="schedule-form-group">
                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option>
                      Scheduled
                    </option>

                    <option>
                      Completed
                    </option>

                    <option>
                      Cancelled
                    </option>
                  </select>
                </div>

                <div className="schedule-form-group full">
                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter additional information..."
                    rows="4"
                  />
                </div>

              </div>

              <div className="schedule-form-actions">
                <button
                  type="button"
                  className="schedule-cancel-button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="schedule-save-button"
                >
                  {editingId
                    ? "💾 Update Schedule"
                    : "📅 Save Schedule"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ==========================================
            CALENDAR HEADER
        ========================================== */}

        <section className="calendar-section">
          <div className="calendar-section-header">
            <div>
              <h2>
                Upcoming Schedule
              </h2>

              <p>
                {schedules.length} schedule
                {schedules.length !== 1
                  ? "s"
                  : ""}{" "}
                available
              </p>
            </div>

            <button
              className="refresh-schedule"
              onClick={loadSchedules}
            >
              🔄 Refresh
            </button>
          </div>

          {/* ========================================
              LOADING
          ======================================== */}

          {loading ? (
            <div className="schedule-empty">
              <div>⏳</div>
              <h3>
                Loading schedule...
              </h3>
            </div>
          ) : schedules.length === 0 ? (
            <div className="schedule-empty">
              <div>📅</div>

              <h3>
                No schedules available
              </h3>

              <p>
                Create a schedule to display
                examinations here.
              </p>

              <button
                onClick={openCreateForm}
              >
                Add First Schedule
              </button>
            </div>
          ) : (
            <div className="schedule-list">
              {schedules.map((schedule) => (
                <article
                  className={`schedule-card status-${schedule.status.toLowerCase()}`}
                  key={schedule._id}
                >
                  {/* DATE */}

                  <div className="schedule-date-box">
                    <strong>
                      {schedule.date
                        ? new Date(
                            `${schedule.date}T00:00:00`
                          ).getDate()
                        : "--"}
                    </strong>

                    <span>
                      {schedule.date
                        ? new Date(
                            `${schedule.date}T00:00:00`
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                            }
                          )
                        : ""}
                    </span>

                    <small>
                      {getDay(schedule.date)}
                    </small>
                  </div>

                  {/* CONTENT */}

                  <div className="schedule-card-content">
                    <div className="schedule-card-top">
                      <div>
                        <h3>
                          {schedule.title}
                        </h3>

                        <div className="schedule-details">
                          <span>
                            🕒{" "}
                            {schedule.startTime} -{" "}
                            {schedule.endTime}
                          </span>

                          <span>
                            📍{" "}
                            {schedule.room ||
                              "Room not specified"}
                          </span>

                          <span>
                            👥{" "}
                            {schedule.target}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`schedule-status ${schedule.status.toLowerCase()}`}
                      >
                        {schedule.status}
                      </span>
                    </div>

                    <div className="schedule-card-bottom">
                      <div className="schedule-tags">
                        <span
                          className={`exam-type ${schedule.examType.toLowerCase()}`}
                        >
                          {schedule.examType}
                        </span>

                        <span className="schedule-full-date">
                          📅{" "}
                          {formatDate(
                            schedule.date
                          )}
                        </span>
                      </div>

                      <div className="schedule-actions">
                        <button
                          className="edit-schedule"
                          onClick={() =>
                            handleEdit(schedule)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="delete-schedule"
                          onClick={() =>
                            handleDelete(
                              schedule._id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>

                    {schedule.description && (
                      <p className="schedule-description">
                        {schedule.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default FacultySchedule;