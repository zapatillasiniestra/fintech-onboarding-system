const { ZodError } = require("zod");

function errorHandler(err, req, res, next) {

  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: err.issues
    });
  }

  const status = err.status || 500;

  res.status(status).json({
    error: err.message || "internal server error"
  });
}

module.exports = errorHandler;