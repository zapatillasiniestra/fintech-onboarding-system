import type {
  ComplianceCheckInput,
  ComplianceCheckResult,
  ComplianceProvider,
} from "./ComplianceProvider";

export class LocalComplianceProvider
  implements ComplianceProvider {

  async check(
    input: ComplianceCheckInput
  ): Promise<ComplianceCheckResult> {
    return {
      provider: "local",
      checked: true,
      decision: "clear",
      reasons: [],
      externalId: `local-${input.applicationId}`,
      raw: {
        applicationId: input.applicationId,
        fullName: input.fullName,
        email: input.email,
      },
    };
  }
}