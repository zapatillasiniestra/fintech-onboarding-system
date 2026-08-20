import type {
  IdentityRequest,
  IdentityVerification,
} from "../../types/application";

export interface IdentityProvider {
  verifyIdentity(
    input: IdentityRequest
  ): Promise<IdentityVerification>;
}