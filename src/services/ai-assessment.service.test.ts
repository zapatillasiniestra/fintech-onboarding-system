import pool from "../db/db";
import { assessApplication } from "./ai-assessment.service";

describe("AI assessment audit chain", () => {
  test("creates chained audit events for an application", async () => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const applicationResult = await client.query(
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
        RETURNING *
        `,
        [
          4,
          "pending",
          "Audit Test User",
          "audit-test@example.com",
          "mock",
          "approved"
        ]
      );

      const application = applicationResult.rows[0];

      const verification = {
        verified: true,
        confidence: 0.99,
        provider: "mock",
        decision: "approved" as const,
        externalId: "test",
        reasons: [],
        raw: {}
      };

      await assessApplication(
        client,
        application.id,
        {
          fullName: application.full_name,
          email: application.email,
          verification
        }
      );

      await assessApplication(
        client,
        application.id,
        {
          fullName: application.full_name,
          email: application.email,
          verification
        }
      );

      const auditResult = await client.query(
        `
        SELECT
          id,
          application_id,
          event_type,
          previous_event_hash,
          event_hash
        FROM audit_events
        WHERE application_id = $1
        ORDER BY id ASC
        `,
        [application.id]
      );

      expect(auditResult.rows).toHaveLength(2);

      const firstEvent = auditResult.rows[0];
      const secondEvent = auditResult.rows[1];

      expect(firstEvent.event_type)
        .toBe("ai.assessment.completed");

      expect(secondEvent.event_type)
        .toBe("ai.assessment.completed");

      expect(firstEvent.previous_event_hash)
        .toBeNull();

      expect(secondEvent.previous_event_hash)
        .toBe(firstEvent.event_hash);

      expect(secondEvent.event_hash)
        .not.toBe(firstEvent.event_hash);
        
      expect(auditResult.rows[0].event_type)
        .toBe("ai.assessment.completed");

      expect(auditResult.rows[1].event_type)
        .toBe("ai.assessment.completed");

      expect(auditResult.rows[0].previous_event_hash)
        .toBeNull();

      expect(auditResult.rows[1].previous_event_hash)
        .toBe(auditResult.rows[0].event_hash);

        expect(auditResult.rows).toHaveLength(2);

      await client.query("ROLLBACK");

    } catch (error) {
      await client.query("ROLLBACK");
      throw error;

    } finally {
      client.release();
    }
  });

  afterAll(async () => {
    await pool.end();
  });
});