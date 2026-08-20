import { MockIdentityProvider } from "./MockIdentityProvider";

describe("MockIdentityProvider", () => {
  test("returns a successful verification", async () => {
    const provider = new MockIdentityProvider();

    const result = await provider.verifyIdentity({
      full_name: "Test User",
      email: "test@example.com",
    });

    expect(result.verified).toBe(true);
    expect(result.confidence).toBe(0.99);
    expect(result.provider).toBe("mock");
    expect(result.decision).toBe("approved");
  });
});