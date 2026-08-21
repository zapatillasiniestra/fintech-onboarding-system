import { PoolClient } from "pg";

import {
  DocumentRecord,
  DocumentRequest,
  DocumentVerification,
} from "../types/document";

async function create(
  client: PoolClient,
  input: DocumentRequest,
  provider: string,
  result: DocumentVerification
): Promise<DocumentRecord> {
  const query = `
    INSERT INTO documents (
      application_id,
      provider,
      document_type,
      file_name,
      mime_type,
      file_hash,
      status,
      extracted_data,
      external_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING
      id,
      application_id,
      provider,
      document_type,
      file_name,
      mime_type,
      file_hash,
      status,
      extracted_data,
      external_id,
      created_at
  `;

  const values = [
    input.applicationId,
    provider,
    input.documentType,
    input.fileName,
    input.mimeType,
    input.fileHash,
    result.status,
    result.extractedData,
    result.externalId ?? null,
  ];

  const { rows } = await client.query(query, values);

  const row = rows[0];

  return {
    id: row.id,
    applicationId: row.application_id,
    provider: row.provider,
    documentType: row.document_type,
    fileName: row.file_name,
    mimeType: row.mime_type,
    fileHash: row.file_hash,
    status: row.status,
    extractedData: row.extracted_data,
    externalId: row.external_id,
    createdAt: row.created_at,
  };
}

async function findByApplicationId(
  client: PoolClient,
  applicationId: number
): Promise<DocumentRecord[]> {
  const { rows } = await client.query(
    `
      SELECT
        id,
        application_id,
        provider,
        document_type,
        file_name,
        mime_type,
        file_hash,
        status,
        extracted_data,
        external_id,
        created_at
      FROM documents
      WHERE application_id = $1
      ORDER BY created_at ASC
    `,
    [applicationId]
  );

  return rows.map((row) => ({
    id: row.id,
    applicationId: row.application_id,
    provider: row.provider,
    documentType: row.document_type,
    fileName: row.file_name,
    mimeType: row.mime_type,
    fileHash: row.file_hash,
    status: row.status,
    extractedData: row.extracted_data,
    externalId: row.external_id,
    createdAt: row.created_at,
  }));
}

export default {
  create,
  findByApplicationId,
};