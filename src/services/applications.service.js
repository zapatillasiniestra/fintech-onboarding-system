const pool = require("../db/db.js");

async function getApplications(userId) {
  const result = await pool.query(
    "SELECT * FROM applications WHERE user_id = $1",
    [userId]
  );

  return result.rows;
}

async function getAllApplications() {
  const result = await pool.query(
    "SELECT * FROM applications"
  );

  return result.rows;
}

async function getApplicationsById(userId) {
  const result = await pool.query(
    "SELECT * FROM applications WHERE id = $1",
    [userId]
  );

  return result.rows;
}

async function getStats(userId) {
  const result = await pool.query(
    `
    SELECT
      status,
      COUNT(*) as total
    FROM applications
    WHERE user_id = $1
    GROUP BY status
    `,
    [userId]
  );

  let stats = {};
  let approved = 0;
  let rejected = 0;

  for (const row of result.rows) {
    stats[row.status] = Number(row.total);
    if (row.status === "approved") {
      approved = Number(row.total);
    }

    if (row.status === "rejected") {
      rejected = Number(row.total);
    }
    if (approved + rejected > 0) {
      stats.approvalRate =
        approved / (approved + rejected) * 100;
    } else {
      stats.approvalRate = 0;
    }
  }

  return stats;
}

async function getRecents() {
  const result = await pool.query(
    `
    SELECT * FROM applications
    ORDER BY id DESC
    LIMIT 3
    `
  );

  return result.rows;
}

async function createApplication(userId, full_name, email) {
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
  const existing = await pool.query(
    `
    SELECT status
    FROM applications
    WHERE id = $1
    `,
    [id]
  );

  if (existing.rows.length === 0) {
    throw new Error("application not found");
  }

  const currentStatus = existing.rows[0].status;

  if (
    currentStatus === "approved" ||
    currentStatus === "rejected"
  ) {
    throw new Error("application already finalized");
  }

  const result = await pool.query(
    `
    UPDATE applications
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  return result.rows[0];
}

module.exports = {
  getApplications,
  getAllApplications,
  getApplicationsById,
  getStats,
  getRecents,
  createApplication,
  updateStatus
};
