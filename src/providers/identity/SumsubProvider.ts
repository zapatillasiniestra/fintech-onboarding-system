import { IdentityProvider } from "./IdentityProvider";
import { IdentityRequest, IdentityVerification } from "../../types/application";

export class SumsubProvider
  implements IdentityProvider {

  async verifyIdentity(
    _request: IdentityRequest
  ): Promise<IdentityVerification> {

    return {
      verified: true,
      provider: "sumsub",
      confidence: 0.97,
      externalId: crypto.randomUUID(),
      reasons: ["Sumsub verification successful"],
      raw: {"sumsub": "raw data"}
    };

  }
}