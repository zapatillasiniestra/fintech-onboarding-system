import pool from "../db/db";
import { verifyAuditEvent } from "./audit-verifier";

describe("verifyAuditEvent", () => {
  test("accepts an untampered database event", async () => {
    const client = await pool.connect();

    try {
      const result = await client.query(`
        SELECT *
        FROM ai_audit_events
        WHERE application_id = 4
        ORDER BY id ASC
        LIMIT 1
      `);

      const row = result.rows[0];

      expect(row).toBeDefined();

      const event = {
        applicationId: row.application_id,
        provider: row.provider,
        model: row.model,
        modelVersion: row.model_version,
        inputHash: row.input_hash,
        outputHash: row.output_hash,
        previousEventHash: row.previous_event_hash,
        decision: row.decision,
        riskLevel: row.risk_level,
        reasons: row.reasons,
        eventHash: row.event_hash
      };

      expect(
        verifyAuditEvent(event)
      ).toBe(true);
    } finally {
      client.release();
    }
  });

  test("detects a modified decision", async () => {
    const client = await pool.connect();

    try {
      const result = await client.query(`
        SELECT *
        FROM ai_audit_events
        WHERE application_id = 4
        ORDER BY id ASC
        LIMIT 1
      `);

      const row = result.rows[0];

      expect(row).toBeDefined();

      const event = {
        applicationId: row.application_id,
        provider: row.provider,
        model: row.model,
        modelVersion: row.model_version,
        inputHash: row.input_hash,
        outputHash: row.output_hash,
        previousEventHash: row.previous_event_hash,
        decision: row.decision,
        riskLevel: row.risk_level,
        reasons: row.reasons,
        eventHash: row.event_hash
      };

      const tamperedEvent = {
        ...event,
        decision: "rejected" as const
      };

      expect(
        verifyAuditEvent(tamperedEvent)
      ).toBe(false);
    } finally {
      client.release();
    }
  });

  test("detects a modified output hash", async () => {
    const client = await pool.connect();

    try {
      const result = await client.query(`
        SELECT *
        FROM ai_audit_events
        WHERE application_id = 4
        ORDER BY id ASC
        LIMIT 1
      `);

      const row = result.rows[0];

      expect(row).toBeDefined();

      const event = {
        applicationId: row.application_id,
        provider: row.provider,
        model: row.model,
        modelVersion: row.model_version,
        inputHash: row.input_hash,
        outputHash: row.output_hash,
        previousEventHash: row.previous_event_hash,
        decision: row.decision,
        riskLevel: row.risk_level,
        reasons: row.reasons,
        eventHash: row.event_hash
      };

      expect(
        verifyAuditEvent({
          ...event,
          outputHash: "tampered"
        })
      ).toBe(false);
    } finally {
      client.release();
    }
  });

  test("detects a modified previous event hash", async () => {
    const client = await pool.connect();

    try {
      const result = await client.query(`
        SELECT *
        FROM ai_audit_events
        WHERE application_id = 4
        ORDER BY id ASC
        LIMIT 1
      `);

      const row = result.rows[0];

      expect(row).toBeDefined();

      const event = {
        applicationId: row.application_id,
        provider: row.provider,
        model: row.model,
        modelVersion: row.model_version,
        inputHash: row.input_hash,
        outputHash: row.output_hash,
        previousEventHash: row.previous_event_hash,
        decision: row.decision,
        riskLevel: row.risk_level,
        reasons: row.reasons,
        eventHash: row.event_hash
      };

      expect(
        verifyAuditEvent({
          ...event,
          previousEventHash: "tampered"
        })
      ).toBe(false);
    } finally {
      client.release();
    }
  });

  afterAll(async () => {
    await pool.end();
  });
});