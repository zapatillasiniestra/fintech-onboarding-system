const pool = require("../db/db");

async function saveRefreshToken(userId, token, expiresAt) {
  await pool.query(
    `
    INSERT INTO refresh_tokens
      (user_id, token, expires_at)
    VALUES ($1,$2,$3)
    `,
    [userId, token, expiresAt]
  );
}

async function findRefreshToken(token) {
  const result = await pool.query(
    `
    SELECT *
    FROM refresh_tokens
    WHERE token=$1
    `,
    [token]
  );

  return result.rows[0];
}

async function deleteRefreshToken(token) {
  await pool.query(
    `
    DELETE FROM refresh_tokens
    WHERE token=$1
    `,
    [token]
  );
}

module.exports = {
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken
};