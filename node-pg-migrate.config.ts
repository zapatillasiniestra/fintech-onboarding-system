import dotenv from "dotenv";
dotenv.config();

export default {
  dbClient: "pg",
  databaseUrl: process.env.DATABASE_URL,
  migrationsTable: "pgmigrations",
  dir: "migrations",
  ssl: {
    rejectUnauthorized: false,
  }
};
