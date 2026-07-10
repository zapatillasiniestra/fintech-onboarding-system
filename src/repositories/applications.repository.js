const pool = require("../db/db");

async function findById(client, id) {
  const result = await client.query(
    `
    SELECT *
    FROM applications
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
}

async function findAll() {
  const result = await pool.query(
    `
    SELECT *
    FROM applications
    `
  );

  return result.rows[0];
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

    return result.rows[0];
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

async function create(userId, full_name, email) {
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

async function getApplications(userId, limit, offset, status, search, order) {
  let filters = ["user_id = $1"];
  let values = [userId];
  let i = 2;

  if (status) {
    filters.push(`status = $${i}`);
    values.push(status);
    i++;
  }

  if (search) {
    filters.push(`(
      full_name ILIKE $${i}
      OR email ILIKE $${i}
    )`);
    values.push(`%${search}%`);
    i++;
  }

  const sorting =
    order === "asc" ? "ASC" : "DESC";

  const whereClause = filters.join(" AND ");

  const countResult = await pool.query(
    `
    SELECT COUNT(*)
    FROM applications
    WHERE ${whereClause}
    `,
    values
  );

  const dataResult = await pool.query(
    `
    SELECT *
    FROM applications
    WHERE ${whereClause}
    ORDER BY created_at ${sorting}
    LIMIT $${i}
    OFFSET $${i + 1}
    `,
    [...values, limit, offset]
  );

  return {
    total: Number(countResult.rows[0].count),
    applications: dataResult.rows
  };
}

async function updateStatus(client, id, status) {
  const result = await client.query(
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
  findById,
  findAll,
  getStats,
  getRecents,
  create,
  getApplications,
  updateStatus
};