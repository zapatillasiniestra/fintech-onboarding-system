import pool from "../db/db";

export default async function checkDatabase() {
  await pool.query("SELECT 1");
};
