import {
  DocumentRequest,
  DocumentVerification,
} from "../../types/document";

export interface DocumentProvider {
  readonly name: string;

  verifyDocument(
    input: DocumentRequest
  ): Promise<DocumentVerification>;
}