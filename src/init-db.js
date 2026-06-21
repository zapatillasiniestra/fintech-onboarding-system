require("dotenv").config();
const pool = require("./db/db");

async function init() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        status TEXT,
        full_name TEXT,
        email TEXT
      );
    `);

    console.log("Database initialized");
    process.exit(0);
  } catch (err) {
    console.error("INIT ERROR:", err);
    process.exit(1);
  }
}

init();