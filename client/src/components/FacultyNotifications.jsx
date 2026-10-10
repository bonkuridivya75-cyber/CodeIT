import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyNotifications.css";

function FacultyNotifications() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: "📝",
      title: "New Exam Created",
      message:
        "Java Programming Assessment has been successfully created.",
      time: "10 minutes ago",
      type: "exam",
      read: false,
    },
    {
      id: 2,
      icon: "👨‍🎓",
      title: "New Student Registered",
      message:
        "Rahul Kumar has been added to the CodeIT student portal.",
      time: "1 hour ago",
      type: "student",
      read: false,
    },
    {
      id: 3,
      icon: "📊",
      title: "Exam Results Available",
      message:
        "Data Structures Unit Test results are now available.",
      time: "2 hours ago",
      type: "result",
      read: true,
    },
    {
      id: 4,
      icon: "💻",
      title: "Coding Exam Submitted",
      message:
        "A student has submitted the Java Coding Assessment.",
      time: "Yesterday",
      type: "coding",
      read: true,
    },
    {
      id: 5,
      icon: "🔔",
      title: "System Update",
      message:
        "Your CodeIT faculty portal is working successfully.",
      time: "2 days ago",
      type: "system",
      read: true,
    },
  ]);

  // ==============================
  // BACK TO DASHBOARD
  // ==============================
  const handleBackToDashboard = () => {
    navigate("/faculty-dashboard");
  };

  // ==============================
  // DARK / LIGHT MODE
  // ==============================
  const handleToggleTheme = () => {
    setDarkMode((previousMode) => !previousMode);
  };

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {
      localStorage.removeItem("placement-login");
      localStorage.removeItem("user-role");
      localStorage.removeItem("user-email");

      navigate("/");
    }
  };

  // ==============================
  // MARK ONE AS READ
  // ==============================
  const markAsRead = (id) => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // ==============================
  // MARK ALL AS READ
  // ==============================
  const markAllAsRead = () => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // ==============================
  // DELETE NOTIFICATION
  // ==============================
  const deleteNotification = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (confirmDelete) {
      setNotifications((previousNotifications) =>
        previousNotifications.filter(
          (notification) => notification.id !== id
        )
      );
    }
  };

  // ==============================
  // FILTER NOTIFICATIONS
  // ==============================
  const filteredNotifications = notifications.filter(
    (notification) => {
      if (activeFilter === "unread") {
        return !notification.read;
      }

      if (activeFilter === "read") {
        return notification.read;
      }

      return true;
    }
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const readCount = notifications.filter(
    (notification) => notification.read
  ).length;

  return (
    <div
      className={`faculty-notifications-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* ================= HEADER ================= */}

      <section className="notifications-top-section">
        <button
          className="back-dashboard-button"
          onClick={handleBackToDashboard}
        >
          ← Back to Dashboard
        </button>

        <div className="notifications-top-content">
          <div>
            <p className="notifications-breadcrumb">
              CODEIT / FACULTY / NOTIFICATIONS
            </p>

            <h1>Notifications</h1>

            <p className="notifications-subtitle">
              Stay updated with student, exam and system activities.
            </p>
          </div>

          <div className="notifications-header-actions">
            <button
              className="theme-button"
              onClick={handleToggleTheme}
            >
              {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </section>

      {/* ================= STATISTICS ================= */}

      <section className="notifications-stats">
        <div className="notification-stat-card">
          <span className="notification-stat-icon">🔔</span>

          <p>Total Notifications</p>

          <h2>{notifications.length}</h2>

          <span>All notifications</span>
        </div>

        <div className="notification-stat-card">
          <span className="notification-stat-icon">🔵</span>

          <p>Unread</p>

          <h2>{unreadCount}</h2>

          <span>Need your attention</span>
        </div>

        <div className="notification-stat-card">
          <span className="notification-stat-icon">✓</span>

          <p>Read</p>

          <h2>{readCount}</h2>

          <span>Already reviewed</span>
        </div>
      </section>

      {/* ================= MAIN CARD ================= */}

      <section className="notifications-main-card">
        <div className="notifications-card-header">
          <div>
            <p className="notifications-small-title">
              CODEIT / FACULTY / ALERTS
            </p>

            <h2>Your Notifications</h2>
          </div>

          <div className="notification-header-right">
            <span className="notification-count">
              {notifications.length} Notifications
            </span>

            {unreadCount > 0 && (
              <button
                className="mark-all-button"
                onClick={markAllAsRead}
              >
                ✓ Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* ================= FILTERS ================= */}

        <div className="notification-filters">
          <button
            className={
              activeFilter === "all"
                ? "notification-filter active-filter"
                : "notification-filter"
            }
            onClick={() => setActiveFilter("all")}
          >
            📋 All ({notifications.length})
          </button>

          <button
            className={
              activeFilter === "unread"
                ? "notification-filter active-filter"
                : "notification-filter"
            }
            onClick={() => setActiveFilter("unread")}
          >
            🔵 Unread ({unreadCount})
          </button>

          <button
            className={
              activeFilter === "read"
                ? "notification-filter active-filter"
                : "notification-filter"
            }
            onClick={() => setActiveFilter("read")}
          >
            ✓ Read ({readCount})
          </button>
        </div>

        {/* ================= NOTIFICATIONS LIST ================= */}

        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                className={`notification-item ${
                  notification.read ? "read-notification" : "unread-notification"
                }`}
                key={notification.id}
              >
                <div className="notification-icon-box">
                  {notification.icon}
                </div>

                <div className="notification-content">
                  <div className="notification-title-row">
                    <h3>{notification.title}</h3>

                    {!notification.read && (
                      <span className="unread-dot"></span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <span className="notification-time">
                    🕒 {notification.time}
                  </span>
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      className="read-button"
                      onClick={() =>
                        markAsRead(notification.id)
                      }
                    >
                      ✓ Mark Read
                    </button>
                  )}

                  <button
                    className="delete-notification-button"
                    onClick={() =>
                      deleteNotification(notification.id)
                    }
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <div>🔔</div>

              <h3>No Notifications Found</h3>

              <p>
                There are no notifications in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default FacultyNotifications;