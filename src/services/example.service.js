const pool = require("../db/db");

async function getUserCount() {
  const result = await pool.query(
    "SELECT COUNT(*) as total FROM users"
  );

  return Number(result.rows[0].total);
}

module.exports = {
  getUserCount
};
