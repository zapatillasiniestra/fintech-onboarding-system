import { ExternalIdentityProvider } from "./ExternalIdentityProvider";

describe("ExternalIdentityProvider", () => {
  const originalUrl =
    process.env.IDENTITY_API_URL;

  const originalKey =
    process.env.IDENTITY_API_KEY;

  afterEach(() => {
    process.env.IDENTITY_API_URL =
      originalUrl;

    process.env.IDENTITY_API_KEY =
      originalKey;

    jest.restoreAllMocks();
  });

  test("sends an identity request and normalizes the response", async () => {
    process.env.IDENTITY_API_URL =
      "https://example.com/identity";

    process.env.IDENTITY_API_KEY =
      "test-key";

    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            verified: true,
            confidence: 0.99,
            decision: "approved",
            reasons: [],
            externalId: "identity-123",
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
      new ExternalIdentityProvider();

    const result =
      await provider.verifyIdentity({
        full_name: "Test User",
        email: "test@example.com",
      });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/identity",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-key",
        },
      })
    );

    expect(result).toEqual({
      verified: true,
      confidence: 0.99,
      provider: "external",
      decision: "approved",
      reasons: [],
      externalId: "identity-123",
      raw: {
        verified: true,
        confidence: 0.99,
        decision: "approved",
        reasons: [],
        externalId: "identity-123",
      },
    });
  });

  test("throws when the provider returns an error", async () => {
    process.env.IDENTITY_API_URL =
      "https://example.com/identity";

    process.env.IDENTITY_API_KEY =
      "test-key";

    jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(null, {
          status: 503,
        })
      );

    const provider =
      new ExternalIdentityProvider();

    await expect(
      provider.verifyIdentity({
        full_name: "Test User",
        email: "test@example.com",
      })
    ).rejects.toThrow(
      "Identity provider returned 503"
    );
  });

  test("throws when the response is invalid", async () => {
    process.env.IDENTITY_API_URL =
      "https://example.com/identity";

    process.env.IDENTITY_API_KEY =
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
      new ExternalIdentityProvider();

    await expect(
      provider.verifyIdentity({
        full_name: "Test User",
        email: "test@example.com",
      })
    ).rejects.toThrow(
      "Invalid identity provider response"
    );
  });
});