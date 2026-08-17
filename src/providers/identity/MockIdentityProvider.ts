import { IdentityRequest, IdentityVerification } from "../../types/application";
import { IdentityProvider } from "./IdentityProvider";

export class MockIdentityProvider
  implements IdentityProvider {

  async verifyIdentity(
    _request: IdentityRequest
  ): Promise<IdentityVerification> {

    return {
        verified: true,
        confidence: 0.98,
        provider: "mock",
        decision: "approved",
        externalId: crypto.randomUUID(),
        reasons: ["Mock verification successful"],
        raw: {"mock": "raw data"}
    };
  }
}