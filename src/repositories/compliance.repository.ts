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

export default {
  create,
};