const repository = require("../repositories/health.repository");

async function getHealth() {
  await repository.checkDatabase();

  return {
    status: "ok",
    database: "connected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0"
  };
}

module.exports = {
  getHealth
};