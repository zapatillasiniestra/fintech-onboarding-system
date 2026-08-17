import { sha256 } from "./hashing";

export interface AuditEventToVerify {
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

export function verifyAuditChain(
  events: AuditEventToVerify[]
): boolean {
  if (events.length === 0) {
    return true;
  }

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (!verifyAuditEvent(event)) {
      return false;
    }

    if (i === 0) {
      if (event.previousEventHash !== null) {
        return false;
      }
      continue;
    }

    if (event.previousEventHash !== events[i - 1].eventHash) {
      return false;
    }
  }

  return true;
}
