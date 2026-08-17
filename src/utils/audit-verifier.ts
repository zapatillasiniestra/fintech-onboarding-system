import { sha256 } from "./hashing";

interface AuditEventToVerify {
  applicationId: number;
  provider: string;
  model: string;
  modelVersion?: string | null;
  inputHash: string;
  outputHash: string;
  decision: "approved" | "rejected" | "manual_review";
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  previousEventHash?: string | null;
  eventHash: string;
}

export function verifyAuditEvent(
  event: AuditEventToVerify
): boolean {
  const expectedOutputHash = sha256({
    decision: event.decision,
    riskLevel: event.riskLevel,
    reasons: event.reasons
  });
  if (expectedOutputHash !== event.outputHash) {
    return false;
  }

  const expectedEventHash = sha256({
    applicationId: event.applicationId,
    provider: event.provider,
    model: event.model,
    modelVersion: event.modelVersion ?? null,
    inputHash: event.inputHash,
    outputHash: event.outputHash,
    previousEventHash:
      event.previousEventHash ?? null
  });

  return expectedEventHash === event.eventHash;
}
