const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/User");
const Exam = require("../models/Exam");
const Result = require("../models/Result");
const CodingSubmission = require("../models/CodingSubmission");

const router = express.Router();

/* =====================================================
   FACULTY ANALYTICS
   GET /api/analytics
===================================================== */

router.get("/", async (req, res) => {
  try {
    /* ---------------------------------------------
       TOTAL STUDENTS
    --------------------------------------------- */

    const totalStudents = await User.countDocuments({
      role: "Student",
    });

    /* ---------------------------------------------
       TOTAL EXAMS
    --------------------------------------------- */

    const totalExams = await Exam.countDocuments();

    /* ---------------------------------------------
       COMPLETED EXAMS
    --------------------------------------------- */

    const completedExams = await Exam.countDocuments({
      status: "Completed",
    });

    /* ---------------------------------------------
       TOTAL RESULTS
    --------------------------------------------- */

    const totalResults = await Result.countDocuments();

    /* ---------------------------------------------
       AVERAGE SCORE
    --------------------------------------------- */

    const scoreData = await Result.aggregate([
      {
        $match: {
          status: {
            $in: ["Submitted", "Completed"],
          },
        },
      },
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: "$score",
          },
        },
      },
    ]);

    const averageScore =
      scoreData.length > 0
        ? Number(
            scoreData[0].averageScore.toFixed(2)
          )
        : 0;

    /* ---------------------------------------------
       PASS / FAIL
       
       Passing rule:
       score >= 40
    --------------------------------------------- */

    const passedStudents =
      await Result.countDocuments({
        status: {
          $in: ["Submitted", "Completed"],
        },
        score: {
          $gte: 40,
        },
      });

    const failedStudents =
      await Result.countDocuments({
        status: {
          $in: ["Submitted", "Completed"],
        },
        score: {
          $lt: 40,
        },
      });

    const evaluatedResults =
      passedStudents + failedStudents;

    const passPercentage =
      evaluatedResults > 0
        ? Number(
            (
              (passedStudents /
                evaluatedResults) *
              100
            ).toFixed(2)
          )
        : 0;

    /* ---------------------------------------------
       TOTAL CODING SUBMISSIONS
    --------------------------------------------- */

    const totalCodingSubmissions =
      await CodingSubmission.countDocuments();

    /* ---------------------------------------------
       EXAM-WISE PERFORMANCE
    --------------------------------------------- */

    const examPerformance =
      await Result.aggregate([
        {
          $match: {
            status: {
              $in: [
                "Submitted",
                "Completed",
              ],
            },
          },
        },

        {
          $group: {
            _id: "$examId",

            examTitle: {
              $first: "$examTitle",
            },

            examType: {
              $first: "$examType",
            },

            students: {
              $sum: 1,
            },

            averageScore: {
              $avg: "$score",
            },

            highestScore: {
              $max: "$score",
            },

            lowestScore: {
              $min: "$score",
            },
          },
        },

        {
          $sort: {
            students: -1,
          },
        },

        {
          $limit: 10,
        },
      ]);

    const formattedExamPerformance =
      examPerformance.map((exam) => ({
        examId: exam._id,

        examTitle:
          exam.examTitle || "Untitled Exam",

        examType:
          exam.examType || "Unknown",

        students:
          exam.students || 0,

        averageScore:
          Number(
            (exam.averageScore || 0).toFixed(2)
          ),

        highestScore:
          exam.highestScore || 0,

        lowestScore:
          exam.lowestScore || 0,
      }));

    /* ---------------------------------------------
       STUDENT-WISE PERFORMANCE
    --------------------------------------------- */

    const studentPerformance =
      await Result.aggregate([
        {
          $match: {
            status: {
              $in: [
                "Submitted",
                "Completed",
              ],
            },
          },
        },

        {
          $group: {
            _id: "$studentEmail",

            studentName: {
              $first: "$studentName",
            },

            examsAttempted: {
              $sum: 1,
            },

            averageScore: {
              $avg: "$score",
            },

            highestScore: {
              $max: "$score",
            },
          },
        },

        {
          $sort: {
            averageScore: -1,
          },
        },

        {
          $limit: 10,
        },
      ]);

    const formattedStudentPerformance =
      studentPerformance.map(
        (student, index) => ({
          rank: index + 1,

          studentEmail:
            student._id,

          studentName:
            student.studentName ||
            "Unknown Student",

          examsAttempted:
            student.examsAttempted || 0,

          averageScore:
            Number(
              (student.averageScore || 0)
                .toFixed(2)
            ),

          highestScore:
            student.highestScore || 0,
        })
      );

    /* ---------------------------------------------
       EXAM TYPE STATISTICS
    --------------------------------------------- */

    const examTypeStats =
      await Result.aggregate([
        {
          $match: {
            status: {
              $in: [
                "Submitted",
                "Completed",
              ],
            },
          },
        },

        {
          $group: {
            _id: "$examType",

            attempts: {
              $sum: 1,
            },

            averageScore: {
              $avg: "$score",
            },
          },
        },
      ]);

    /* ---------------------------------------------
       FINAL RESPONSE
    --------------------------------------------- */

    return res.status(200).json({
      success: true,

      summary: {
        totalStudents,

        totalExams,

        completedExams,

        totalResults,

        averageScore,

        passedStudents,

        failedStudents,

        passPercentage,

        totalCodingSubmissions,
      },

      examPerformance:
        formattedExamPerformance,

      studentPerformance:
        formattedStudentPerformance,

      examTypeStats,
    });
  } catch (error) {
    console.error(
      "❌ Faculty analytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load faculty analytics.",
    });
  }
});

module.exports = router;