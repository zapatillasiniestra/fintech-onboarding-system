import {
  IdentityProvider,
  VerificationResult
} from "./IdentityProvider";

import { Application } from "../../types/application";

export class SumsubProvider
  implements IdentityProvider {

  async verifyIdentity(
    _application: Application
  ): Promise<VerificationResult> {

    // TODO:
    // Call Sumsub API

    return {
      verified: true,
      confidence: 0.97
    };

  }
}