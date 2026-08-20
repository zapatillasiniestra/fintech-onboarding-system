import { LocalIdentityProvider } from "./LocalIdentityProvider";

describe("LocalIdentityProvider", () => {
  test("verifies a valid identity request", async () => {
    const provider = new LocalIdentityProvider();

    const result = await provider.verifyIdentity({
      full_name: "Nahuel Alfaro",
      email: "nahuel@test.com",
    });

    expect(result.verified).toBe(true);
    expect(result.confidence).toBe(1);
    expect(result.provider).toBe("local");
    expect(result.decision).toBe("approved");
    expect(result.reasons).toEqual([]);
  });

  test("rejects missing identity information", async () => {
    const provider = new LocalIdentityProvider();

    const result = await provider.verifyIdentity({
      full_name: "",
      email: "",
    });

    expect(result.verified).toBe(false);
    expect(result.confidence).toBe(0);
    expect(result.decision).toBe("rejected");
    expect(result.reasons).toContain(
      "Missing identity information"
    );
  });
});