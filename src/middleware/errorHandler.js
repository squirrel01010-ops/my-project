export const errorHandler = (err, req, res, next) => {
  // Handle JSON parsing errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Malformed JSON payload in request body"
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";

  console.error(`[Error] ${err.message}`, isProduction ? "" : err.stack);

  res.status(statusCode).json({
    success: false,
    error: isProduction && statusCode === 500 ? "Internal Server Error" : err.message
  });
};
