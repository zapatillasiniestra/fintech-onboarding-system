import {
  DocumentRequest,
  DocumentVerification,
} from "../../types/document";

import { DocumentProvider } from "./DocumentProvider";

export default class MockDocumentProvider
  implements DocumentProvider
{
  readonly name = "mock";

  async verifyDocument(
    input: DocumentRequest
  ): Promise<DocumentVerification> {
    return {
      verified: true,
      status: "verified",
      reasons: [],
      externalId: `mock-${input.fileHash.slice(0, 12)}`,
      extractedData: {
        documentType: input.documentType,
        documentNumber: "MOCK-123456",
        fullName: "Mock User",
      },
    };
  }
}