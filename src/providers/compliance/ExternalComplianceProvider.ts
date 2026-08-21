import type {
  ComplianceCheckInput,
  ComplianceCheckResult,
  ComplianceProvider,
} from "./ComplianceProvider";

export class ExternalComplianceProvider
  implements ComplianceProvider
{
  async check(
    input: ComplianceCheckInput
  ): Promise<ComplianceCheckResult> {
    const url = process.env.COMPLIANCE_API_URL;
    const apiKey = process.env.COMPLIANCE_API_KEY;

    if (!url) {
      throw new Error(
        "COMPLIANCE_API_URL is not configured"
      );
    }

    if (!apiKey) {
      throw new Error(
        "COMPLIANCE_API_KEY is not configured"
      );
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        applicationId: input.applicationId,
        fullName: input.fullName,
        email: input.email,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Compliance provider returned ${response.status}`
      );
    }

    const data = await response.json() as {
      decision?: string;
      reasons?: string[];
      externalId?: string;
      raw?: Record<string, unknown>;
    };

    if (
      !data.decision ||
      !Array.isArray(data.reasons)
    ) {
      throw new Error(
        "Invalid compliance provider response"
      );
    }

    return {
      provider: "external",
      decision: data.decision as
        | "clear"
        | "flagged"
        | "manual_review",
      reasons: data.reasons,
      externalId: data.externalId,
      raw: data.raw ?? data,
    };
  }
}