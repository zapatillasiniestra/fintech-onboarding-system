import pool from "../db/db";

async function getUserCount() {
  const result = await pool.query(
    "SELECT COUNT(*) as total FROM users"
  );

  return Number(result.rows[0].total);
}

export default getUserCount;
