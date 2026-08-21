import type { ComplianceProvider } from "./ComplianceProvider";
import { LocalComplianceProvider } from "./LocalComplianceProvider";
import { MockComplianceProvider } from "./MockComplianceProvider";
import { ExternalComplianceProvider } from "./ExternalComplianceProvider";

export function createComplianceProvider(): ComplianceProvider {
  const provider =
    process.env.COMPLIANCE_PROVIDER;

  switch (provider) {
    case "local":
      return new LocalComplianceProvider();

    case "mock":
      return new MockComplianceProvider();

    case "external":
      return new ExternalComplianceProvider();

    default:
      throw new Error(
        `Unsupported COMPLIANCE_PROVIDER: ${provider}`
      );
  }
}