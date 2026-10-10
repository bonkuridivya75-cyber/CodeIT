const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

/* =====================================================
   MIDDLEWARE
===================================================== */

const authMiddleware =
  require("./middleware/authMiddleware");

const authorizeRoles =
  require("./middleware/roleMiddleware");

const errorMiddleware =
  require("./middleware/errorMiddleware");

/* =====================================================
   ROUTES
===================================================== */

const authRoutes =
  require("./routes/authRoutes");

const examRoutes =
  require("./routes/examRoutes");

const questionRoutes =
  require("./routes/questionRoutes");

const resultRoutes =
  require("./routes/resultRoutes");

const codeRoutes =
  require("./routes/codeRoutes");

const codingSubmissionRoutes =
  require("./routes/codingSubmissionRoutes");

const studentProfileRoutes =
  require("./routes/studentProfileRoutes");

const userRoutes =
  require("./routes/userRoutes");

const battleRoutes =
  require("./routes/battleRoutes");

const battleSubmissionRoutes =
  require("./routes/battleSubmissionRoutes");

const analyticsRoutes =
  require("./routes/analyticsRoutes");

const announcementRoutes =
  require("./routes/announcementRoutes");

const scheduleRoutes =
  require("./routes/scheduleRoutes");

const examMonitoringRoutes =
  require("./routes/examMonitoringRoutes");

const assignmentRoutes =
  require("./routes/assignmentRoutes");

/* =====================================================
   NOTIFICATIONS
===================================================== */

const notificationRoutes =
  require("./routes/notificationRoutes");


/* =====================================================
   APP
===================================================== */

const app = express();

const PORT =
  process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI;


/* =====================================================
   JWT CHECK
===================================================== */

if (!process.env.JWT_SECRET) {
  console.error(
    "===================================="
  );

  console.error(
    "❌ JWT_SECRET is missing in .env"
  );

  console.error(
    "===================================="
  );

  process.exit(1);
}


/* =====================================================
   HTTP SERVER
===================================================== */

const server =
  http.createServer(app);


/* =====================================================
   SOCKET.IO
===================================================== */

const io =
  new Server(server, {
    cors: {
      origin: true,

      methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
      ],

      credentials: true,
    },
  });


/* =====================================================
   BASIC MIDDLEWARE
===================================================== */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "5mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "5mb",
  })
);


/* =====================================================
   SOCKET.IO AVAILABLE TO ROUTES
===================================================== */

app.set(
  "io",
  io
);


/* =====================================================
   HOME
===================================================== */

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "CodeIT backend server is running",
      socketIO: true,
      port: PORT,
    });
  }
);


/* =====================================================
   PUBLIC AUTH
===================================================== */

app.use(
  "/api/auth",
  authRoutes
);


/* =====================================================
   PROTECTED EXAM ROUTES
===================================================== */

app.use(
  "/api/exams",
  authMiddleware,
  examRoutes
);


/* =====================================================
   PROTECTED QUESTION ROUTES
===================================================== */

app.use(
  "/api/questions",
  authMiddleware,
  questionRoutes
);


/* =====================================================
   PROTECTED RESULT ROUTES
===================================================== */

app.use(
  "/api/results",
  authMiddleware,
  resultRoutes
);


/* =====================================================
   CODE EXECUTION
===================================================== */

app.use(
  "/api/code",
  authMiddleware,
  codeRoutes
);


/* =====================================================
   CODING SUBMISSIONS
===================================================== */

app.use(
  "/api/coding-submissions",
  authMiddleware,
  codingSubmissionRoutes
);


/* =====================================================
   STUDENT PROFILE
===================================================== */

app.use(
  "/api/student-profile",
  authMiddleware,
  studentProfileRoutes
);


/* =====================================================
   USERS
===================================================== */

app.use(
  "/api/users",
  authMiddleware,
  userRoutes
);


/* =====================================================
   FACULTY ANALYTICS
===================================================== */

app.use(
  "/api/analytics",
  authMiddleware,
  authorizeRoles("Faculty"),
  analyticsRoutes
);


/* =====================================================
   ANNOUNCEMENTS
===================================================== */

app.use(
  "/api/announcements",
  authMiddleware,
  announcementRoutes
);


/* =====================================================
   SCHEDULE
===================================================== */

