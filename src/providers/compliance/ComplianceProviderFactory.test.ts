import { createComplianceProvider } from "./ComplianceProviderFactory";
import { LocalComplianceProvider } from "./LocalComplianceProvider";
import { MockComplianceProvider } from "./MockComplianceProvider";

describe("ComplianceProviderFactory", () => {
  const originalProvider = process.env.COMPLIANCE_PROVIDER;

  afterEach(() => {
    process.env.COMPLIANCE_PROVIDER = originalProvider;
  });

  test("creates local provider", () => {
    process.env.COMPLIANCE_PROVIDER = "local";

    expect(createComplianceProvider())
      .toBeInstanceOf(LocalComplianceProvider);
  });

  test("creates mock provider", () => {
    process.env.COMPLIANCE_PROVIDER = "mock";

    expect(createComplianceProvider())
      .toBeInstanceOf(MockComplianceProvider);
  });

  test("rejects an unsupported provider", () => {
    process.env.COMPLIANCE_PROVIDER = "invalid";

    expect(() => createComplianceProvider())
        .toThrow("Unsupported COMPLIANCE_PROVIDER: invalid");
    });

    test("rejects missing provider configuration", () => {
    delete process.env.COMPLIANCE_PROVIDER;

    expect(() => createComplianceProvider())
        .toThrow("Unsupported COMPLIANCE_PROVIDER: undefined");
    });

});
