import React, {
  useEffect,
  useState,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =====================================================
   MAIN
===================================================== */

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

/* =====================================================
   STUDENT
===================================================== */

import StudentDashboard from "./components/StudentDashboard";
import StudentExams from "./components/StudentExams";
import OnlineExam from "./components/OnlineExam";
import StudentResults from "./components/StudentResults";
import StudentProfile from "./components/StudentProfile";
import StudentNotifications from "./components/StudentNotifications";

/* =====================================================
   FACULTY
===================================================== */

import FacultyDashboard from "./components/FacultyDashboard";
import FacultyStudents from "./components/FacultyStudents";
import FacultyExams from "./components/FacultyExams";
import FacultyCreateExam from "./components/FacultyCreateExam";
import FacultyQuestions from "./components/FacultyQuestions";
import FacultyResults from "./components/FacultyResults";
import FacultyAnalytics from "./components/FacultyAnalytics";
import FacultyAnnouncements from "./components/FacultyAnnouncements";
import FacultySchedule from "./components/FacultySchedule";
import FacultyLiveMonitoring from "./components/FacultyLiveMonitoring";
import FacultyLeaderboard from "./components/FacultyLeaderboard";
import FacultyAssignments from "./components/FacultyAssignments";
import FacultyReports from "./components/FacultyReports";
import FacultyProfile from "./components/FacultyProfile";
import FacultyCodingSubmissions from "./components/FacultyCodingSubmissions";

/* =====================================================
   BATTLE
===================================================== */

import CreateBattle from "./components/CreateBattle";
import JoinBattle from "./components/JoinBattle";
import BattleRoom from "./components/BattleRoom";


function App() {
  /* =================================================
     LOGIN STATE
  ================================================= */

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      localStorage.getItem(
        "placement-login"
      ) === "true"
    );

  const [userRole, setUserRole] =
    useState(
      localStorage.getItem(
        "user-role"
      ) || ""
    );

  /* =================================================
     THEME
  ================================================= */

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem(
        "placement-theme"
      ) === "dark"
    );

  /* =================================================
     LOGIN STATE CHECK
  ================================================= */

  useEffect(() => {
    const checkLogin = () => {
      const loggedIn =
        localStorage.getItem(
          "placement-login"
        ) === "true";

      const role =
        localStorage.getItem(
          "user-role"
        ) || "";

      setIsLoggedIn(loggedIn);
      setUserRole(role);
    };

    checkLogin();

    window.addEventListener(
      "storage",
      checkLogin
    );

    return () => {
      window.removeEventListener(
        "storage",
        checkLogin
      );
    };
  }, []);

  /* =================================================
     THEME
  ================================================= */

  const toggleTheme = () => {
    setDarkMode((previous) => {
      const newMode = !previous;

      localStorage.setItem(
        "placement-theme",
        newMode
          ? "dark"
          : "light"
      );

      return newMode;
    });
  };

  /* =================================================
     LOGIN HANDLER
  ================================================= */

  const handleLogin = () => {
    const loggedIn =
      localStorage.getItem(
        "placement-login"
      ) === "true";

    const role =
      localStorage.getItem(
        "user-role"
      ) || "";

    setIsLoggedIn(loggedIn);
    setUserRole(role);

    /* Update theme after login */
    const savedTheme =
      localStorage.getItem(
        "placement-theme"
      );

    if (savedTheme) {
      setDarkMode(
        savedTheme === "dark"
      );
    }
  };

  /* =================================================
     STUDENT ROUTE
  ================================================= */

  const StudentRoute = ({
    children,
  }) => {
    const loggedIn =
      localStorage.getItem(
        "placement-login"
      ) === "true";

    const role =
      localStorage.getItem(
        "user-role"
      );

    if (!loggedIn) {
      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }

    if (role !== "Student") {
      return (
        <Navigate
          to="/faculty-dashboard"
          replace
        />
      );
    }

    return children;
  };

  /* =================================================
     FACULTY ROUTE
  ================================================= */

  const FacultyRoute = ({
    children,
  }) => {
    const loggedIn =
      localStorage.getItem(
        "placement-login"
      ) === "true";

    const role =
      localStorage.getItem(
        "user-role"
      );

    if (!loggedIn) {
      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }

    if (role !== "Faculty") {
      return (
        <Navigate
          to="/student-dashboard"
          replace
        />
      );
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            MAIN
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/login"
          element={
            <Login
              onLogin={handleLogin}
            />
          }
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================================
            STUDENT DASHBOARD
        ================================================= */}

        <Route
          path="/student-dashboard"
          element={
            <StudentRoute>
              <StudentDashboard
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </StudentRoute>
          }
        />

        {/* =================================================
            STUDENT NOTIFICATIONS
        ================================================= */}

        <Route
          path="/student-notifications"
          element={
            <StudentRoute>
              <StudentNotifications
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </StudentRoute>
          }
        />

        {/* =================================================
            STUDENT EXAMS
        ================================================= */}

        <Route
          path="/student-exams"
          element={
            <StudentRoute>
              <StudentExams
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </StudentRoute>
          }
        />

        {/* =================================================
            ONLINE EXAM
        ================================================= */}

        <Route
          path="/online-exam/:id"
          element={
            <StudentRoute>
              <OnlineExam
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </StudentRoute>
          }
        />

        {/* =================================================
            STUDENT RESULTS
        ================================================= */}

        <Route
          path="/student-results"
          element={
            <StudentRoute>
              <StudentResults
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </StudentRoute>
          }
        />

        {/* =================================================
            STUDENT PROFILE
        ================================================= */}

        <Route
          path="/student-profile"
          element={
            <StudentRoute>
              <StudentProfile
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </StudentRoute>
          }
        />

        {/* =================================================
            BATTLE
        ================================================= */}

        <Route
          path="/create-battle"
          element={
            <StudentRoute>
              <CreateBattle />
            </StudentRoute>
          }
        />

        <Route
          path="/join-battle"
          element={
            <StudentRoute>
              <JoinBattle />
            </StudentRoute>
          }
        />

        <Route
          path="/battle/:battleId"
          element={
            <StudentRoute>
              <BattleRoom />
            </StudentRoute>
          }
        />

        {/* =================================================
            FACULTY DASHBOARD
        ================================================= */}

        <Route
          path="/faculty-dashboard"
          element={
            <FacultyRoute>
              <FacultyDashboard
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY STUDENTS
        ================================================= */}

        <Route
          path="/faculty-students"
          element={
            <FacultyRoute>
              <FacultyStudents
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY EXAMS
        ================================================= */}

        <Route
          path="/faculty-exams"
          element={
            <FacultyRoute>
              <FacultyExams
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY CREATE EXAM
        ================================================= */}

        <Route
          path="/faculty-create-exam"
          element={
            <FacultyRoute>
              <FacultyCreateExam
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY QUESTIONS
        ================================================= */}

        <Route
          path="/faculty-questions"
          element={
            <FacultyRoute>
              <FacultyQuestions
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY RESULTS
        ================================================= */}

        <Route
          path="/faculty-results"
          element={
            <FacultyRoute>
              <FacultyResults
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY CODING SUBMISSIONS
        ================================================= */}

        <Route
          path="/faculty-coding-submissions"
          element={
            <FacultyRoute>
              <FacultyCodingSubmissions
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY ANALYTICS
        ================================================= */}

        <Route
          path="/faculty-analytics"
          element={
            <FacultyRoute>
              <FacultyAnalytics
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY ANNOUNCEMENTS
        ================================================= */}

        <Route
          path="/faculty-announcements"
          element={
            <FacultyRoute>
              <FacultyAnnouncements
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY SCHEDULE
        ================================================= */}

        <Route
          path="/faculty-schedule"
          element={
            <FacultyRoute>
              <FacultySchedule
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY LIVE MONITORING
        ================================================= */}

        <Route
          path="/faculty-live-monitoring"
          element={
            <FacultyRoute>
              <FacultyLiveMonitoring
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY LEADERBOARD
        ================================================= */}

        <Route
          path="/faculty-leaderboard"
          element={
            <FacultyRoute>
              <FacultyLeaderboard
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY ASSIGNMENTS
        ================================================= */}

        <Route
          path="/faculty-assignments"
          element={
            <FacultyRoute>
              <FacultyAssignments
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY REPORTS
        ================================================= */}

        <Route
          path="/faculty-reports"
          element={
            <FacultyRoute>
              <FacultyReports
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            FACULTY PROFILE
        ================================================= */}

        <Route
          path="/faculty-profile"
          element={
            <FacultyRoute>
              <FacultyProfile
                darkMode={darkMode}
                toggleTheme={
                  toggleTheme
                }
              />
            </FacultyRoute>
          }
        />

        {/* =================================================
            NOT FOUND
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;