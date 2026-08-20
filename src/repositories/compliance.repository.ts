import type { PoolClient } from "pg";

interface CreateComplianceCheckData {
  applicationId: number;
  provider: string;
  decision: string;
  reasons: string[];
  externalId?: string;
  raw?: Record<string, unknown>;
}

async function create(
  client: PoolClient,
  data: CreateComplianceCheckData
) {
  const result = await client.query(
    `
    INSERT INTO compliance_checks (
      application_id,
      provider,
      decision,
      reasons,
      external_id,
      raw
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      data.applicationId,
      data.provider,
      data.decision,
      JSON.stringify(data.reasons),
      data.externalId ?? null,
      data.raw
        ? JSON.stringify(data.raw)
        : null,
    ]
  );

  return result.rows[0];
}

async function findByApplicationId(
  client: PoolClient,
  applicationId: number
) {
  const result = await client.query(
    `
    SELECT
      id,
      application_id,
      provider,
      decision,
      reasons,
      external_id,
      created_at
    FROM compliance_checks
    WHERE application_id = $1
    ORDER BY id ASC
    `,
    [applicationId]
  );

  return result.rows;
}


export default {
  create,
  findByApplicationId,
};