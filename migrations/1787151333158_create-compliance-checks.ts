import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable("compliance_checks", {
    id: "id",

    application_id: {
      type: "integer",
      notNull: true,
      references: "applications",
      onDelete: "CASCADE",
    },

    provider: {
      type: "text",
      notNull: true,
    },

    decision: {
      type: "text",
      notNull: true,
    },

    reasons: {
      type: "jsonb",
      notNull: true,
    },

    external_id: {
      type: "text",
    },

    raw: {
      type: "jsonb",
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex(
    "compliance_checks",
    "application_id"
  );
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable("compliance_checks");
};