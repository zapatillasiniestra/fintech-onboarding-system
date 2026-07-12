require("dotenv").config();

module.exports = {
  dbClient: "pg",
  databaseUrl: process.env.DATABASE_URL,
  migrationsTable: "pgmigrations",
  dir: "migrations",
  ssl: {
    rejectUnauthorized: false
  }
};