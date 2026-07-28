import checkDatabase from "../repositories/health.repository";

async function getHealth() {
  await checkDatabase();

  return {
    status: "ok",
    database: "connected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0"
  };
}

export {getHealth};
