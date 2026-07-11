CREATE TABLE IF NOT EXISTS users (
 id SERIAL PRIMARY KEY,
 email TEXT UNIQUE NOT NULL,
 password TEXT NOT NULL,
 role TEXT DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS applications (
 id SERIAL PRIMARY KEY,
 user_id INTEGER NOT NULL,
 status TEXT,
 full_name TEXT,
 email TEXT,

 FOREIGN KEY (user_id)
   REFERENCES users(id)
   ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (application_id)
    REFERENCES applications(id)
    ON DELETE CASCADE,

  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);