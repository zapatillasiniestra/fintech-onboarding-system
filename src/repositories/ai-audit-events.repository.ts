import type { PoolClient } from "pg";
// import type { AIAuditEvent } from "../providers/audit/AuditProvider";

interface CreateAIAuditEventData {
  applicationId: number;
  provider: string;
  model: string;
  modelVersion?: string;
  // inputData: Record<string, unknown>;
  inputHash: string;
  decision: string;
  riskLevel: string;
  reasons: string[];
  outputHash: string;
  previousEventHash?: string;
  eventHash: string;
  hashAlgorithm: string;
}

async function findLatestHash(
  client: PoolClient,
  applicationId: number
): Promise<string | undefined> {
  const result = await client.query(
    `
    SELECT event_hash
    FROM ai_audit_events
    WHERE application_id = $1
    ORDER BY created_at DESC, id DESC
    LIMIT 1
    `,
    [applicationId]
  );

  return result.rows[0]?.event_hash;
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
      model,
      model_version,
      input_hash,
      decision,
      risk_level,
      reasons,
      output_hash,
      previous_event_hash,
      event_hash,
      hash_algorithm,
      created_at
    FROM ai_audit_events
    WHERE application_id = $1
    ORDER BY id ASC
    `,
    [applicationId]
  );

  return result.rows;
}

async function create(
  client: PoolClient,
  data: CreateAIAuditEventData
) {
  const result = await client.query(
    `
    INSERT INTO ai_audit_events (
      application_id,
      provider,
      model,
      model_version,
      input_hash,
      decision,
      risk_level,
      reasons,
      output_hash,
      previous_event_hash,
      event_hash,
      hash_algorithm
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13
    )
    RETURNING *
    `,
    [
      data.applicationId,
      data.provider,
      data.model,
      data.modelVersion ?? null,
      // JSON.stringify(data.inputData),
      data.inputHash,
      data.decision,
      data.riskLevel,
      JSON.stringify(data.reasons),
      data.outputHash,
      data.previousEventHash ?? null,
      data.eventHash,
      data.hashAlgorithm,
    ]
  );

  return result.rows[0];
}

export default {
  findLatestHash,
  findByApplicationId,
  create,
};