const logger = require("../utils/logger");

function requestLogger(req, res, next) {
  logger.info({
    method: req.method,
    url: req.originalUrl
  }, "Incoming request");

  next();
}

module.exports = requestLogger;