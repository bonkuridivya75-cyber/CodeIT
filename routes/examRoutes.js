const express = require("express");
const mongoose = require("mongoose");

const Exam = require("../models/Exam");
const Question = require("../models/Question");

const router = express.Router();

/* =====================================================
   GET ALL EXAMS
===================================================== */

router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate(
        "createdBy",
        "name email facultyId department"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      exams,
    });
  } catch (error) {
    console.error(
      "Get exams error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load exams.",
    });
  }
});


/* =====================================================
   GET FACULTY EXAMS
   GET /api/exams/faculty/:facultyId
===================================================== */

router.get(
  "/faculty/:facultyId",
  async (req, res) => {
    try {
      const { facultyId } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          facultyId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid faculty ID.",
        });
      }

      const exams =
        await Exam.find({
          createdBy: facultyId,
        })
          .populate(
            "mcqQuestions"
          )
          .populate(
            "codingQuestions"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        exams,
      });
    } catch (error) {
      console.error(
        "Faculty exams error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load faculty exams.",
      });
    }
  }
);


/* =====================================================
   GET SINGLE EXAM
===================================================== */

router.get(
  "/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid exam ID.",
        });
      }

      const exam =
        await Exam.findById(id)
          .populate("mcqQuestions")
          .populate("codingQuestions");

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: "Exam not found.",
        });
      }

      return res.status(200).json({
        success: true,
        exam,
      });
    } catch (error) {
      console.error(
        "Get exam error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to load exam.",
      });
    }
  }
);


/* =====================================================
   CREATE EXAM + CREATE QUESTIONS
   POST /api/exams
===================================================== */

router.post(
  "/",
  async (req, res) => {
    try {
      const {
        title,
        subject,
        type,
        duration,
        questions,
        startDate,
        startTime,
        endDate,
        endTime,
        createdBy,
        createdQuestions,
      } = req.body;


      /* =================================================
         BASIC VALIDATION
      ================================================= */

      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Exam title is required.",
        });
      }

      if (!subject || !subject.trim()) {
        return res.status(400).json({
          success: false,
          message: "Subject is required.",
        });
      }

      if (
        !["MCQ", "Coding"].includes(type)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Exam type must be MCQ or Coding.",
        });
      }

      if (
        !duration ||
        Number(duration) < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid duration is required.",
        });
      }

      if (
        !startDate ||
        !startTime ||
        !endDate ||
        !endTime
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Complete exam schedule is required.",
        });
      }

      if (
        !createdBy ||
        !mongoose.Types.ObjectId.isValid(
          createdBy
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid faculty ID is required.",
        });
      }


      /* =================================================
         QUESTION VALIDATION
      ================================================= */

      if (
        !Array.isArray(
          createdQuestions
        ) ||
        createdQuestions.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please create at least one question.",
        });
      }

      if (
        Number(questions) !==
        createdQuestions.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Number of questions does not match the questions created.",
        });
      }


      /* =================================================
         DATE VALIDATION
      ================================================= */

      const startDateTime =
        new Date(
          `${startDate}T${startTime}`
        );

      const endDateTime =
        new Date(
          `${endDate}T${endTime}`
        );

      if (
        Number.isNaN(
          startDateTime.getTime()
        ) ||
        Number.isNaN(
          endDateTime.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid exam date or time.",
        });
      }

      if (
        endDateTime <= startDateTime
      ) {
        return res.status(400).json({
          success: false,
          message:
            "End date/time must be after start date/time.",
        });
      }


      /* =================================================
         CREATE QUESTIONS
      ================================================= */

      const questionDocuments =
        createdQuestions.map(
          (question) => ({
            title:
              String(
                question.title || ""
              ).trim(),

            type,

            description:
              String(
                question.description ||
                  ""
              ).trim(),

            input:
              String(
                question.input || ""
              ).trim(),

            output:
              String(
                question.output || ""
              ).trim(),

            starterCode:
              type === "Coding"
                ? {
                    JavaScript:
                      question
                        .starterCode
                        ?.JavaScript ||
                      "",

                    Python:
                      question
                        .starterCode
                        ?.Python ||
                      "",

                    Java:
                      question
                        .starterCode
                        ?.Java ||
                      "",

                    "C++":
                      question
                        .starterCode?.[
                        "C++"
                      ] || "",

                    C: "",

                    "C#": "",

                    PHP: "",

                    Kotlin: "",
                  }
                : {},

            testCases:
              type === "Coding"
                ? Array.isArray(
                    question.testCases
                  )
                  ? question.testCases
                  : []
                : [],

            options:
              type === "MCQ"
                ? Array.isArray(
                    question.options
                  )
                  ? question.options
                  : []
                : [],

            correctAnswer:
              type === "MCQ"
                ? String(
                    question.correctAnswer ||
                      ""
                  ).trim()
                : "",

            marks:
              Number(
                question.marks || 1
              ),

            createdBy,
          })
        );


      /* =================================================
         VALIDATE QUESTION TITLES
      ================================================= */

      const invalidQuestion =
        questionDocuments.find(
          (question) =>
            !question.title
        );

      if (invalidQuestion) {
        return res.status(400).json({
          success: false,
          message:
            "Every question must have a title.",
        });
      }


      /* =================================================
         SAVE QUESTIONS
      ================================================= */

      const savedQuestions =
        await Question.insertMany(
          questionDocuments
        );


      /* =================================================
         QUESTION IDS
      ================================================= */

      const questionIds =
        savedQuestions.map(
          (question) =>
            question._id
        );


      /* =================================================
         CREATE EXAM
      ================================================= */

      const examData = {
        title: title.trim(),

        subject: subject.trim(),

        type,

        duration:
          Number(duration),

        questions:
          savedQuestions.length,

        startDate,

        startTime,

        endDate,

        endTime,

        status: "Draft",

        createdBy,
      };


      if (type === "MCQ") {
        examData.mcqQuestions =
          questionIds;

        examData.codingQuestions =
          [];
      } else {
        examData.codingQuestions =
          questionIds;

        examData.mcqQuestions =
          [];
      }


      const exam =
        await Exam.create(
          examData
        );


      /* =================================================
         RESPONSE
      ================================================= */

      return res.status(201).json({
        success: true,

        message:
          "Exam and questions created successfully.",

        exam,

        questions:
          savedQuestions,
      });
    } catch (error) {
      console.error(
        "Create exam error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to create exam.",

        error: error.message,
      });
    }
  }
);


