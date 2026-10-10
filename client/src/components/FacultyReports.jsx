import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyReports.css";

const API_URL = "/api";

const FacultyReports = ({ darkMode, toggleTheme }) => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [codingSubmissions, setCodingSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeReport, setActiveReport] = useState("overview");

  const [search, setSearch] = useState("");
  const [examType, setExamType] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* =====================================================
     AUTH TOKEN
  ===================================================== */

  const token = localStorage.getItem("auth-token");

  /* =====================================================
     FETCH JSON HELPER
  ===================================================== */

  const fetchData = async (url) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Failed to load ${url}`
      );
    }

    return data;
  };

  /* =====================================================
     LOAD REPORT DATA
  ===================================================== */

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const [
        studentsData,
        resultsData,
        assignmentsData,
        codingData,
      ] = await Promise.all([
        fetchData(`${API_URL}/users/students`),
        fetchData(`${API_URL}/results`),
        fetchData(`${API_URL}/assignments`),
        fetchData(`${API_URL}/coding-submissions`),
      ]);

      setStudents(
        Array.isArray(studentsData)
          ? studentsData
          : studentsData.students ||
            studentsData.data ||
            []
      );

      setResults(
        Array.isArray(resultsData)
          ? resultsData
          : resultsData.results ||
            resultsData.data ||
            []
      );

      setAssignments(
        Array.isArray(assignmentsData)
          ? assignmentsData
          : assignmentsData.assignments ||
            assignmentsData.data ||
            []
      );

      setCodingSubmissions(
        Array.isArray(codingData)
          ? codingData
          : codingData.submissions ||
            codingData.codingSubmissions ||
            codingData.data ||
            []
      );
    } catch (err) {
      console.error("Faculty reports error:", err);

      setError(
        err.message ||
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  /* =====================================================
     HELPERS
  ===================================================== */

  const getDateValue = (item) => {
    return (
      item.submittedAt ||
      item.createdAt ||
      item.updatedAt ||
      item.date ||
      item.dueDate ||
      ""
    );
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const safeNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  };

  const escapeCsv = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    const text = String(value);

    if (
      text.includes(",") ||
      text.includes('"') ||
      text.includes("\n")
    ) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  };

  const matchesDateRange = (item) => {
    const rawDate = getDateValue(item);

    if (!rawDate) {
      return true;
    }

    const date = new Date(rawDate);

    if (Number.isNaN(date.getTime())) {
      return true;
    }

    if (fromDate) {
      const start = new Date(`${fromDate}T00:00:00`);

      if (date < start) {
        return false;
      }
    }

    if (toDate) {
      const end = new Date(`${toDate}T23:59:59`);

      if (date > end) {
        return false;
      }
    }

    return true;
  };

  /* =====================================================
     FILTER RESULTS
  ===================================================== */

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return results.filter((result) => {
      const studentName =
        result.studentName || "";

      const studentEmail =
        result.studentEmail || "";

      const title =
        result.examTitle || "";

      const type =
        result.examType || "";

      const status =
        result.status || "";

      const searchableText = `
        ${studentName}
        ${studentEmail}
        ${title}
        ${type}
        ${status}
      `.toLowerCase();

      const searchMatch =
        !query ||
        searchableText.includes(query);

      const typeMatch =
        examType === "All" ||
        type === examType;

      const statusMatch =
        statusFilter === "All" ||
        status === statusFilter;

      const dateMatch =
        matchesDateRange(result);

      return (
        searchMatch &&
        typeMatch &&
        statusMatch &&
        dateMatch
      );
    });
  }, [
    results,
    search,
    examType,
    statusFilter,
    fromDate,
    toDate,
  ]);

  /* =====================================================
     FILTER ASSIGNMENTS
  ===================================================== */

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignments.filter((assignment) => {
      const text = `
        ${assignment.title || ""}
        ${assignment.subject || ""}
        ${assignment.description || ""}
        ${assignment.status || ""}
      `.toLowerCase();

      const searchMatch =
        !query ||
        text.includes(query);

      const statusMatch =
        statusFilter === "All" ||
        assignment.status === statusFilter;

      const dateMatch =
        matchesDateRange(assignment);

      return (
        searchMatch &&
        statusMatch &&
        dateMatch
      );
    });
  }, [
    assignments,
    search,
    statusFilter,
    fromDate,
    toDate,
  ]);

  /* =====================================================
     FILTER CODING SUBMISSIONS
  ===================================================== */

  const filteredCodingSubmissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return codingSubmissions.filter((submission) => {
      const text = `
        ${submission.studentName || ""}
        ${submission.studentEmail || ""}
        ${submission.questionTitle || ""}
        ${submission.language || ""}
        ${submission.status || ""}
        ${submission.examTitle || ""}
      `.toLowerCase();

      const searchMatch =
        !query ||
        text.includes(query);

      const statusMatch =
        statusFilter === "All" ||
        submission.status === statusFilter;

      const dateMatch =
        matchesDateRange(submission);

      return (
        searchMatch &&
        statusMatch &&
        dateMatch
      );
    });
  }, [
    codingSubmissions,
    search,
    statusFilter,
    fromDate,
    toDate,
  ]);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const completedResults = results.filter(
    (result) =>
      result.status === "Completed" ||
      result.status === "Submitted"
  );

  const averageScore =
    completedResults.length > 0
      ? (
          completedResults.reduce(
            (sum, result) =>
              sum + safeNumber(result.score),
            0
          ) /
          completedResults.length
        ).toFixed(2)
      : "0.00";

  const passedResults = completedResults.filter(
    (result) => {
      const score = safeNumber(result.score);

      const totalMarks =
        safeNumber(
          result.totalMarks
        );

      if (totalMarks > 0) {
        return (
          (score / totalMarks) * 100 >=
          40
        );
      }

      return score >= 40;
    }
  );

  const passPercentage =
    completedResults.length > 0
      ? (
          (passedResults.length /
            completedResults.length) *
          100
        ).toFixed(2)
      : "0.00";

  const totalAssignmentMarks =
    assignments.reduce(
      (sum, assignment) =>
        sum +
        safeNumber(
          assignment.totalMarks
        ),
      0
    );

  /* =====================================================
     TOP STUDENTS
  ===================================================== */

  const studentPerformance = useMemo(() => {
    const map = {};

    completedResults.forEach((result) => {
      const email =
        result.studentEmail ||
        "unknown";

      if (!map[email]) {
        map[email] = {
          name:
            result.studentName ||
            "Unknown Student",
          email,
          exams: 0,
          totalScore: 0,
          highestScore: 0,
        };
      }

      const score =
        safeNumber(result.score);

      map[email].exams += 1;
      map[email].totalScore += score;
      map[email].highestScore =
        Math.max(
          map[email].highestScore,
          score
        );
    });

    return Object.values(map)
      .map((student) => ({
        ...student,
        averageScore:
          student.exams > 0
            ? (
                student.totalScore /
                student.exams
              ).toFixed(2)
            : "0.00",
      }))
      .sort(
        (a, b) =>
          Number(b.averageScore) -
          Number(a.averageScore)
      );
  }, [completedResults]);

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {
    setSearch("");
    setExamType("All");
    setStatusFilter("All");
    setFromDate("");
    setToDate("");
  };

  /* =====================================================
     CSV DOWNLOAD
  ===================================================== */

  const downloadCSV = (
    filename,
    headers,
    rows
  ) => {
    const csvRows = [];

    csvRows.push(
      headers
        .map(escapeCsv)
        .join(",")
    );

    rows.forEach((row) => {
      csvRows.push(
        row
          .map(escapeCsv)
          .join(",")
      );
    });

    const csvContent =
      "\uFEFF" +
      csvRows.join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =====================================================
     EXPORT CURRENT REPORT
  ===================================================== */

  const exportCurrentReport = () => {
    if (activeReport === "students") {
      const rows = filteredResults.map(
        (result) => [
          result.studentName || "",
          result.studentEmail || "",
          result.examTitle || "",
          result.examType || "",
          result.totalQuestions || 0,
          result.attemptedQuestions || 0,
          result.correctQuestions || 0,
          result.score || 0,
          result.status || "",
          formatDateTime(
            result.submittedAt
          ),
        ]
      );

      downloadCSV(
        "CodeIT_Student_Performance_Report.csv",
        [
          "Student Name",
          "Email",
          "Exam",
          "Exam Type",
          "Total Questions",
          "Attempted",
          "Correct",
          "Score",
          "Status",
          "Submitted At",
        ],
        rows
      );

      return;
    }

    if (activeReport === "exams") {
      const rows = filteredResults.map(
        (result) => [
          result.examTitle || "",
          result.examType || "",
          result.studentName || "",
          result.studentEmail || "",
          result.score || 0,
          result.totalMarks || "",
          result.status || "",
          formatDateTime(
            result.submittedAt
          ),
        ]
      );

      downloadCSV(
        "CodeIT_Exam_Results_Report.csv",
        [
          "Exam",
          "Exam Type",
          "Student Name",
          "Student Email",
          "Score",
          "Total Marks",
          "Status",
          "Submitted At",
        ],
        rows
      );

      return;
    }

    if (activeReport === "assignments") {
      const rows =
        filteredAssignments.map(
          (assignment) => [
            assignment.title || "",
            assignment.subject || "",
            assignment.description || "",
            assignment.dueDate || "",
            assignment.totalMarks || 0,
            assignment.status || "",
            formatDateTime(
              assignment.createdAt
            ),
          ]
        );

      downloadCSV(
        "CodeIT_Assignment_Report.csv",
        [
          "Title",
          "Subject",
          "Description",
          "Due Date",
          "Total Marks",
          "Status",
          "Created At",
        ],
        rows
      );

      return;
    }

    if (activeReport === "coding") {
      const rows =
        filteredCodingSubmissions.map(
          (submission) => [
            submission.studentName || "",
            submission.studentEmail || "",
            submission.examTitle || "",
            submission.questionTitle || "",
            submission.language || "",
            submission.status || "",
            formatDateTime(
              submission.submittedAt ||
                submission.createdAt
            ),
          ]
        );

      downloadCSV(
        "CodeIT_Coding_Submission_Report.csv",
        [
          "Student Name",
          "Student Email",
          "Exam",
          "Question",
          "Language",
          "Status",
          "Submitted At",
        ],
        rows
      );

      return;
    }

    /* OVERVIEW */

    const rows = [
      [
        "Total Students",
        students.length,
      ],
      [
        "Total Results",
        results.length,
      ],
      [
        "Completed Results",
        completedResults.length,
      ],
      [
        "Average Score",
        averageScore,
      ],
      [
        "Pass Percentage",
        `${passPercentage}%`,
      ],
      [
        "Total Assignments",
        assignments.length,
      ],
      [
        "Assignment Marks",
        totalAssignmentMarks,
      ],
      [
        "Coding Submissions",
        codingSubmissions.length,
      ],
    ];

    downloadCSV(
      "CodeIT_Faculty_Overview_Report.csv",
      ["Metric", "Value"],
      rows
    );
  };

  /* =====================================================
     PRINT / PDF
  ===================================================== */

  const printReport = () => {
    window.print();
  };

  /* =====================================================
     SIDEBAR
  ===================================================== */

  const goTo = (path) => {
    navigate(path);
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("placement-login");
    localStorage.removeItem("user-role");
    localStorage.removeItem("user-id");
    localStorage.removeItem("user-name");
    localStorage.removeItem("user-email");
    localStorage.removeItem("faculty-id");
    localStorage.removeItem("faculty-designation");
    localStorage.removeItem("department");
    localStorage.removeItem("course");
    localStorage.removeItem("year");

    navigate("/login");
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div
        className={`faculty-reports-page ${
          darkMode ? "dark" : ""
        }`}
      >
        <div className="reports-loading">
          <div className="loading-spinner"></div>

          <h3>Loading Reports...</h3>

          <p>
            Please wait while CodeIT loads
            faculty reports.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div
        className={`faculty-reports-page ${
          darkMode ? "dark" : ""
        }`}
      >
        <div className="reports-error">
          <div className="error-icon">
            ⚠️
          </div>

          <h2>Unable to Load Reports</h2>

          <p>{error}</p>

          <div className="error-actions">
            <button
              className="primary-btn"
              onClick={loadReports}
            >
              🔄 Retry
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                navigate(
                  "/faculty-dashboard"
                )
              }
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className={`faculty-reports-page ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* ================================================
          SIDEBAR
      ================================================ */}

      <aside className="faculty-reports-sidebar">
        <div className="reports-logo">
          <div className="reports-logo-icon">
            C
          </div>

          <div>
            <h2>CodeIT</h2>
            <span>FACULTY PORTAL</span>
          </div>
        </div>

        <div className="reports-sidebar-menu">
          <button
            className="reports-sidebar-link"
            onClick={() =>
              goTo("/faculty-dashboard")
            }
          >
            <span>🏠</span>
            Dashboard
          </button>

          <button
            className="reports-sidebar-link"
            onClick={() =>
              goTo("/faculty-students")
            }
          >
            <span>👨‍🎓</span>
            Students
          </button>

          <button
            className="reports-sidebar-link"
            onClick={() =>
              goTo("/faculty-exams")
            }
          >
            <span>📝</span>
            Exams
          </button>

          <button
            className="reports-sidebar-link"
            onClick={() =>
              goTo("/faculty-questions")
            }
          >
            <span>❓</span>
            Question Bank
          </button>

          <button
            className="reports-sidebar-link"
            onClick={() =>
              goTo("/faculty-results")
            }
          >
            <span>📊</span>
            Results
          </button>

          <button
            className="reports-sidebar-link"
            onClick={() =>
              goTo("/faculty-analytics")
            }
          >
            <span>📈</span>
            Analytics
          </button>

          <button
            className="reports-sidebar-link"
            onClick={() =>
              goTo(
                "/faculty-coding-submissions"
              )
            }
          >
            <span>💻</span>
            Coding Submissions
          </button>

          <button
            className="reports-sidebar-link"
            onClick={() =>
              goTo("/faculty-assignments")
            }
          >
            <span>📚</span>
            Assignments
          </button>

          <button
            className="reports-sidebar-link"
            onClick={() =>
              goTo("/faculty-schedule")
            }
          >
            <span>📅</span>
            Schedule
          </button>

          <button
            className="reports-sidebar-link active"
            onClick={() =>
              goTo("/faculty-reports")
            }
          >
            <span>📄</span>
            Reports
          </button>
        </div>

        <div className="reports-sidebar-bottom">
          <button
            className="reports-sidebar-link"
            onClick={() =>
              goTo("/faculty-profile")
            }
          >
            <span>👤</span>
            Profile & Settings
          </button>

          <button
            className="reports-sidebar-link logout-link"
            onClick={logout}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ================================================
          MAIN
      ================================================ */}

      <main className="faculty-reports-main">
        {/* TOP HEADER */}

        <header className="reports-topbar">
          <div>
            <h1>Faculty Reports</h1>

            <p>
              View, filter and export CodeIT
              academic reports.
            </p>
          </div>

          <div className="reports-top-actions">
            <button
              className="theme-button"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button
              className="refresh-button"
              onClick={loadReports}
            >
              🔄 Refresh
            </button>
          </div>
        </header>

        {/* ==============================================
            REPORT TABS
        ============================================== */}

        <div className="report-tabs">
          <button
            className={
              activeReport === "overview"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveReport("overview")
            }
          >
            📊 Overview
          </button>

          <button
            className={
              activeReport === "students"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveReport("students")
            }
          >
            👨‍🎓 Student Performance
          </button>

          <button
            className={
              activeReport === "exams"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveReport("exams")
            }
          >
            📝 Exam Results
          </button>

          <button
            className={
              activeReport === "assignments"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveReport("assignments")
            }
          >
            📚 Assignments
          </button>

          <button
            className={
              activeReport === "coding"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveReport("coding")
            }
          >
            💻 Coding
          </button>
        </div>

        {/* ==============================================
            FILTER BAR
        ============================================== */}

        <section className="reports-filter-card">
          <div className="filter-header">
            <div>
              <h3>Search & Filters</h3>
              <span>
                Narrow down the report data.
              </span>
            </div>

            <button
              className="clear-filter-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

          <div className="filter-grid">
            <div className="filter-field search-field">
              <label>Search</label>

              <input
                type="text"
                placeholder="Search student, exam, subject..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="filter-field">
              <label>Exam Type</label>

              <select
                value={examType}
                onChange={(e) =>
                  setExamType(e.target.value)
                }
              >
                <option value="All">
                  All Types
                </option>

                <option value="MCQ">
                  MCQ
                </option>

                <option value="Coding">
                  Coding
                </option>
              </select>
            </div>

            <div className="filter-field">
              <label>Status</label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Submitted">
                  Submitted
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Closed">
                  Closed
                </option>

                <option value="Passed">
                  Passed
                </option>

                <option value="Failed">
                  Failed
                </option>
              </select>
            </div>

            <div className="filter-field">
              <label>From Date</label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(e.target.value)
                }
              />
            </div>

            <div className="filter-field">
              <label>To Date</label>

              <input
                type="date"
                value={toDate}
                onChange={(e) =>
                  setToDate(e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* ==============================================
            REPORT ACTIONS
        ============================================== */}

        <div className="report-actions">
          <div>
            <strong>
              {activeReport === "overview"
                ? "Overview Report"
                : activeReport ===
                  "students"
                ? "Student Performance Report"
                : activeReport ===
                  "exams"
                ? "Exam Results Report"
                : activeReport ===
                  "assignments"
                ? "Assignment Report"
                : "Coding Submission Report"}
            </strong>

            <span>
              Generated from current CodeIT data
            </span>
          </div>

          <div className="report-action-buttons">
            <button
              className="csv-btn"
              onClick={exportCurrentReport}
            >
              📥 Export CSV
            </button>

            <button
              className="print-btn"
              onClick={printReport}
            >
              🖨️ Print / Save PDF
            </button>
          </div>
        </div>

        {/* ==============================================
            PRINTABLE REPORT AREA
        ============================================== */}

        <section
          className="printable-report"
          id="faculty-report-print-area"
        >
          <div className="print-report-header">
            <div>
              <h2>CodeIT Faculty Report</h2>

              <p>
                {activeReport === "overview"
                  ? "Overview Report"
                  : activeReport ===
                    "students"
                  ? "Student Performance Report"
                  : activeReport ===
                    "exams"
                  ? "Exam Results Report"
                  : activeReport ===
                    "assignments"
                  ? "Assignment Report"
                  : "Coding Submission Report"}
              </p>
            </div>

            <div>
              <strong>
                Generated:
              </strong>

              <span>
                {formatDateTime(
                  new Date()
                )}
              </span>
            </div>
          </div>

          {/* ============================================
              OVERVIEW
          ============================================ */}

          {activeReport === "overview" && (
            <>
              <div className="report-stat-grid">
                <div className="report-stat-card">
                  <div className="report-stat-icon blue">
                    👨‍🎓
                  </div>

                  <div>
                    <span>
                      Total Students
                    </span>

                    <strong>
                      {students.length}
                    </strong>
                  </div>
                </div>

                <div className="report-stat-card">
                  <div className="report-stat-icon green">
                    📝
                  </div>

                  <div>
                    <span>
                      Exam Results
                    </span>

                    <strong>
                      {results.length}
                    </strong>
                  </div>
                </div>

                <div className="report-stat-card">
                  <div className="report-stat-icon orange">
                    📈
                  </div>

                  <div>
                    <span>
                      Average Score
                    </span>

                    <strong>
                      {averageScore}
                    </strong>
                  </div>
                </div>

                <div className="report-stat-card">
                  <div className="report-stat-icon purple">
                    ✓
                  </div>

                  <div>
                    <span>
                      Pass Percentage
                    </span>

                    <strong>
                      {passPercentage}%
                    </strong>
                  </div>
                </div>

                <div className="report-stat-card">
                  <div className="report-stat-icon red">
                    📚
                  </div>

                  <div>
                    <span>
                      Assignments
                    </span>

                    <strong>
                      {assignments.length}
                    </strong>
                  </div>
                </div>

                <div className="report-stat-card">
                  <div className="report-stat-icon cyan">
                    💻
                  </div>

                  <div>
                    <span>
                      Coding Submissions
                    </span>

                    <strong>
                      {codingSubmissions.length}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="overview-sections">
                <div className="report-panel">
                  <div className="panel-title">
                    <h3>Exam Summary</h3>
                  </div>

                  <div className="summary-list">
                    <div>
                      <span>
                        Completed Exams
                      </span>

                      <strong>
                        {
                          completedResults.length
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Passed
                      </span>

                      <strong>
                        {
                          passedResults.length
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Failed
                      </span>

                      <strong>
                        {Math.max(
                          0,
                          completedResults.length -
                            passedResults.length
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Average Score
                      </span>

                      <strong>
                        {averageScore}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="report-panel">
                  <div className="panel-title">
                    <h3>
                      Assignment Summary
                    </h3>
                  </div>

                  <div className="summary-list">
                    <div>
                      <span>
                        Total Assignments
                      </span>

                      <strong>
                        {assignments.length}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Active
                      </span>

                      <strong>
                        {
                          assignments.filter(
                            (a) =>
                              a.status ===
                              "Active"
                          ).length
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Closed
                      </span>

                      <strong>
                        {
                          assignments.filter(
                            (a) =>
                              a.status ===
                              "Closed"
                          ).length
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Total Marks
                      </span>

                      <strong>
                        {totalAssignmentMarks}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="report-panel">
                <div className="panel-title">
                  <h3>
                    Top Student Performance
                  </h3>
                </div>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Student</th>
                        <th>Email</th>
                        <th>Exams</th>
                        <th>Average</th>
                        <th>Highest</th>
                      </tr>
                    </thead>

                    <tbody>
                      {studentPerformance
                        .slice(0, 10)
                        .map(
                          (
                            student,
                            index
                          ) => (
                            <tr
                              key={
                                student.email
                              }
                            >
                              <td>
                                <span className="rank-badge">
                                  {index + 1}
                                </span>
                              </td>

                              <td>
                                <strong>
                                  {
                                    student.name
                                  }
                                </strong>
                              </td>

                              <td>
                                {
                                  student.email
                                }
                              </td>

                              <td>
                                {
                                  student.exams
                                }
                              </td>

                              <td>
                                <strong>
                                  {
                                    student.averageScore
                                  }
                                </strong>
                              </td>

                              <td>
                                {
                                  student.highestScore
                                }
                              </td>
                            </tr>
                          )
                        )}

                      {studentPerformance
                        .length === 0 && (
                        <tr>
                          <td
                            colSpan="6"
                            className="empty-cell"
                          >
                            No student
                            performance
                            data found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ============================================
              STUDENT PERFORMANCE
          ============================================ */}

          {activeReport === "students" && (
            <div className="report-panel">
              <div className="panel-title">
                <div>
                  <h3>
                    Student Performance
                  </h3>

                  <span>
                    {filteredResults.length}{" "}
                    records
                  </span>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Exam</th>
                      <th>Type</th>
                      <th>Attempted</th>
                      <th>Correct</th>
                      <th>Score</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredResults.map(
                      (result) => (
                        <tr
                          key={
                            result._id ||
                            `${result.studentEmail}-${result.examTitle}-${result.submittedAt}`
                          }
                        >
                          <td>
                            <strong>
                              {result.studentName ||
                                "Unknown"}
                            </strong>
                          </td>

                          <td>
                            {
                              result.studentEmail
                            }
                          </td>

                          <td>
                            {
                              result.examTitle
                            }
                          </td>

                          <td>
                            <span
                              className={`type-badge ${
                                String(
                                  result.examType ||
                                    ""
                                ).toLowerCase()
                              }`}
                            >
                              {
                                result.examType
                              }
                            </span>
                          </td>

                          <td>
                            {
                              result.attemptedQuestions ??
                              0
                            }
                            /
                            {
                              result.totalQuestions ??
                              0
                            }
                          </td>

                          <td>
                            {
                              result.correctQuestions ??
                              0
                            }
                          </td>

                          <td>
                            <strong>
                              {
                                result.score ??
                                0
                              }
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`status-badge ${String(
                                result.status ||
                                  ""
                              )
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {
                                result.status ||
                                "-"
                              }
                            </span>
                          </td>

                          <td>
                            {formatDate(
                              result.submittedAt
                            )}
                          </td>
                        </tr>
                      )
                    )}

                    {filteredResults
                      .length === 0 && (
                      <tr>
                        <td
                          colSpan="9"
                          className="empty-cell"
                        >
                          No student
                          performance
                          records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================
              EXAM RESULTS
          ============================================ */}

          {activeReport === "exams" && (
            <div className="report-panel">
              <div className="panel-title">
                <div>
                  <h3>
                    Exam Results
                  </h3>

                  <span>
                    {filteredResults.length}{" "}
                    records
                  </span>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Exam</th>
                      <th>Type</th>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Score</th>
                      <th>Total Marks</th>
                      <th>Status</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredResults.map(
                      (result) => (
                        <tr
                          key={
                            result._id ||
                            `${result.studentEmail}-${result.examTitle}-${result.submittedAt}`
                          }
                        >
                          <td>
                            <strong>
                              {
                                result.examTitle
                              }
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`type-badge ${
                                String(
                                  result.examType ||
                                    ""
                                ).toLowerCase()
                              }`}
                            >
                              {
                                result.examType
                              }
                            </span>
                          </td>

                          <td>
                            {
                              result.studentName
                            }
                          </td>

                          <td>
                            {
                              result.studentEmail
                            }
                          </td>

                          <td>
                            <strong>
                              {
                                result.score ??
                                0
                              }
                            </strong>
                          </td>

                          <td>
                            {
                              result.totalMarks ??
                              "-"
                            }
                          </td>

                          <td>
                            <span
                              className={`status-badge ${String(
                                result.status ||
                                  ""
                              )
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {
                                result.status
                              }
                            </span>
                          </td>

                          <td>
                            {formatDateTime(
                              result.submittedAt
                            )}
                          </td>
                        </tr>
                      )
                    )}

                    {filteredResults
                      .length === 0 && (
                      <tr>
                        <td
                          colSpan="8"
                          className="empty-cell"
                        >
                          No exam results
                          found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================
              ASSIGNMENTS
          ============================================ */}

          {activeReport ===
            "assignments" && (
            <div className="report-panel">
              <div className="panel-title">
                <div>
                  <h3>
                    Assignment Report
                  </h3>

                  <span>
                    {
                      filteredAssignments.length
                    }{" "}
                    assignments
                  </span>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Subject</th>
                      <th>Due Date</th>
                      <th>Total Marks</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAssignments.map(
                      (assignment) => (
                        <tr
                          key={
                            assignment._id ||
                            assignment.title
                          }
                        >
                          <td>
                            <strong>
                              {
                                assignment.title
                              }
                            </strong>

                            {assignment.description && (
                              <small className="description-text">
                                {
                                  assignment.description
                                }
                              </small>
                            )}
                          </td>

                          <td>
                            {
                              assignment.subject
                            }
                          </td>

                          <td>
                            {formatDate(
                              assignment.dueDate
                            )}
                          </td>

                          <td>
                            {
                              assignment.totalMarks
                            }
                          </td>

                          <td>
                            <span
                              className={`status-badge ${String(
                                assignment.status ||
                                  ""
                              ).toLowerCase()}`}
                            >
                              {
                                assignment.status
                              }
                            </span>
                          </td>

                          <td>
                            {formatDate(
                              assignment.createdAt
                            )}
                          </td>
                        </tr>
                      )
                    )}

                    {filteredAssignments
                      .length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="empty-cell"
                        >
                          No assignment
                          records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================
              CODING SUBMISSIONS
          ============================================ */}

          {activeReport === "coding" && (
            <div className="report-panel">
              <div className="panel-title">
                <div>
                  <h3>
                    Coding Submission Report
                  </h3>

                  <span>
                    {
                      filteredCodingSubmissions.length
                    }{" "}
                    submissions
                  </span>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Exam</th>
                      <th>Question</th>
                      <th>Language</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCodingSubmissions.map(
                      (submission) => (
                        <tr
                          key={
                            submission._id ||
                            `${submission.studentEmail}-${submission.questionTitle}-${submission.createdAt}`
                          }
                        >
                          <td>
                            <strong>
                              {
                                submission.studentName
                              }
                            </strong>
                          </td>

                          <td>
                            {
                              submission.studentEmail
                            }
                          </td>

                          <td>
                            {
                              submission.examTitle ||
                              "-"
                            }
                          </td>

                          <td>
                            {
                              submission.questionTitle ||
                              submission.questionId ||
                              "-"
                            }
                          </td>

                          <td>
                            <span className="language-badge">
                              {
                                submission.language ||
                                "-"
                              }
                            </span>
                          </td>

                          <td>
                            <span
                              className={`status-badge ${String(
                                submission.status ||
                                  "Submitted"
                              )
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {submission.status ||
                                "Submitted"}
                            </span>
                          </td>

                          <td>
                            {formatDateTime(
                              submission.submittedAt ||
                                submission.createdAt
                            )}
                          </td>
                        </tr>
                      )
                    )}

                    {filteredCodingSubmissions
                      .length === 0 && (
                      <tr>
                        <td
                          colSpan="7"
                          className="empty-cell"
                        >
                          No coding
                          submissions
                          found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* ==============================================
            FOOTER
        ============================================== */}

        <footer className="reports-footer">
          <span>
            © {new Date().getFullYear()}{" "}
            CodeIT Faculty Portal
          </span>

          <span>
            Reports are generated from
            current system data.
          </span>
        </footer>
      </main>
    </div>
  );
};

export default FacultyReports;