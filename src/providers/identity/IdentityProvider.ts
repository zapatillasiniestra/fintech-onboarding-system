import { Application } from "../../types/application";

export interface VerificationResult {
  verified: boolean;
  confidence: number;
  reason?: string;
}

export interface IdentityProvider {
  verifyIdentity(
    application: Application
  ): Promise<VerificationResult>;
}