import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable("ai_audit_events", {
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

    model: {
      type: "text",
      notNull: true,
    },

    model_version: {
      type: "text",
    },

    input_data: {
      type: "jsonb",
      notNull: true,
    },

    input_hash: {
      type: "text",
      notNull: true,
    },

    decision: {
      type: "text",
      notNull: true,
    },

    risk_level: {
      type: "text",
      notNull: true,
    },

    reasons: {
      type: "jsonb",
      notNull: true,
    },

    output_hash: {
      type: "text",
      notNull: true,
    },

    previous_event_hash: {
      type: "text",
    },

    event_hash: {
      type: "text",
      notNull: true,
      unique: true,
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("ai_audit_events", "application_id");
  pgm.createIndex("ai_audit_events", "created_at");
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable("ai_audit_events");
};