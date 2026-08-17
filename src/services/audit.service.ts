import type { PoolClient } from "pg";
import aiAuditEventsRepository from "../repositories/ai-audit-events.repository";
import { createAuditProvider } from "../providers/audit/AuditProviderFactory";

interface CreateAIAuditData {
  applicationId: number;
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

export default {
  createAIAuditEvent,
  getAIAuditEvents
};