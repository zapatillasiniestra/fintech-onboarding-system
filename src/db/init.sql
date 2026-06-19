CREATE TABLE IF NOT EXISTS users (
 id SERIAL PRIMARY KEY,
 email TEXT UNIQUE NOT NULL,
 password TEXT NOT NULL,
 role TEXT DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS applications (
 id SERIAL PRIMARY KEY,
 user_id INTEGER,
 status TEXT,
 full_name TEXT,
 email TEXT
);