export interface ComplianceCheckInput {
  applicationId: number;
  fullName: string;
  email: string;
}

export interface ComplianceCheckResult {
  provider: string;
  checked?: boolean;
  decision: "clear" | "flagged" | "manual_review";
  reasons: string[];
  externalId?: string;
  raw?: Record<string, unknown>;
}

export interface ComplianceProvider {
  check(
    input: ComplianceCheckInput
  ): Promise<ComplianceCheckResult>;
}