import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable("identity_verifications", {
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

    verified: {
      type: "boolean",
      notNull: true,
    },

    confidence: {
      type: "numeric",
      notNull: true,
    },

    decision: {
      type: "text",
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
    "identity_verifications",
    "application_id"
  );

  pgm.createIndex(
    "identity_verifications",
    "created_at"
  );
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable("identity_verifications");
};