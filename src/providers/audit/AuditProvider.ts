import type { Decision } from "../../types/application";
import type { AIRiskLevel } from "../../types/ai-assessment";

export interface AIAuditEventInput {
  applicationId: number;
  provider: string;
  model: string;
  modelVersion?: string;
  inputData: Record<string, unknown>;
  decision: Decision;
  riskLevel: AIRiskLevel;
  reasons: string[];
  previousEventHash?: string;
}

export interface AIAuditEvent {
  inputHash: string;
  outputHash: string;
  eventHash: string;
  previousEventHash?: string;
  hashAlgorithm: "SHA-256";
}

export interface AuditProvider {
  createAIAuditEvent(
    input: AIAuditEventInput
  ): Promise<AIAuditEvent>;
}