import type { IdentityProvider } from "./IdentityProvider";
import { LocalIdentityProvider } from "./LocalIdentityProvider";
import { MockIdentityProvider } from "./MockIdentityProvider";
import { ExternalIdentityProvider } from "./ExternalIdentityProvider";
import { SumsubProvider } from "../identity/SumsubProvider";

export function createIdentityProvider(): IdentityProvider {
  const provider = process.env.IDENTITY_PROVIDER ?? "local";

  switch (provider) {
    case "local":
      return new LocalIdentityProvider();

    case "mock":
      return new MockIdentityProvider();

    case "external":
      return new ExternalIdentityProvider();

    case "sumsub":
      return new SumsubProvider();

    default:
      throw new Error(
        `Unsupported identity provider: ${provider}`
      );
  }
}