app.use(
  "/api/schedules",
  authMiddleware,
  scheduleRoutes
);


/* =====================================================
   EXAM MONITORING
===================================================== */

app.use(
  "/api/exam-monitoring",
  authMiddleware,
  examMonitoringRoutes
);


/* =====================================================
   ASSIGNMENTS
===================================================== */

app.use(
  "/api/assignments",
  authMiddleware,
  assignmentRoutes
);


/* =====================================================
   NOTIFICATIONS
===================================================== */

app.use(
  "/api/notifications",
  authMiddleware,
  notificationRoutes
);


/* =====================================================
   BATTLE ROUTES
===================================================== */

app.use(
  "/api/battles",
  authMiddleware,
  battleRoutes
);

app.use(
  "/api/battles",
  authMiddleware,
  battleSubmissionRoutes
);


/* =====================================================
   SOCKET.IO
===================================================== */

io.on(
  "connection",
  (socket) => {

    console.log(
      "🔌 Socket connected:",
      socket.id
    );


    /* =================================================
       JOIN BATTLE
    ================================================= */

    socket.on(
      "join-battle",
      (data) => {

        try {

          let battleId = "";

          if (
            typeof data ===
            "string"
          ) {
            battleId = data;
          }

          if (
            data &&
            typeof data ===
              "object"
          ) {
            battleId =
              data.battleId;
          }

          if (!battleId) {
            return;
          }

          const roomId =
            String(battleId)
              .trim()
              .toUpperCase();

          socket.join(
            roomId
          );

          console.log(
            `⚔️ ${socket.id} joined battle ${roomId}`
          );

          socket
            .to(roomId)
            .emit(
              "player-joined",
              {
                battleId:
                  roomId,

                userId:
                  data?.userId ||
                  "",

                playerName:
                  data?.playerName ||
                  "Opponent",
              }
            );

          socket.emit(
            "battle-room-joined",
            {
              battleId:
                roomId,

              socketId:
                socket.id,
            }
          );

        } catch (error) {

          console.error(
            "Socket join battle error:",
            error
          );

        }

      }
    );


    /* =================================================
       BATTLE SUBMITTED
    ================================================= */

    socket.on(
      "battle-submitted",
      (data) => {

        try {

          if (
            !data ||
            !data.battleId
          ) {
            return;
          }

          const roomId =
            String(
              data.battleId
            )
              .trim()
              .toUpperCase();

          socket
            .to(roomId)
            .emit(
              "opponent-submitted",
              {
                battleId:
                  roomId,

                playerName:
                  data.playerName ||
                  "Opponent",

                submittedAt:
                  new Date(),
              }
            );

        } catch (error) {

          console.error(
            "Socket submission error:",
            error
          );

        }

      }
    );


    /* =================================================
       BATTLE COMPLETED
    ================================================= */

    socket.on(
      "battle-completed",
      (data) => {

        try {

          if (
            !data ||
            !data.battleId
          ) {
            return;
          }

          const roomId =
            String(
              data.battleId
            )
              .trim()
              .toUpperCase();

          io.to(roomId)
            .emit(
              "battle-finished",
              {
                ...data,

                battleId:
                  roomId,

                completedAt:
                  new Date(),
              }
            );

        } catch (error) {

          console.error(
            "Socket battle completion error:",
            error
          );

        }

      }
    );


    /* =================================================
       FACULTY MONITORING
    ================================================= */

    socket.on(
      "join-faculty-monitoring",
      () => {

        socket.join(
          "faculty-monitoring"
        );

        console.log(
          `👨‍🏫 ${socket.id} joined faculty monitoring`
        );

      }
    );


    /* =================================================
       STUDENT EXAM START
    ================================================= */

    socket.on(
      "student-exam-start",
      (data) => {

        try {

          if (
            !data ||
            !data.examId
          ) {
            return;
          }

          const roomId =
            `exam-${data.examId}`;

          socket.join(
            roomId
          );

          console.log(
            `📝 Student joined exam room: ${roomId}`
          );

        } catch (error) {

          console.error(
            "Exam start socket error:",
            error
          );

        }

      }
    );


    /* =================================================
       EXAM TAB SWITCH
    ================================================= */

    socket.on(
      "exam-tab-switch",
      (data) => {

        try {

          if (!data) {
            return;
          }

          io.to(
            "faculty-monitoring"
          ).emit(
            "exam-tab-switch-alert",
            {
              ...data,
              timestamp:
                new Date(),
            }
          );

          console.log(
            "⚠️ Exam tab switch:",
            data.studentName ||
              "Student"
          );

        } catch (error) {

          console.error(
            "Exam tab switch error:",
            error
          );

        }

      }
    );


    /* =================================================
       EXAM TAB RETURN
    ================================================= */

    socket.on(
      "exam-tab-return",
      (data) => {

        try {

          if (!data) {
            return;
          }

          io.to(
            "faculty-monitoring"
          ).emit(
            "exam-tab-returned",
            {
              ...data,
              timestamp:
                new Date(),
            }
          );

        } catch (error) {

          console.error(
            "Exam tab return error:",
            error
          );

        }

      }
    );


    /* =================================================
       LEAVE BATTLE
    ================================================= */

    socket.on(
      "leave-battle",
      (data) => {

        try {

          let battleId = "";

          if (
            typeof data ===
            "string"
          ) {
            battleId = data;
          }

          if (
            data &&
            typeof data ===
              "object"
          ) {
            battleId =
              data.battleId;
          }

          if (!battleId) {
            return;
          }

          const roomId =
            String(battleId)
              .trim()
              .toUpperCase();

          socket.leave(
            roomId
          );

          socket
            .to(roomId)
            .emit(
              "player-left",
              {
                battleId:
                  roomId,
              }
            );

        } catch (error) {

          console.error(
            "Socket leave battle error:",
            error
          );

        }

      }
    );


    /* =================================================
       DISCONNECT
    ================================================= */

    socket.on(
      "disconnect",
      () => {

        console.log(
          "🔌 Socket disconnected:",
          socket.id
        );

      }
    );

  }
);


