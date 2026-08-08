import { IdentityProvider, VerificationResult } from "./IdentityProvider";
import { Application } from "../../types/application";

export class MockIdentityProvider
  implements IdentityProvider {

  async verifyIdentity(
    _application: Application
  ): Promise<VerificationResult> {

    return {
      verified: true,
      confidence: 0.98
    };

  }
}