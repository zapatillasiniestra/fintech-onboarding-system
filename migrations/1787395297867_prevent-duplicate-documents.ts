import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addConstraint("documents", "documents_application_file_hash_unique", {
    unique: ["application_id", "file_hash"],
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropConstraint(
    "documents",
    "documents_application_file_hash_unique"
  );
}