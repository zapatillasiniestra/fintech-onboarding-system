import {DocumentProvider} from "./DocumentProvider";
import LocalDocumentProvider from "./LocalDocumentProvider";
import MockDocumentProvider from "./MockDocumentProvider";

function createDocumentProvider(): DocumentProvider {
  switch (process.env.DOCUMENT_PROVIDER) {
    case "local":
      return new LocalDocumentProvider();

    case "mock":
      return new MockDocumentProvider();

    default:
      throw new Error(
        `Unsupported DOCUMENT_PROVIDER: ${process.env.DOCUMENT_PROVIDER}`
      );
  }
}

export default createDocumentProvider;