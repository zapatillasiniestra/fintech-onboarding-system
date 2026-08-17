import pool from "../db/db";
import { assessApplication } from "./ai-assessment.service";

describe("AI assessment audit chain", () => {
  test("creates a chained audit event for an existing application", async () => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const applicationId = 4;

      const applicationResult = await client.query(
        `
        SELECT *
        FROM applications
        WHERE id = $1
        `,
        [applicationId]
      );

      const application = applicationResult.rows[0];

      if (!application) {
        throw new Error(
          `Application ${applicationId} not found`
        );
      }

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
        applicationId,
        {
          fullName: application.full_name,
          email: application.email,
          verification
        }
      );

    const assessmentResult = await client.query(
        `
        SELECT *
        FROM ai_assessments
        WHERE application_id = $1
        ORDER BY id ASC
        `,
        [applicationId]
        );

        console.log("AI ASSESSMENTS:", assessmentResult.rows);

        const auditResult = await client.query(
        `
        SELECT
            id,
            application_id,
            previous_event_hash,
            event_hash
        FROM ai_audit_events
        WHERE application_id = $1
        ORDER BY id ASC
        `,
        [applicationId]
        );

        console.log("AUDIT EVENTS:", auditResult.rows);

      expect(auditResult.rows.length).toBeGreaterThanOrEqual(2);

      const firstEvent = auditResult.rows[0];
      const secondEvent = auditResult.rows[1];

      expect(firstEvent.previous_event_hash).toBeNull();

      expect(secondEvent.previous_event_hash)
        .toBe(firstEvent.event_hash);

      expect(secondEvent.event_hash)
        .not.toBe(firstEvent.event_hash);

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