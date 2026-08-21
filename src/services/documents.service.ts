import pool from "../db/db";
import documentsRepository from "../repositories/documents.repository";
import createDocumentProvider from "../providers/document/DocumentProviderFactory";

import {
  DocumentRequest,
  DocumentVerification,
} from "../types/document";
import auditService from "./audit.service";

async function verifyDocument(
  input: DocumentRequest
): Promise<DocumentVerification> {
  const provider = createDocumentProvider();

  const result = await provider.verifyDocument(input);

  const client = await pool.connect();

  try {
    await documentsRepository.create(
      client,
      input,
      provider.name,
      result
    );
  } finally {
    client.release();
  }

  await auditService.createAuditEvent(client, {
    applicationId: input.applicationId,
    eventType: "document.verification.completed",
    provider: provider.name,
    model: "none",
    inputData: {
      documentType: input.documentType,
      fileName: input.fileName,
      mimeType: input.mimeType,
      fileHash: input.fileHash,
    },
    decision: result.verified ? "approved" : "rejected",
    riskLevel: "not_applicable",
    reasons: result.reasons,
  });

  return result;
}

async function getDocuments(
  applicationId: number
) {
  const client = await pool.connect();

  try {
    return await documentsRepository.findByApplicationId(
      client,
      applicationId
    );
  } finally {
    client.release();
  }
}

export default {
  verifyDocument,
  getDocuments,
};