import type { PoolClient } from "pg";

async function createLog(
  client: PoolClient,
  applicationId: number,
  adminId: number,
  status: string
) {
  await client.query(
    `
    INSERT INTO audit_logs
    (application_id, admin_id, status)
    VALUES ($1, $2, $3)
    `,
    [applicationId, adminId, status]
  );
}

export default {createLog};
