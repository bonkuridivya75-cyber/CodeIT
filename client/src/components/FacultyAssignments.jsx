import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./FacultyAssignments.css";

const API_URL = "/api";

const FacultyAssignments = ({
  darkMode,
  toggleTheme,
}) => {
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    dueDate: "",
    totalMarks: "",
    status: "Active",
  });

  const getToken = () => {
    return localStorage.getItem("auth-token");
  };

  /* =========================
     LOAD ASSIGNMENTS
  ========================= */

  const fetchAssignments = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/assignments`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load assignments."
          );
        }

        setAssignments(data.assignments || []);
      } catch (err) {
        console.error(
          "Fetch assignments error:",
          err
        );

        setError(
          err.message ||
            "Failed to load assignments."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================
     OPEN CREATE MODAL
  ========================= */

  const openCreateModal = () => {
    setEditingId(null);

    setFormData({
      title: "",
      subject: "",
      description: "",
      dueDate: "",
      totalMarks: "",
      status: "Active",
    });

    setShowModal(true);
  };

  /* =========================
     OPEN EDIT MODAL
  ========================= */

  const openEditModal = (assignment) => {
    setEditingId(assignment._id);

    setFormData({
      title: assignment.title || "",
      subject: assignment.subject || "",
      description:
        assignment.description || "",
      dueDate: assignment.dueDate || "",
      totalMarks:
        assignment.totalMarks || "",
      status:
        assignment.status || "Active",
    });

    setShowModal(true);
  };

  /* =========================
     CLOSE MODAL
  ========================= */

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);

    setFormData({
      title: "",
      subject: "",
      description: "",
      dueDate: "",
      totalMarks: "",
      status: "Active",
    });
  };

  /* =========================
     CREATE / UPDATE
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.subject.trim() ||
      !formData.dueDate ||
      !formData.totalMarks
    ) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${API_URL}/assignments/${editingId}`
        : `${API_URL}/assignments`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          subject: formData.subject.trim(),
          description:
            formData.description.trim(),
          dueDate: formData.dueDate,
          totalMarks: Number(
            formData.totalMarks
          ),
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save assignment."
        );
      }

      alert(
        editingId
          ? "Assignment updated successfully."
          : "Assignment created successfully."
      );

      closeModal();
      fetchAssignments();
    } catch (err) {
      console.error(
        "Save assignment error:",
        err
      );

      alert(
        err.message ||
          "Failed to save assignment."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/assignments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete assignment."
        );
      }

      setAssignments((previous) =>
        previous.filter(
          (assignment) =>
            assignment._id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete assignment error:",
        err
      );

      alert(
        err.message ||
          "Failed to delete assignment."
      );
    }
  };

  /* =========================
     FILTER
  ========================= */

  const filteredAssignments = useMemo(() => {
    const search =
      searchTerm.toLowerCase().trim();

    return assignments.filter(
      (assignment) => {
        const title =
          assignment.title
            ?.toLowerCase() || "";

        const subject =
          assignment.subject
            ?.toLowerCase() || "";

        const description =
          assignment.description
            ?.toLowerCase() || "";

        const matchesSearch =
          !search ||
          title.includes(search) ||
          subject.includes(search) ||
          description.includes(search);

        const matchesStatus =
          statusFilter === "All" ||
          assignment.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    assignments,
    searchTerm,
    statusFilter,
  ]);

  /* =========================
     STATISTICS
  ========================= */

  const statistics = useMemo(() => {
    const total = assignments.length;

    const active = assignments.filter(
      (item) => item.status === "Active"
    ).length;

    const closed = assignments.filter(
      (item) => item.status === "Closed"
    ).length;

    const totalMarks = assignments.reduce(
      (sum, item) =>
        sum +
        Number(item.totalMarks || 0),
      0
    );

    return {
      total,
      active,
      closed,
      totalMarks,
    };
  }, [assignments]);

  /* =========================
     DATE FORMAT
  ========================= */

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================
     DUE DATE STATUS
  ========================= */

  const getDueDateStatus = (date) => {
    if (!date) return "normal";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(
      `${date}T00:00:00`
    );

    if (dueDate < today) {
      return "overdue";
    }

    const difference =
      dueDate.getTime() -
      today.getTime();

    const daysLeft =
      difference /
      (1000 * 60 * 60 * 24);

    if (daysLeft <= 2) {
      return "soon";
    }

    return "normal";
  };

  /* =========================
     NAVIGATION
  ========================= */

  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <div
      className={`faculty-assignments-page ${
        darkMode
          ? "assignments-dark"
          : ""
      }`}
    >
      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="assignments-sidebar">
        <div className="assignments-brand">
          <div className="assignments-logo">
            C
          </div>

          <div>
            <h2>CodeIT</h2>
            <span>
              FACULTY PORTAL
            </span>
          </div>
        </div>

        <div className="assignments-menu-title">
          FACULTY MENU
        </div>

        <nav className="assignments-nav">
          <button
            className="assignment-nav-item"
            onClick={() =>
              navigateTo(
                "/faculty-dashboard"
              )
            }
          >
            <span>🏠</span>
            Dashboard
          </button>

          <button
            className="assignment-nav-item"
            onClick={() =>
              navigateTo(
                "/faculty-students"
              )
            }
          >
            <span>👨‍🎓</span>
            Students
          </button>

          <button
            className="assignment-nav-item"
            onClick={() =>
              navigateTo(
                "/faculty-exams"
              )
            }
          >
            <span>📝</span>
            Exams
          </button>

          <button
            className="assignment-nav-item"
            onClick={() =>
              navigateTo(
                "/faculty-questions"
              )
            }
          >
            <span>❓</span>
            Question Bank
          </button>

          <button
            className="assignment-nav-item"
            onClick={() =>
              navigateTo(
                "/faculty-results"
              )
            }
          >
            <span>📊</span>
            Results
          </button>

          <button
            className="assignment-nav-item"
            onClick={() =>
              navigateTo(
                "/faculty-analytics"
              )
            }
          >
            <span>📈</span>
            Analytics
          </button>

          <button
            className="assignment-nav-item"
            onClick={() =>
              navigateTo(
                "/faculty-live-monitoring"
              )
            }
          >
            <span>🔴</span>
            Live Monitoring
          </button>

          <button
            className="assignment-nav-item"
            onClick={() =>
              navigateTo(
                "/faculty-leaderboard"
              )
            }
          >
            <span>🏆</span>
            Leaderboard
          </button>

          <button className="assignment-nav-item active">
            <span>📚</span>
            Assignments
          </button>

          <button
            className="assignment-nav-item"
            onClick={() =>
              navigateTo(
                "/faculty-announcements"
              )
            }
          >
            <span>📢</span>
            Announcements
          </button>

          <button
            className="assignment-nav-item"
            onClick={() =>
              navigateTo(
                "/faculty-schedule"
              )
            }
          >
            <span>📅</span>
            Schedule
          </button>
        </nav>

        <div className="assignments-sidebar-bottom">
          <button
            className="assignment-nav-item"
            onClick={toggleTheme}
          >
            <span>
              {darkMode ? "☀️" : "🌙"}
            </span>

            {darkMode
              ? "Light Mode"
              : "Dark Mode"}
          </button>

          <button
            className="assignment-nav-item logout"
            onClick={() => {
              localStorage.clear();
              window.location.href =
                "/login";
            }}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="assignments-main">
        {/* HEADER */}

        <header className="assignments-header">
          <div>
            <div className="assignments-breadcrumb">
              Faculty / Assignments
            </div>

            <h1>
              Assignment Management
            </h1>

            <p>
              Create and manage assignments
              for students.
            </p>
          </div>

          <button
            className="create-assignment-btn"
            onClick={openCreateModal}
          >
            <span>＋</span>
            Create Assignment
          </button>
        </header>

        {/* =========================
            STATISTICS
        ========================= */}

        <section className="assignment-stats">
          <div className="assignment-stat-card">
            <div className="assignment-stat-icon blue">
              📚
            </div>

            <div>
              <span>
                Total Assignments
              </span>

              <strong>
                {statistics.total}
              </strong>
            </div>
          </div>

          <div className="assignment-stat-card">
            <div className="assignment-stat-icon green">
              ✓
            </div>

            <div>
              <span>
                Active Assignments
              </span>

              <strong>
                {statistics.active}
              </strong>
            </div>
          </div>

          <div className="assignment-stat-card">
            <div className="assignment-stat-icon gray">
              ✓
            </div>

            <div>
              <span>
                Closed Assignments
              </span>

              <strong>
                {statistics.closed}
              </strong>
            </div>
          </div>

          <div className="assignment-stat-card">
            <div className="assignment-stat-icon orange">
              📝
            </div>

            <div>
              <span>
                Total Marks
              </span>

              <strong>
                {statistics.totalMarks}
              </strong>
            </div>
          </div>
        </section>

        {/* =========================
            TOOLBAR
        ========================= */}

        <section className="assignments-toolbar">
          <div className="assignment-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />
          </div>

          <div className="assignment-filter">
            <label>
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Closed">
                Closed
              </option>
            </select>
          </div>

          <div className="assignment-result-count">
            Showing{" "}
            <strong>
              {filteredAssignments.length}
            </strong>{" "}
            assignments
          </div>
        </section>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="assignments-error">
            <div>
              <strong>
                Unable to load assignments
              </strong>

              <p>{error}</p>
            </div>

            <button
              onClick={fetchAssignments}
            >
              Try Again
            </button>
          </div>
        )}

        {/* =========================
            LOADING
        ========================= */}

        {loading ? (
          <div className="assignments-loading">
            <div className="assignment-spinner"></div>

            <h3>
              Loading assignments...
            </h3>

            <p>
              Please wait while assignment
              data is loaded.
            </p>
          </div>
        ) : filteredAssignments.length ===
          0 ? (
          /* =========================
             EMPTY
          ========================= */

          <div className="assignments-empty">
            <div className="empty-icon">
              📚
            </div>

            <h3>
              No assignments found
            </h3>

            <p>
              Create your first assignment
              to get started.
            </p>

            <button
              onClick={openCreateModal}
            >
              Create Assignment
            </button>
          </div>
        ) : (
          /* =========================
             ASSIGNMENT TABLE
          ========================= */

          <section className="assignments-table-card">
            <div className="assignments-table-header">
              <div>
                <h2>
                  All Assignments
                </h2>

                <p>
                  Manage student assignments
                  and deadlines.
                </p>
              </div>

              <span>
                {assignments.length} Total
              </span>
            </div>

            <div className="assignments-table-wrapper">
              <table className="assignments-table">
                <thead>
                  <tr>
                    <th>
                      Assignment
                    </th>

                    <th>
                      Subject
                    </th>

                    <th>
                      Due Date
                    </th>

                    <th>
                      Marks
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAssignments.map(
                    (assignment) => {
                      const dueStatus =
                        getDueDateStatus(
                          assignment.dueDate
                        );

                      return (
                        <tr
                          key={
                            assignment._id
                          }
                        >
                          <td>
                            <div className="assignment-info">
                              <div className="assignment-icon">
                                📚
                              </div>

                              <div>
                                <strong>
                                  {
                                    assignment.title
                                  }
                                </strong>

                                {assignment.description && (
                                  <span>
                                    {
                                      assignment.description
                                    }
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="subject-badge">
                              {
                                assignment.subject
                              }
                            </span>
                          </td>

                          <td>
                            <div
                              className={`due-date ${dueStatus}`}
                            >
                              <strong>
                                {formatDate(
                                  assignment.dueDate
                                )}
                              </strong>

                              {dueStatus ===
                                "overdue" && (
                                <span>
                                  Overdue
                                </span>
                              )}

                              {dueStatus ===
                                "soon" && (
                                <span>
                                  Due Soon
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            <strong className="marks-value">
                              {
                                assignment.totalMarks
                              }
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`assignment-status ${
                                assignment.status ===
                                "Active"
                                  ? "active"
                                  : "closed"
                              }`}
                            >
                              <span className="status-dot"></span>

                              {
                                assignment.status
                              }
                            </span>
                          </td>

                          <td>
                            <div className="assignment-actions">
                              <button
                                className="edit-btn"
                                title="Edit"
                                onClick={() =>
                                  openEditModal(
                                    assignment
                                  )
                                }
                              >
                                ✏️
                              </button>

                              <button
                                className="delete-btn"
                                title="Delete"
                                onClick={() =>
                                  handleDelete(
                                    assignment._id
                                  )
                                }
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* =========================
            CREATE / EDIT MODAL
        ========================= */}

        {showModal && (
          <div
            className="assignment-modal-overlay"
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                closeModal();
              }
            }}
          >
            <div className="assignment-modal">
              <div className="assignment-modal-header">
                <div>
                  <h2>
                    {editingId
                      ? "Edit Assignment"
                      : "Create Assignment"}
                  </h2>

                  <p>
                    {editingId
                      ? "Update assignment details."
                      : "Add a new assignment for students."}
                  </p>
                </div>

                <button
                  className="modal-close"
                  onClick={closeModal}
                  disabled={saving}
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="assignment-form"
              >
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Assignment Title
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      placeholder="Example: React Assignment 1"
                      value={
                        formData.title
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Subject
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="subject"
                      placeholder="Example: React JS"
                      value={
                        formData.subject
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Enter assignment description..."
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Due Date
                      <span>*</span>
                    </label>

                    <input
                      type="date"
                      name="dueDate"
                      value={
                        formData.dueDate
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Total Marks
                      <span>*</span>
                    </label>

                    <input
                      type="number"
                      name="totalMarks"
                      min="1"
                      placeholder="Example: 20"
                      value={
                        formData.totalMarks
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Closed">
                      Closed
                    </option>
                  </select>
                </div>

                <div className="assignment-form-footer">
                  <button
                    type="button"
                    className="cancel-assignment-btn"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-assignment-btn"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Assignment"
                      : "Create Assignment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyAssignments;