import type { IdentityProvider } from "./IdentityProvider";
import { LocalIdentityProvider } from "./LocalIdentityProvider";
import { MockIdentityProvider } from "./MockIdentityProvider";

export function createIdentityProvider(): IdentityProvider {
  const provider =
    process.env.IDENTITY_PROVIDER ?? "local";

  switch (provider) {
    case "local":
      return new LocalIdentityProvider();

    case "mock":
      return new MockIdentityProvider();

    default:
      throw new Error(
        `Unsupported identity provider: ${provider}`
      );
  }
}