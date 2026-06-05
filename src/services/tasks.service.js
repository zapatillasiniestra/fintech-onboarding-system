const pool = require("../db/db");

async function getTasks(userId) {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1",
    [userId]
  );

  return result.rows;
}

async function createTask(userId, title) {
  const result = await pool.query(
    `
    INSERT INTO tasks (title, user_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    [title, userId]
  );

  return result.rows[0];
}

module.exports = {
  getTasks,
  createTask
};
