const express = require("express");
const axios = require("axios");

const router = express.Router();

const CODE_EXECUTION_URL =
  process.env.CODE_EXECUTION_URL ||
  "https://ce.judge0.com/submissions";


/*
  Judge0 language IDs

  JavaScript = 63
  Python     = 71
  Java       = 62
  C++        = 54
  C          = 50
  C#         = 51
  PHP        = 68
  Kotlin     = 78
*/

const languageMap = {
  JavaScript: 63,
  Python: 71,
  Java: 62,
  "C++": 54,
  C: 50,
  "C#": 51,
  PHP: 68,
  Kotlin: 78,
};


router.post("/run", async (req, res) => {
  try {

    const {
      language,
      code,
      input = "",
    } = req.body;


    if (!language) {
      return res.status(400).json({
        success: false,
        message:
          "Programming language is required",
      });
    }


    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Please write some code first",
      });
    }


    const languageId =
      languageMap[language];


    if (!languageId) {
      return res.status(400).json({
        success: false,
        message:
          "Unsupported programming language",
      });
    }


    const response = await axios.post(

      `${CODE_EXECUTION_URL}?base64_encoded=false&wait=true`,

      {
        language_id: languageId,

        source_code: code,

        stdin: input,
      },

      {
        headers: {
          "Content-Type":
            "application/json",
        },

        timeout: 30000,
      }
    );


    const result = response.data;


    if (result.compile_output) {

      return res.json({
        success: true,

        output:
          result.compile_output,

        status:
          "Compilation Error",
      });

    }


    if (result.stderr) {

      return res.json({
        success: true,

        output: result.stderr,

        status:
          "Runtime Error",
      });

    }


    if (
      result.status &&
      result.status.id === 5
    ) {

      return res.json({
        success: true,

        output:
          "Time Limit Exceeded",

        status:
          "Time Limit Exceeded",
      });

    }


    return res.json({

      success: true,

      language,

      input,

      output:
        result.stdout ||
        "Program executed successfully.",

      status:
        result.status?.description ||
        "Accepted",

      time:
        result.time || null,

      memory:
        result.memory || null,
    });


  } catch (error) {

    console.error(
      "Code execution error:",
      error.response?.data ||
        error.message
    );


    return res.status(500).json({
      success: false,

      message:
        "Code execution service is currently unavailable",
    });

  }
});


module.exports = router;