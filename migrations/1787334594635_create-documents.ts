import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("documents", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    application_id: {
      type: "integer",
      notNull: true,
      references: "applications",
      onDelete: "CASCADE",
    },

    provider: {
      type: "varchar(50)",
      notNull: true,
    },

    document_type: {
      type: "varchar(50)",
      notNull: true,
    },

    file_name: {
      type: "varchar(255)",
      notNull: true,
    },

    mime_type: {
      type: "varchar(100)",
      notNull: true,
    },

    file_hash: {
      type: "varchar(64)",
      notNull: true,
    },

    status: {
      type: "varchar(30)",
      notNull: true,
      default: "uploaded",
    },

    extracted_data: {
      type: "jsonb",
      notNull: true,
      default: "{}",
    },

    external_id: {
      type: "varchar(255)",
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createIndex("documents", "application_id");
  pgm.createIndex("documents", "file_hash");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("documents");
}