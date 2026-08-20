import { MockComplianceProvider } from "./MockComplianceProvider";

describe("MockComplianceProvider", () => {
  test("returns a normalized compliance result", async () => {
    const provider = new MockComplianceProvider();

    const result = await provider.check({
      applicationId: 35,
      fullName: "Test User",
      email: "test@example.com",
    });

    expect(result).toEqual({
      provider: "mock",
      decision: "clear",
      reasons: [],
      externalId: "mock-35",
      raw: {
        source: "mock",
      },
    });
  });
});