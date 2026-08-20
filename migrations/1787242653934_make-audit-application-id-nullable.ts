import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.alterColumn("audit_events", "application_id", {
    notNull: false,
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.alterColumn("audit_events", "application_id", {
    notNull: true,
  });
};