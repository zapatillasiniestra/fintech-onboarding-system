import { createIdentityProvider } from "./IdentityProviderFactory";
import { LocalIdentityProvider } from "./LocalIdentityProvider";
import { MockIdentityProvider } from "./MockIdentityProvider";

describe("IdentityProviderFactory", () => {
  const originalProvider =
    process.env.IDENTITY_PROVIDER;

  afterEach(() => {
    if (originalProvider === undefined) {
      delete process.env.IDENTITY_PROVIDER;
    } else {
      process.env.IDENTITY_PROVIDER =
        originalProvider;
    }
  });

  test("creates local provider by default", () => {
    delete process.env.IDENTITY_PROVIDER;

    const provider = createIdentityProvider();

    expect(provider).toBeInstanceOf(
      LocalIdentityProvider
    );
  });

  test("creates mock provider when configured", () => {
    process.env.IDENTITY_PROVIDER = "mock";

    const provider = createIdentityProvider();

    expect(provider).toBeInstanceOf(
      MockIdentityProvider
    );
  });

  test("rejects unsupported provider", () => {
    process.env.IDENTITY_PROVIDER = "invalid";

    expect(() => createIdentityProvider())
      .toThrow(
        "Unsupported identity provider: invalid"
      );
  });
});