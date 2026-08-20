import type { PoolClient } from "pg";

interface CreateIdentityVerificationData {
  applicationId: number;
  provider: string;
  verified: boolean;
  confidence: number;
  decision?: string;
  reasons: string[];
  externalId?: string;
  raw?: Record<string, unknown>;
}

async function create(
  client: PoolClient,
  data: CreateIdentityVerificationData
) {
  const result = await client.query(
    `
    INSERT INTO identity_verifications (
      application_id,
      provider,
      verified,
      confidence,
      decision,
      reasons,
      external_id,
      raw
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )
    RETURNING *
    `,
    [
      data.applicationId,
      data.provider,
      data.verified,
      data.confidence,
      data.decision ?? null,
      JSON.stringify(data.reasons),
      data.externalId ?? null,
      data.raw ? JSON.stringify(data.raw) : null,
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
      verified,
      confidence,
      decision,
      reasons,
      external_id,
      created_at
    FROM identity_verifications
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