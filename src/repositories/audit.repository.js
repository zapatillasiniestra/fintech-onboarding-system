const pool = require("../db/db");

async function createLog(client, applicationId, userId, action) {
  await client.query(
    `
    INSERT INTO audit_logs
    (application_id, user_id, action)
    VALUES ($1,$2,$3)
    `,
    [applicationId, userId, action]
  );
}

module.exports = {
  createLog
};