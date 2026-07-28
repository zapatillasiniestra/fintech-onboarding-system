import type { PoolClient } from "pg";

async function createLog(
    client: PoolClient,
    applicationId: number,
    userId: number,
    action: string
  ) {
  await client.query(
    `
    INSERT INTO audit_logs
    (application_id, user_id, action)
    VALUES ($1,$2,$3)
    `,
    [applicationId, userId, action]
  );
}

export default {createLog};
