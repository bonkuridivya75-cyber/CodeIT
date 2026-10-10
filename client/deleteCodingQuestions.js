const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("./models/Question");

dotenv.config();

async function deleteCodingQuestions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const result = await Question.deleteMany({
      type: "Coding",
    });

    console.log(
      `🗑️ Deleted ${result.deletedCount} coding questions`
    );

    await mongoose.disconnect();

    console.log("✅ Database cleaned successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Delete error:", error.message);

    await mongoose.disconnect();

    process.exit(1);
  }
}

deleteCodingQuestions();