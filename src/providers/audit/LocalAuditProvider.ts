import { sha256 } from "../../utils/hashing";
import type {
  AuditEvent,
  AuditEventInput,
  AuditProvider,
} from "./AuditProvider";

export class LocalAuditProvider implements AuditProvider {
  async createAuditEvent(
    input: AuditEventInput
  ): Promise<AuditEvent> {
    const inputHash = sha256(input.inputData);

    const outputData = {
      decision: input.decision,
      riskLevel: input.riskLevel ?? null,
      reasons: input.reasons,
    };

    const outputHash = sha256(outputData);

    const eventData = {
      applicationId: input.applicationId,
      eventType: input.eventType,
      provider: input.provider,
      model: input.model ?? null,
      modelVersion: input.modelVersion ?? null,
      inputHash,
      outputHash,
      previousEventHash:
        input.previousEventHash ?? null,
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