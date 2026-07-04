const healthService = require("../services/health.service");

async function health(req, res, next) {
  try {
    const result = await healthService.getHealth();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {health};