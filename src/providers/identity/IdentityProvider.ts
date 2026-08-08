import { IdentityRequest, IdentityVerification } from "../../types/application";

export interface IdentityProvider {
  verifyIdentity(
    request: IdentityRequest
  ): Promise<IdentityVerification>;
}