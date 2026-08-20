import pool from "../db/db";
import repository
  from "./identity-verifications.repository";

describe("identity-verifications.repository", () => {
  test("creates an identity verification", async () => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const application = await client.query(
        `
        INSERT INTO applications (
          user_id,
          status,
          full_name,
          email,
          identity_provider,
          identity_decision
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        `,
        [
          4,
          "pending",
          "Identity Test User",
          "identity-test@example.com",
          "mock",
          "approved",
        ]
      );

      const result = await repository.create(
        client,
        {
          applicationId: application.rows[0].id,
          provider: "mock",
          verified: true,
          confidence: 0.99,
          decision: "approved",
          reasons: [],
          externalId: "mock-1",
          raw: {
            source: "mock",
          },
        }
      );

      expect(result.provider).toBe("mock");
      expect(result.verified).toBe(true);
      expect(Number(result.confidence)).toBe(0.99);

      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  });

  afterAll(async () => {
    await pool.end();
  });
});