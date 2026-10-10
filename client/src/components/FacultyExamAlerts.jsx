import React, {
  useEffect,
  useState,
} from "react";

import { io } from "socket.io-client";

const SOCKET_URL =
  window.location.origin;

function FacultyExamAlerts() {
  const [alerts, setAlerts] =
    useState([]);

  useEffect(() => {
    const socket = io(
      SOCKET_URL,
      {
        path: "/socket.io",

        transports: [
          "websocket",
          "polling",
        ],
      }
    );

    socket.on(
      "connect",
      () => {
        console.log(
          "👨‍🏫 Faculty monitoring connected"
        );

        socket.emit(
          "join-faculty-monitor"
        );
      }
    );

    socket.on(
      "student-tab-alert",
      (notification) => {
        console.log(
          "⚠️ Student activity:",
          notification
        );

        setAlerts(
          (previous) => [
            {
              ...notification,
              id:
                Date.now() +
                Math.random(),
            },
            ...previous,
          ].slice(0, 20)
        );
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #d9dde3",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >

        <div>
          <h3
            style={{
              margin: 0,
              color: "#111827",
            }}
          >
            Exam Activity
          </h3>

          <p
            style={{
              margin:
                "5px 0 0",
              color: "#6b7280",
              fontSize:
                "13px",
            }}
          >
            Live student monitoring
          </p>
        </div>

        {alerts.length >
          0 && (
          <button
            type="button"
            onClick={
              clearAlerts
            }
            style={{
              border:
                "1px solid #d1d5db",
              background:
                "#ffffff",
              padding:
                "7px 12px",
              borderRadius:
                "5px",
              cursor:
                "pointer",
            }}
          >
            Clear
          </button>
        )}

      </div>

      {alerts.length ===
      0 ? (
        <div
          style={{
            padding:
              "20px",
            background:
              "#f9fafb",
            borderRadius:
              "6px",
            textAlign:
              "center",
            color:
              "#6b7280",
            fontSize:
              "14px",
          }}
        >
          No student activity alerts.
        </div>
      ) : (
        <div
          style={{
            display:
              "flex",
            flexDirection:
              "column",
            gap: "10px",
          }}
        >

          {alerts.map(
            (alert) => (
              <div
                key={
                  alert.id
                }
                style={{
                  border:
                    "1px solid #f0caca",
                  background:
                    "#fff7f7",
                  borderRadius:
                    "6px",
                  padding:
                    "14px",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap:
                      "8px",
                    marginBottom:
                      "8px",
                  }}
                >

                  <span>
                    ⚠️
                  </span>

                  <strong
                    style={{
                      color:
                        "#b91c1c",
                    }}
                  >
                    Student Activity
                  </strong>

                </div>

                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "160px 1fr",
                    gap:
                      "5px 10px",
                    fontSize:
                      "13px",
                  }}
                >

                  <strong>
                    Student:
                  </strong>

                  <span>
                    {
                      alert.studentName
                    }
                  </span>

                  <strong>
                    Registration No:
                  </strong>

                  <span>
                    {
                      alert.studentId
                    }
                  </span>

                  <strong>
                    Exam:
                  </strong>

                  <span>
                    {
                      alert.examName
                    }
                  </span>

                  <strong>
                    Activity:
                  </strong>

                  <span>
                    {
                      alert.activity
                    }
                  </span>

                  <strong>
                    Time:
                  </strong>

                  <span>
                    {new Date(
                      alert.time
                    ).toLocaleTimeString()}
                  </span>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}

export default FacultyExamAlerts;