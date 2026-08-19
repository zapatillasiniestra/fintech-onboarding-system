import type { PoolClient } from "pg";
import aiAuditEventsRepository from "../repositories/ai-audit-events.repository";
import { createAuditProvider } from "../providers/audit/AuditProviderFactory";
import {
  verifyAuditChain,
  type AuditEventToVerify
} from "../utils/audit-verifier";

interface CreateAIAuditData {
  applicationId: number;
  eventType: string,
  provider: string;
  model: string;
  modelVersion?: string;
  inputData: Record<string, unknown>;
  decision: "approved" | "rejected" | "manual_review";
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
}

async function createAIAuditEvent(
  client: PoolClient,
  data: CreateAIAuditData
) {
  const previousEventHash =
    await aiAuditEventsRepository.findLatestHash(
      client,
      data.applicationId
    );

  const auditProvider = createAuditProvider();

  const auditEvent =
    await auditProvider.createAIAuditEvent({
      ...data,
      previousEventHash
    });

  return aiAuditEventsRepository.create(
    client,
    {
      ...data,
      inputHash: auditEvent.inputHash,
      outputHash: auditEvent.outputHash,
      previousEventHash:
        auditEvent.previousEventHash,
      eventHash: auditEvent.eventHash,
      hashAlgorithm:
        auditEvent.hashAlgorithm
    }
  );
}

async function getAIAuditEvents(
  client: PoolClient,
  applicationId: number
) {
  return aiAuditEventsRepository.findByApplicationId(
    client,
    applicationId
  );
}

async function verifyAIAuditChain(
  client: PoolClient,
  applicationId: number
) {
  const rows =
    await aiAuditEventsRepository.findByApplicationId(
      client,
      applicationId
    );

  const events: AuditEventToVerify[] = rows.map(
    (row) => ({
      applicationId: row.application_id,
      eventType: row.event_type,
      provider: row.provider,
      model: row.model,
      modelVersion: row.model_version,
      inputHash: row.input_hash,
      outputHash: row.output_hash,
      previousEventHash:
        row.previous_event_hash,
      decision: row.decision,
      riskLevel: row.risk_level,
      reasons: row.reasons,
      eventHash: row.event_hash
    })
  );

  return {
    valid: verifyAuditChain(events),
    events: events.length
  };
}

export default {
  createAIAuditEvent,
  getAIAuditEvents,
  verifyAIAuditChain
};