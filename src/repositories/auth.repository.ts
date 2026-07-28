import pool from "../db/db";

async function saveRefreshToken(
    userId: number,
    token: string,
    expiresAt: Date
  ) {
  await pool.query(
    `
    INSERT INTO refresh_tokens
      (user_id, token, expires_at)
    VALUES ($1,$2,$3)
    `,
    [userId, token, expiresAt]
  );
}

async function findRefreshToken(token: string) {
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

async function deleteRefreshToken(token: string) {
  await pool.query(
    `
    DELETE FROM refresh_tokens
    WHERE token=$1
    `,
    [token]
  );
}

async function findUserById(id: number) {
  const result = await pool.query(
    `
    SELECT id, email, role
    FROM users
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
}

export default {
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  findUserById
};
