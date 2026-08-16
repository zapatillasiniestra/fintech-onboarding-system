import type {
  AIAssessment,
  AIAssessmentInput
} from "./AIAssessment";
import type { AIProvider } from "./AIProvider";

export class MockAIProvider implements AIProvider {
  async assessApplication(
    input: AIAssessmentInput
  ): Promise<AIAssessment> {

    if (input.verification.decision === "manual_review") {
      return {
        riskLevel: "medium",
        decision: "manual_review",
        reasons: [
          "Identity verification requires manual review."
        ]
      };
    }

    return {
      riskLevel: "low",
      decision: "approved",
      reasons: [
        "No significant risk indicators detected."
      ]
    };
  }
}