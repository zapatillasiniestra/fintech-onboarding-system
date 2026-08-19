import type { ComplianceProvider } from "./ComplianceProvider";
import { LocalComplianceProvider } from "./LocalComplianceProvider";

export function createComplianceProvider(): ComplianceProvider {
  switch (process.env.COMPLIANCE_PROVIDER) {
    case "local":
    default:
      return new LocalComplianceProvider();
  }
}