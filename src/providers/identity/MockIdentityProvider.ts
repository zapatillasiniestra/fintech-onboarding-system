import type {
  IdentityRequest,
  IdentityVerification,
} from "../../types/application";
import type { IdentityProvider } from "./IdentityProvider";

export class MockIdentityProvider
  implements IdentityProvider
{
  async verifyIdentity(
    input: IdentityRequest
  ): Promise<IdentityVerification> {
    return {
      verified: true,
      confidence: 0.99,
      provider: "mock",
      decision: "approved",
      reasons: [],
      externalId: `mock-${input.email}`,
      raw: {
        fullName: input.full_name,
        email: input.email,
      },
    };
  }
}