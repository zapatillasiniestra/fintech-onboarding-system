import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumn("ai_audit_events", {
    hash_algorithm: {
      type: "text",
      notNull: true,
      default: "SHA-256",
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropColumn("ai_audit_events", "hash_algorithm");
};