/* =====================================================
   404
===================================================== */

app.use(
  (req, res) => {

    res.status(404).json({
      success: false,

      message:
        "API route not found",

      path:
        req.originalUrl,
    });

  }
);


/* =====================================================
   ERROR HANDLER
===================================================== */

app.use(
  errorMiddleware
);


/* =====================================================
   MONGODB CHECK
===================================================== */

if (!MONGO_URI) {

  console.error(
    "===================================="
  );

  console.error(
    "❌ MONGO_URI is missing in .env file"
  );

  console.error(
    "===================================="
  );

  process.exit(1);
}


/* =====================================================
   CONNECT MONGODB
===================================================== */

mongoose
  .connect(MONGO_URI)
  .then(() => {

    console.log(
      "===================================="
    );

    console.log(
      "✅ MongoDB connected successfully"
    );

    console.log(
      "===================================="
    );

    server.listen(
      PORT,
      "0.0.0.0",
      () => {

        console.log(
          "===================================="
        );

        console.log(
          `✅ CodeIT backend running on port ${PORT}`
        );

        console.log(
          `🌐 Server: http://localhost:${PORT}`
        );

        console.log(
          `🔐 Auth API: http://localhost:${PORT}/api/auth`
        );

        console.log(
          `👨‍🎓 Students API: http://localhost:${PORT}/api/users/students`
        );

        console.log(
          `📊 Analytics API: http://localhost:${PORT}/api/analytics`
        );

        console.log(
          `📢 Announcements API: http://localhost:${PORT}/api/announcements`
        );

        console.log(
          `📅 Schedule API: http://localhost:${PORT}/api/schedules`
        );

        console.log(
          `🔴 Monitoring API: http://localhost:${PORT}/api/exam-monitoring`
        );

        console.log(
          `📚 Assignments API: http://localhost:${PORT}/api/assignments`
        );

        console.log(
          `🔔 Notifications API: http://localhost:${PORT}/api/notifications`
        );

        console.log(
          `⚔️ Battle API: http://localhost:${PORT}/api/battles`
        );

        console.log(
          `🔌 Socket.IO: http://localhost:${PORT}`
        );

        console.log(
          "===================================="
        );

      }
    );

  })
  .catch(
    (error) => {

      console.error(
        "===================================="
      );

      console.error(
        "❌ MongoDB connection failed"
      );

      console.error(
        "===================================="
      );

      console.error(
        error.message
      );

      process.exit(1);

    }
  );