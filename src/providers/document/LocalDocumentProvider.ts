import {
  DocumentRequest,
  DocumentVerification,
} from "../../types/document";

import { DocumentProvider } from "./DocumentProvider";

export default class LocalDocumentProvider
  implements DocumentProvider
{
  readonly name = "local";

  async verifyDocument(
    input: DocumentRequest
  ): Promise<DocumentVerification> {
    const supportedMimeTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!supportedMimeTypes.includes(input.mimeType)) {
      return {
        verified: false,
        status: "rejected",
        reasons: ["Unsupported document MIME type."],
        extractedData: {},
      };
    }

    return {
      verified: true,
      status: "verified",
      reasons: [],
      externalId: `local-${input.fileHash.slice(0, 12)}`,
      extractedData: {
        documentType: input.documentType,
      },
    };
  }
}