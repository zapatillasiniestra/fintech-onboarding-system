import type { Decision } from "./application";

export type AIRiskLevel =
  | "low"
  | "medium"
  | "high";

export interface AIAssessment {
  id: number;
  applicationId: number;
  riskLevel: AIRiskLevel;
  decision: Decision;
  reasons: string[];
  model: string;
  createdAt: Date;
}