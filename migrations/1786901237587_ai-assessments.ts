import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable("ai_assessments", {
    id: "id",

    application_id: {
      type: "integer",
      notNull: true,
      references: "applications",
      onDelete: "CASCADE",
    },

    risk_level: {
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

    model: {
      type: "text",
      notNull: true,
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("ai_assessments", "application_id");
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable("ai_assessments");
};