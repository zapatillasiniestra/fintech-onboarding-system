import { AuditProvider } from "./AuditProvider";
import { LocalAuditProvider } from "./LocalAuditProvider";

export function createAuditProvider(): AuditProvider {
  switch (process.env.AUDIT_PROVIDER) {
    case "local":
    default:
      return new LocalAuditProvider();
  }
}