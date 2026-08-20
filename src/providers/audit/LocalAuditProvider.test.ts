import { LocalAuditProvider } from "./LocalAuditProvider";
import type { AuditEventInput } from "./AuditProvider";

describe("LocalAuditProvider", () => {
  test("creates hashes for an AI audit event", async () => {
    const provider = new LocalAuditProvider();

    const event = await provider.createAuditEvent({
      applicationId: 1,
      eventType: "ai.assessment.completed",
      provider: "mock",
      model: "mock",
      modelVersion: "1",
      inputData: {
        fullName: "Nahuel Alfaro",
        email: "nahuel@test.com",
      },
      decision: "approved",
      riskLevel: "low",
      reasons: [
        "No significant risk indicators detected.",
      ],
    });

    expect(event.hashAlgorithm).toBe("SHA-256");
    expect(event.inputHash).toHaveLength(64);
    expect(event.outputHash).toHaveLength(64);
    expect(event.eventHash).toHaveLength(64);
  });

  test("changes the output hash when AI decision changes", async () => {
    const provider = new LocalAuditProvider();

    const baseInput: AuditEventInput = {
      applicationId: 1,
      eventType: "ai.assessment.completed",
      provider: "mock",
      model: "mock",
      inputData: {
        fullName: "Nahuel Alfaro",
        email: "nahuel@test.com",
      },
      decision: "approved",
      riskLevel: "low",
      reasons: [
        "No significant risk indicators detected.",
      ],
    };

    const approved = await provider.createAuditEvent({
      ...baseInput,
      decision: "approved",
    });

    const rejected = await provider.createAuditEvent({
      ...baseInput,
      decision: "rejected",
    });

    expect(approved.outputHash).not.toBe(
      rejected.outputHash
    );

    expect(approved.eventHash).not.toBe(
      rejected.eventHash
    );
  });

  test("changes the event hash when the previous event hash changes", async () => {
    const provider = new LocalAuditProvider();

    const baseInput: AuditEventInput = {
      applicationId: 1,
      eventType: "ai.assessment.completed",
      provider: "mock",
      model: "mock",
      inputData: {
        fullName: "Nahuel Alfaro",
        email: "nahuel@test.com",
      },
      decision: "approved",
      riskLevel: "low",
      reasons: [
        "No significant risk indicators detected.",
      ],
    };

    const first = await provider.createAuditEvent({
      ...baseInput,
      previousEventHash: undefined,
    });

    const second = await provider.createAuditEvent({
      ...baseInput,
      previousEventHash: first.eventHash,
    });

    const third = await provider.createAuditEvent({
      ...baseInput,
      previousEventHash: "completely-different-hash",
    });

    expect(second.previousEventHash).toBe(first.eventHash);
    expect(second.eventHash).not.toBe(first.eventHash);
    expect(second.eventHash).not.toBe(third.eventHash);
  });

  test("changes the event hash when the event type changes", async () => {
    const provider = new LocalAuditProvider();

    const baseInput: Omit<AuditEventInput, "eventType"> = {
      applicationId: 1,
      provider: "mock",
      model: "mock",
      inputData: {
        fullName: "Nahuel Alfaro",
        email: "nahuel@test.com",
      },
      decision: "approved",
      riskLevel: "low",
      reasons: [
        "No significant risk indicators detected.",
      ],
    };

    const aiEvent = await provider.createAuditEvent({
      ...baseInput,
      eventType: "ai.assessment.completed",
    });

    const identityEvent = await provider.createAuditEvent({
      ...baseInput,
      eventType: "identity.verification.completed",
    });

    expect(aiEvent.eventHash).not.toBe(
      identityEvent.eventHash
    );
  });
});