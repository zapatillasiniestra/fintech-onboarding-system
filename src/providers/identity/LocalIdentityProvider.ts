import type {
  IdentityRequest,
  IdentityVerification,
} from "../../types/application";
import type { IdentityProvider } from "./IdentityProvider";

export class LocalIdentityProvider
  implements IdentityProvider
{
  async verifyIdentity(
    input: IdentityRequest
  ): Promise<IdentityVerification> {
    const verified =
      Boolean(input.full_name?.trim()) &&
      Boolean(input.email?.trim());

    return {
      verified,
      confidence: verified ? 1 : 0,
      provider: "local",
      decision: verified ? "approved" : "rejected",
      reasons: verified
        ? []
        : ["Missing identity information"],
      externalId: `local-${input.email}`,
      raw: {
        fullName: input.full_name,
        email: input.email,
      },
    };
  }
}