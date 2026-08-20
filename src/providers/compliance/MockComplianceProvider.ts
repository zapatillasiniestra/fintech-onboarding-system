import type {
  ComplianceCheckInput,
  ComplianceCheckResult,
  ComplianceProvider,
} from "./ComplianceProvider";

export class MockComplianceProvider
  implements ComplianceProvider
{
  async check(
    input: ComplianceCheckInput
  ): Promise<ComplianceCheckResult> {
    return {
      provider: "mock",
      decision: "clear",
      reasons: [],
      externalId: `mock-${input.applicationId}`,
      raw: {
        source: "mock",
      },
    };
  }
}