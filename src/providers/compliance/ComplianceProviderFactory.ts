import { ComplianceProvider } from "./ComplianceProvider";
import { LocalComplianceProvider } from "./LocalComplianceProvider";
import { MockComplianceProvider } from "./MockComplianceProvider";

export function createComplianceProvider(): ComplianceProvider {
  switch (process.env.COMPLIANCE_PROVIDER) {
    case "local":
      return new LocalComplianceProvider();

    case "mock":
      return new MockComplianceProvider();

    default:
      throw new Error(
        `Unsupported COMPLIANCE_PROVIDER: ${process.env.COMPLIANCE_PROVIDER}`
      );
  }
}