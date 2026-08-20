import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.renameTable(
    "ai_audit_events",
    "audit_events"
  );
};

export const down = (pgm: MigrationBuilder) => {
  pgm.renameTable(
    "audit_events",
    "ai_audit_events"
  );
};