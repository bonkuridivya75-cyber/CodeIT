const errorMiddleware = (err, req, res, next) => {
  console.error("========================================");
  console.error("❌ SERVER ERROR");
  console.error("========================================");
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  console.error("========================================");

  const statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      error: err.stack,
    }),
  });
};

module.exports = errorMiddleware;
