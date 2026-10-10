import React, { useEffect, useState } from "react";
import "./StudentNotifications.css";

const StudentNotifications = ({ darkMode, toggleTheme }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("auth-token");
  const email = localStorage.getItem("user-email") || "";

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/notifications?email=${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load notifications.");
      }

      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Notifications error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update notification.");
      }

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item
        )
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update notifications.");
      }

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete notification.");
      }

      setNotifications((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  const getTypeIcon = (type) => {
    switch (type) {
      case "Announcement":
        return "📢";
      case "Exam":
        return "📝";
      case "Assignment":
        return "📚";
      case "Result":
        return "🏆";
      case "Reminder":
        return "⏰";
      default:
        return "🔔";
    }
  };

  return (
    <div className={`student-notifications-page ${darkMode ? "dark" : ""}`}>
      <aside className="student-notification-sidebar">
        <div className="student-notification-logo">
          <div className="student-notification-logo-icon">C</div>
          <div>
            <h2>CodeIT</h2>
            <span>STUDENT PORTAL</span>
          </div>
        </div>

        <div className="student-notification-menu">
          <button onClick={() => (window.location.href = "/student-dashboard")}>
            🏠 Dashboard
          </button>

          <button onClick={() => (window.location.href = "/coding-problems")}>
            💻 Coding Problems
          </button>

          <button onClick={() => (window.location.href = "/my-submissions")}>
            📤 My Submissions
          </button>

          <button onClick={() => (window.location.href = "/student-exams")}>
            📝 MCQ Exams
          </button>

          <button onClick={() => (window.location.href = "/coding-exams")}>
            ⌨️ Coding Exams
          </button>

          <button className="active">
            🔔 Notifications
            {unreadCount > 0 && (
              <span className="notification-sidebar-badge">
                {unreadCount}
              </span>
            )}
          </button>

          <button onClick={() => (window.location.href = "/student-results")}>
            🏆 Results
          </button>

          <button onClick={() => (window.location.href = "/student-progress")}>
            📈 Progress
          </button>

          <button onClick={() => (window.location.href = "/student-leaderboard")}>
            🥇 Leaderboard
          </button>

          <button onClick={() => (window.location.href = "/student-profile")}>
            👤 Profile
          </button>
        </div>

        <div className="student-notification-sidebar-bottom">
          <button onClick={toggleTheme}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="student-notification-main">
        <header className="student-notification-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your latest activities.</p>
          </div>

          <div className="student-notification-actions">
            {unreadCount > 0 && (
              <button
                className="mark-all-btn"
                onClick={markAllAsRead}
              >
                ✓ Mark All as Read
              </button>
            )}

            <button
              className="refresh-btn"
              onClick={fetchNotifications}
            >
              🔄 Refresh
            </button>
          </div>
        </header>

        <section className="notification-summary">
          <div className="notification-summary-card">
            <span>🔔</span>
            <div>
              <strong>{notifications.length}</strong>
              <p>Total Notifications</p>
            </div>
          </div>

          <div className="notification-summary-card">
            <span>📩</span>
            <div>
              <strong>{unreadCount}</strong>
              <p>Unread Notifications</p>
            </div>
          </div>

          <div className="notification-summary-card">
            <span>✓</span>
            <div>
              <strong>{notifications.length - unreadCount}</strong>
              <p>Read Notifications</p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="notification-state">
            <div className="notification-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="notification-state error">
            <h3>Unable to load notifications</h3>
            <p>{error}</p>
            <button onClick={fetchNotifications}>
              Try Again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">
            <div className="notification-empty-icon">🔔</div>
            <h2>No Notifications</h2>
            <p>You don't have any notifications right now.</p>
          </div>
        ) : (
          <section className="notification-list">
            {notifications.map((notification) => (
              <article
                key={notification._id}
                className={`notification-card ${
                  !notification.isRead ? "unread" : ""
                }`}
              >
                <div className="notification-icon">
                  {getTypeIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <div className="notification-title-row">
                    <h3>{notification.title}</h3>

                    {!notification.isRead && (
                      <span className="unread-label">
                        NEW
                      </span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <div className="notification-meta">
                    <span>{notification.type}</span>
                    <span>
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="notification-card-actions">
                  {!notification.isRead && (
                    <button
                      onClick={() =>
                        markAsRead(notification._id)
                      }
                    >
                      ✓ Read
                    </button>
                  )}

                  <button
                    className="delete-notification"
                    onClick={() =>
                      deleteNotification(notification._id)
                    }
                  >
                    🗑️
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default StudentNotifications;