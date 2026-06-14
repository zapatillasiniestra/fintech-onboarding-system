const pool = require("../db/db.js");

async function getApplications(userId) {
  const result = await pool.query(
    "SELECT * FROM applications WHERE user_id = $1",
    [userId]
  );

  return result.rows;
}

async function createApplication(userId, email, full_name) {
  const result = await pool.query(
    `
    INSERT INTO applications (user_id, full_name, email)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [userId, full_name, email]
  );

  return result.rows[0];
}

async function updateStatus(id, userId, status) {
  const result = await pool.query(
    `
    UPDATE applications
    SET status = $1
    WHERE id = $2
    AND user_id = $3
    RETURNING *
    `,
    [status, id, userId]
  );

  return result.rows[0];
}

module.exports = {
  getApplications,
  createApplication,
  updateStatus
};
