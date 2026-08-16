import type {
  Decision,
  IdentityVerification
} from "../../types/application";

export interface AIAssessmentInput {
  fullName: string;
  email: string;
  verification: IdentityVerification;
}

export interface AIAssessment {
  riskLevel: "low" | "medium" | "high";
  decision: Decision;
  reasons: string[];
}