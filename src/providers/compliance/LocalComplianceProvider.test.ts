import { LocalComplianceProvider } from "./LocalComplianceProvider";

describe("LocalComplianceProvider", () => {
  test("returns a clear compliance result", async () => {
    const provider = new LocalComplianceProvider();

    const result = await provider.check({
      applicationId: 1,
      fullName: "Test User",
      email: "test@example.com",
    });

    expect(result.provider).toBe("local");
    expect(result.checked).toBe(true);
    expect(result.decision).toBe("clear");
    expect(result.reasons).toEqual([]);
    expect(result.externalId).toBe("local-1");
  });
});