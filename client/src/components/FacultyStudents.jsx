import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyStudents.css";

const API_URL = "/api";

function FacultyStudents({
  darkMode,
  toggleTheme,
}) {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState(null);

  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/users/students`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load students."
        );
      }

      setStudents(
        Array.isArray(data.students)
          ? data.students
          : []
      );
    } catch (error) {
      console.error(
        "❌ Student loading error:",
        error
      );

      alert(
        error.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredStudents = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return students;
    }

    return students.filter((student) => {
      return (
        student.name
          ?.toLowerCase()
          .includes(value) ||
        student.email
          ?.toLowerCase()
          .includes(value) ||
        student.studentId
          ?.toLowerCase()
          .includes(value) ||
        student.department
          ?.toLowerCase()
          .includes(value) ||
        student.course
          ?.toLowerCase()
          .includes(value)
      );
    });
  }, [students, search]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem(
      "placement-login"
    );

    localStorage.removeItem(
      "auth-token"
    );

    localStorage.removeItem(
      "user-role"
    );

    navigate("/login");
  };

  // ==========================================
  // INITIALS
  // ==========================================

  const getInitials = (name) => {
    if (!name) {
      return "ST";
    }

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div
      className={`faculty-students-page ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside className="faculty-sidebar">
        <div className="faculty-sidebar-brand">
          <div className="faculty-sidebar-logo">
            C
          </div>

          <div>
            <h2>CodeIT</h2>
            <span>FACULTY PORTAL</span>
          </div>
        </div>

        <nav className="faculty-sidebar-nav">
          <button
            onClick={() =>
              navigate("/faculty-dashboard")
            }
          >
            <span>▦</span>
            Dashboard
          </button>

          <button className="active">
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
            Questions
          </button>

          <button
            onClick={() =>
              navigate("/faculty-results")
            }
          >
            <span>📊</span>
            Results
          </button>
        </nav>

        <div className="faculty-sidebar-bottom">
          <button
            onClick={toggleTheme}
            className="theme-button"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      {/* ========================================
          MAIN
      ======================================== */}

      <main className="faculty-students-main">
        <header className="faculty-students-header">
          <div>
            <h1>Students</h1>
            <p>
              View and manage registered
              students.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadStudents}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </header>

        {/* ========================================
            STATISTICS
        ======================================== */}

        <section className="student-stats">
          <div className="student-stat-card">
            <div className="stat-icon">👨‍🎓</div>

            <div>
              <span>Total Students</span>
              <strong>
                {students.length}
              </strong>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="stat-icon">💻</div>

            <div>
              <span>Department</span>
              <strong>
                {students.filter(
                  (student) =>
                    student.department ===
                    "Information Technology"
                ).length}
              </strong>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="stat-icon">🎓</div>

            <div>
              <span>B.Tech Students</span>
              <strong>
                {students.filter(
                  (student) =>
                    student.course === "B.Tech"
                ).length}
              </strong>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="stat-icon">✓</div>

            <div>
              <span>Registered</span>
              <strong>
                {students.length}
              </strong>
            </div>
          </div>
        </section>

        {/* ========================================
            TABLE CARD
        ======================================== */}

        <section className="students-table-card">
          <div className="students-table-header">
            <div>
              <h2>Registered Students</h2>
              <p>
                {filteredStudents.length} student
                {filteredStudents.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>

            <div className="student-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          {loading ? (
            <div className="students-loading">
              <div className="loading-spinner"></div>

              <p>
                Loading students...
              </p>
            </div>
          ) : filteredStudents.length ===
            0 ? (
            <div className="students-empty">
              <div>👨‍🎓</div>

              <h3>
                No students found
              </h3>

              <p>
                {students.length === 0
                  ? "No students have registered yet."
                  : "Try a different search."}
              </p>
            </div>
          ) : (
            <div className="students-table-wrapper">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Registration ID</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map(
                    (student) => (
                      <tr
                        key={student._id}
                      >
                        <td>
                          <div className="student-name-cell">
                            <div className="student-avatar">
                              {getInitials(
                                student.name
                              )}
                            </div>

                            <div>
                              <strong>
                                {student.name ||
                                  "Unnamed Student"}
                              </strong>

                              <span>
                                Student
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="student-id">
                            {student.studentId ||
                              "N/A"}
                          </span>
                        </td>

                        <td>
                          {student.email ||
                            "N/A"}
                        </td>

                        <td>
                          {student.department ||
                            "N/A"}
                        </td>

                        <td>
                          {student.course ||
                            "N/A"}
                        </td>

                        <td>
                          {student.year ||
                            "N/A"}
                        </td>

                        <td>
                          <button
                            className="view-button"
                            onClick={() =>
                              setSelectedStudent(
                                student
                              )
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* ========================================
          STUDENT DETAILS MODAL
      ======================================== */}

      {selectedStudent && (
        <div
          className="student-modal-overlay"
          onClick={() =>
            setSelectedStudent(null)
          }
        >
          <div
            className="student-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="student-modal-header">
              <div>
                <h2>Student Details</h2>
                <p>
                  Registered student
                  information
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedStudent(null)
                }
              >
                ×
              </button>
            </div>

            <div className="student-profile-preview">
              <div className="large-student-avatar">
                {getInitials(
                  selectedStudent.name
                )}
              </div>

              <div>
                <h3>
                  {selectedStudent.name}
                </h3>

                <p>
                  {selectedStudent.email}
                </p>
              </div>
            </div>

            <div className="student-details-grid">
              <div>
                <span>
                  Registration ID
                </span>

                <strong>
                  {selectedStudent.studentId ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>Department</span>

                <strong>
                  {selectedStudent.department ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>Course</span>

                <strong>
                  {selectedStudent.course ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>Year</span>

                <strong>
                  {selectedStudent.year ||
                    "N/A"}
                </strong>
              </div>
            </div>

            <div className="student-modal-footer">
              <button
                onClick={() =>
                  setSelectedStudent(null)
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyStudents;