import pool from "../db/db";
import {verifyAuditEvent, verifyAuditChain} from "./audit-verifier";
import { AuditEventToVerify } from "./audit-verifier";
import { sha256 } from "./hashing";

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

test("detects a broken previous event hash", () => {
  const firstEvent: AuditEventToVerify = {
    applicationId: 4,
    provider: "mock",
    model: "mock",
    modelVersion: "1",
    inputHash: "input-1",
    outputHash: "output-1",
    previousEventHash: null,
    decision: "approved" as const,
    riskLevel: "low" as const,
    reasons: ["reason 1"],
    eventHash: ""
  };

  firstEvent.eventHash = sha256({
    applicationId: firstEvent.applicationId,
    provider: firstEvent.provider,
    model: firstEvent.model,
    modelVersion: firstEvent.modelVersion,
    inputHash: firstEvent.inputHash,
    outputHash: firstEvent.outputHash,
    previousEventHash: null
  });

  const secondEvent = {
    ...firstEvent,
    previousEventHash: "tampered",
    inputHash: "input-2",
    outputHash: "output-2",
    eventHash: ""
  };

  secondEvent.eventHash = sha256({
    applicationId: secondEvent.applicationId,
    provider: secondEvent.provider,
    model: secondEvent.model,
    modelVersion: secondEvent.modelVersion,
    inputHash: secondEvent.inputHash,
    outputHash: secondEvent.outputHash,
    previousEventHash: secondEvent.previousEventHash
  });

  expect(
    verifyAuditChain([firstEvent, secondEvent])
  ).toBe(false);
});

test("accepts a valid audit chain", () => {
  const firstEvent: AuditEventToVerify = {
    applicationId: 4,
    provider: "mock",
    model: "mock",
    modelVersion: "1",
    inputHash: "input-1",
    outputHash: "",
    previousEventHash: null,
    decision: "approved",
    riskLevel: "low",
    reasons: ["reason 1"],
    eventHash: ""
  };

  firstEvent.outputHash = sha256({
    decision: firstEvent.decision,
    riskLevel: firstEvent.riskLevel,
    reasons: firstEvent.reasons
  });

  firstEvent.eventHash = sha256({
    applicationId: firstEvent.applicationId,
    provider: firstEvent.provider,
    model: firstEvent.model,
    modelVersion: firstEvent.modelVersion,
    inputHash: firstEvent.inputHash,
    outputHash: firstEvent.outputHash,
    previousEventHash: null
  });

  const secondEvent: AuditEventToVerify = {
    applicationId: 4,
    provider: "mock",
    model: "mock",
    modelVersion: "1",
    inputHash: "input-2",
    outputHash: "",
    previousEventHash: firstEvent.eventHash,
    decision: "approved",
    riskLevel: "low",
    reasons: ["reason 2"],
    eventHash: ""
  };

  secondEvent.outputHash = sha256({
    decision: secondEvent.decision,
    riskLevel: secondEvent.riskLevel,
    reasons: secondEvent.reasons
  });

  secondEvent.eventHash = sha256({
    applicationId: secondEvent.applicationId,
    provider: secondEvent.provider,
    model: secondEvent.model,
    modelVersion: secondEvent.modelVersion,
    inputHash: secondEvent.inputHash,
    outputHash: secondEvent.outputHash,
    previousEventHash: secondEvent.previousEventHash
  });

  expect(
    verifyAuditChain([firstEvent, secondEvent])
  ).toBe(true);
});

  afterAll(async () => {
    await pool.end();
  });
});