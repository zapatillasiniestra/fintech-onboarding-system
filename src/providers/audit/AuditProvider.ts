import { AuditEventType } from "../../types/audit";

export interface AuditEventInput {
  applicationId?: number;
  eventType: AuditEventType;
  provider: string;
  model?: string;
  modelVersion?: string;
  inputData: Record<string, unknown>;
  decision: string;
  riskLevel?: string;
  reasons: string[];
  previousEventHash?: string;
}

export interface AuditEvent {
  inputHash: string;
  outputHash: string;
  eventHash: string;
  previousEventHash?: string;
  hashAlgorithm: "SHA-256";
}

export interface AuditProvider {
  createAuditEvent(
    input: AuditEventInput
  ): Promise<AuditEvent>;
}