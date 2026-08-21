import { ExternalComplianceProvider } from "./ExternalComplianceProvider";

describe("ExternalComplianceProvider", () => {
  const originalUrl =
    process.env.COMPLIANCE_API_URL;

  const originalKey =
    process.env.COMPLIANCE_API_KEY;

  afterEach(() => {
    process.env.COMPLIANCE_API_URL =
      originalUrl;

    process.env.COMPLIANCE_API_KEY =
      originalKey;

    jest.restoreAllMocks();
  });

  test("sends a compliance request and normalizes the response", async () => {
    process.env.COMPLIANCE_API_URL =
      "https://test.com/check";

    process.env.COMPLIANCE_API_KEY =
      "test-key";

    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            decision: "clear",
            reasons: [],
            externalId: "external-123",
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      );

    const provider =
      new ExternalComplianceProvider();

    const result = await provider.check({
      applicationId: 75,
      fullName: "Test User",
      email: "test@example.com",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://test.com/check",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-key",
        },
      })
    );

    expect(result).toEqual({
      provider: "external",
      decision: "clear",
      reasons: [],
      externalId: "external-123",
      raw: {
        decision: "clear",
        reasons: [],
        externalId: "external-123",
      },
    });
  });

  test("throws when the provider returns an error", async () => {
    process.env.COMPLIANCE_API_URL =
      "https://test.com/check";

    process.env.COMPLIANCE_API_KEY =
      "test-key";

    jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(null, {
          status: 503,
        })
      );

    const provider =
      new ExternalComplianceProvider();

    await expect(
      provider.check({
        applicationId: 75,
        fullName: "Test User",
        email: "test@example.com",
      })
    ).rejects.toThrow(
      "Compliance provider returned 503"
    );
  });

  test("throws when the response is invalid", async () => {
    process.env.COMPLIANCE_API_URL =
      "https://test.com/check";

    process.env.COMPLIANCE_API_KEY =
      "test-key";

    jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            foo: "bar",
          }),
          {
            status: 200,
          }
        )
      );

    const provider =
      new ExternalComplianceProvider();

    await expect(
      provider.check({
        applicationId: 75,
        fullName: "Test User",
        email: "test@example.com",
      })
    ).rejects.toThrow(
      "Invalid compliance provider response"
    );
  });
});