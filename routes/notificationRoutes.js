const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

/*
  GET ALL NOTIFICATIONS
  Students can receive:
  - All Students notifications
  - Specific Student notifications
*/
router.get("/", async (req, res) => {
  try {
    const email = req.query.email || "";

    const filter = {
      $or: [
        { target: "All Students" },
        {
          target: "Specific Student",
          studentEmail: email,
        },
      ],
    };

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("❌ Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load notifications.",
    });
  }
});


/*
  GET UNREAD COUNT
*/
router.get("/unread-count", async (req, res) => {
  try {
    const email = req.query.email || "";

    const count = await Notification.countDocuments({
      isRead: false,
      $or: [
        { target: "All Students" },
        {
          target: "Specific Student",
          studentEmail: email,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("❌ Unread count error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get unread count.",
    });
  }
});


/*
  CREATE NOTIFICATION
*/
router.post("/", async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      target,
      studentEmail,
      createdBy,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required.",
      });
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || "General",
      target: target || "All Students",
      studentEmail: studentEmail || "",
      createdBy: createdBy || "Faculty",
    });

    return res.status(201).json({
      success: true,
      message: "Notification created successfully.",
      notification,
    });
  } catch (error) {
    console.error("❌ Create notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create notification.",
    });
  }
});


/*
  MARK ONE NOTIFICATION AS READ
*/
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    console.error("❌ Mark read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notification.",
    });
  }
});


/*
  MARK ALL NOTIFICATIONS AS READ
*/
router.put("/read-all", async (req, res) => {
  try {
    const email = req.body.email || "";

    await Notification.updateMany(
      {
        isRead: false,
        $or: [
          { target: "All Students" },
          {
            target: "Specific Student",
            studentEmail: email,
          },
        ],
      },
      {
        isRead: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error("❌ Mark all read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notifications.",
    });
  }
});


/*
  DELETE NOTIFICATION
*/
router.delete("/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(
      req.params.id
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Delete notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification.",
    });
  }
});


module.exports = router;