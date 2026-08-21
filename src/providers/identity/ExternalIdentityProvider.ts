import type {
  IdentityRequest,
  IdentityVerification,
} from "../../types/application";

import type { IdentityProvider } from "./IdentityProvider";

export class ExternalIdentityProvider
  implements IdentityProvider
{
  async verifyIdentity(
    input: IdentityRequest
  ): Promise<IdentityVerification> {
    const url = process.env.IDENTITY_API_URL;
    const apiKey = process.env.IDENTITY_API_KEY;

    if (!url) {
      throw new Error(
        "IDENTITY_API_URL is not configured"
      );
    }

    if (!apiKey) {
      throw new Error(
        "IDENTITY_API_KEY is not configured"
      );
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        fullName: input.full_name,
        email: input.email,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Identity provider returned ${response.status}`
      );
    }

    const data = await response.json() as {
      verified?: boolean;
      confidence?: number;
      decision?: "approved" | "rejected" | "manual_review";
      reasons?: string[];
      externalId?: string;
      raw?: Record<string, unknown>;
    };

    if (
      typeof data.verified !== "boolean" ||
      typeof data.confidence !== "number" ||
      !data.decision ||
      !Array.isArray(data.reasons)
    ) {
      throw new Error(
        "Invalid identity provider response"
      );
    }

    return {
      verified: data.verified,
      confidence: data.confidence,
      provider: "external",
      decision: data.decision,
      reasons: data.reasons,
      externalId: data.externalId,
      raw: data.raw ?? data,
    };
  }
}