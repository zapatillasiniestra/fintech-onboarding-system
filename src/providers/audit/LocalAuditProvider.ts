import { sha256 } from "../../utils/hashing";
import type {
  AIAuditEvent,
  AIAuditEventInput,
  AuditProvider,
} from "./AuditProvider";

export class LocalAuditProvider implements AuditProvider {
  async createAIAuditEvent(
    input: AIAuditEventInput
  ): Promise<AIAuditEvent> {
    const inputHash = sha256(input.inputData);

    const outputData = {
      decision: input.decision,
      riskLevel: input.riskLevel,
      reasons: input.reasons,
    };

    const outputHash = sha256(outputData);

    const eventData = {
      applicationId: input.applicationId,
      eventType: input.eventType,
      provider: input.provider,
      model: input.model,
      modelVersion: input.modelVersion ?? null,
      inputHash,
      outputHash,
      previousEventHash: input.previousEventHash ?? null,
    };

    const eventHash = sha256(eventData);

    return {
      inputHash,
      outputHash,
      eventHash,
      previousEventHash: input.previousEventHash,
      hashAlgorithm: "SHA-256",
    };
  }
}