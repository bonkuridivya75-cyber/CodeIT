const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  console.error("Server Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    res.statusCode === 200
      ? 500
      : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message:
      err.message || "Internal Server Error",
  });
};

module.exports = errorMiddleware;