/* =====================================================
   UPDATE MCQ QUESTIONS
===================================================== */

router.put(
  "/:id/mcq-questions",
  async (req, res) => {
    try {
      const {
        questionIds,
      } = req.body;

      if (
        !Array.isArray(
          questionIds
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Question IDs must be an array.",
        });
      }

      const exam =
        await Exam.findById(
          req.params.id
        );

      if (!exam) {
        return res.status(404).json({
          success: false,
          message:
            "Exam not found.",
        });
      }

      exam.mcqQuestions =
        questionIds;

      exam.questions =
        questionIds.length;

      await exam.save();

      return res.status(200).json({
        success: true,
        message:
          "MCQ questions updated.",
        exam,
      });
    } catch (error) {
      console.error(
        "Update MCQ questions error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update questions.",
      });
    }
  }
);


/* =====================================================
   UPDATE CODING QUESTIONS
===================================================== */

router.put(
  "/:id/coding-questions",
  async (req, res) => {
    try {
      const {
        questionIds,
      } = req.body;

      if (
        !Array.isArray(
          questionIds
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Question IDs must be an array.",
        });
      }

      const exam =
        await Exam.findById(
          req.params.id
        );

      if (!exam) {
        return res.status(404).json({
          success: false,
          message:
            "Exam not found.",
        });
      }

      exam.codingQuestions =
        questionIds;

      exam.questions =
        questionIds.length;

      await exam.save();

      return res.status(200).json({
        success: true,
        message:
          "Coding questions updated.",
        exam,
      });
    } catch (error) {
      console.error(
        "Update coding questions error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update questions.",
      });
    }
  }
);


/* =====================================================
   UPDATE STATUS
===================================================== */

router.patch(
  "/:id/status",
  async (req, res) => {
    try {
      const {
        status,
      } = req.body;

      const allowedStatuses = [
        "Draft",
        "Active",
        "Completed",
        "Inactive",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid exam status.",
        });
      }

      const exam =
        await Exam.findByIdAndUpdate(
          req.params.id,
          { status },
          {
            new: true,
          }
        );

      if (!exam) {
        return res.status(404).json({
          success: false,
          message:
            "Exam not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Exam status updated.",
        exam,
      });
    } catch (error) {
      console.error(
        "Update exam status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update exam status.",
      });
    }
  }
);


/* =====================================================
   DELETE EXAM
===================================================== */

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const exam =
        await Exam.findById(
          req.params.id
        );

      if (!exam) {
        return res.status(404).json({
          success: false,
          message:
            "Exam not found.",
        });
      }


      /* ===============================================
         DELETE QUESTIONS BELONGING TO EXAM
      =============================================== */

      const questionIds = [
        ...(exam.mcqQuestions || []),
        ...(exam.codingQuestions || []),
      ];

      if (
        questionIds.length > 0
      ) {
        await Question.deleteMany({
          _id: {
            $in: questionIds,
          },
        });
      }


      /* ===============================================
         DELETE EXAM
      =============================================== */

      await Exam.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Exam and its questions deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete exam error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete exam.",
      });
    }
  }
);


module.exports = router;