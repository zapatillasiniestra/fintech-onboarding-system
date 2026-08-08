import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable("users", {
    id: "id",

    email: {
      type: "text",
      notNull: true,
      unique: true,
    },

    password: {
      type: "text",
      notNull: true,
    },

    role: {
      type: "text",
      notNull: true,
      default: "user",
    },

    last_login: {
      type: "timestamp",
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("applications", {
    id: "id",

    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },

    full_name: {
      type: "text",
      notNull: true,
    },

    email: {
      type: "text",
      notNull: true,
    },

    status: {
      type: "text",
      notNull: true,
      default: "pending",
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("refresh_tokens", {
    id: "id",

    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },

    token: {
      type: "text",
      notNull: true,
    },

    expires_at: {
      type: "timestamp",
      notNull: true,
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("audit_logs", {
    id: "id",

    application_id: {
      type: "integer",
      notNull: true,
      references: "applications",
      onDelete: "CASCADE",
    },

    admin_id: {
      type: "integer",
      notNull: true,
      references: "users",
    },

    status: {
      type: "text",
      notNull: true,
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("users", "email", {
    unique: true,
  });

  pgm.createIndex("applications", "user_id");

  pgm.createIndex("applications", "status");

  pgm.createIndex("applications", "created_at");

  pgm.createIndex("refresh_tokens", "user_id");

  pgm.createIndex("audit_logs", "application_id");

  pgm.createIndex("audit_logs", "admin_id");

  pgm.createType("application_status", [
    "pending",
    "under_review",
    "approved",
    "rejected",
]);
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable("audit_logs");
  pgm.dropTable("refresh_tokens");
  pgm.dropTable("applications");
  pgm.dropTable("users");
};