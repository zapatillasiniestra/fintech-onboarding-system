import { useState } from "react";
import type { FormEvent } from "react";
import { apiFetch } from "../api";
import { calculateFileHash } from "../utils/fileHash";

interface Props {
  applicationId: number;
  onVerified: () => void;
}

export default function DocumentVerificationForm({
  applicationId,
  onVerified,
}: Props) {
  const [documentType, setDocumentType] =
    useState("dni");

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!file) {
      setError("Please select a document.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const fileHash =
        await calculateFileHash(file);

      await apiFetch(
        `/applications/${applicationId}/documents`,
        {
          method: "POST",
          body: JSON.stringify({
            documentType,
            fileName: file.name,
            mimeType: file.type,
            fileHash,
          }),
        }
      );

      setSuccess(
        "Document verified successfully."
      );

      setFile(null);

      onVerified();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Document verification failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel document-upload">
      <div className="panel-heading">
        <div>
          <h2>Documents</h2>
          <p>
            Submit an identity document for
            verification.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Document type
        </label>

        <select
          value={documentType}
          onChange={(event) =>
            setDocumentType(event.target.value)
          }
        >
          <option value="dni">
            DNI
          </option>

          <option value="passport">
            Passport
          </option>

          <option value="national_id">
            National ID
          </option>
        </select>

        <label>
          Document
        </label>

        <label className="file-dropzone">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(event) =>
              setFile(
                event.target.files?.[0] ?? null
              )
            }
          />

          {file ? (
            <div>
              <strong>
                {file.name}
              </strong>

              <small>
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </small>
            </div>
          ) : (
            <div>
              <strong>
                Choose a document
              </strong>

              <small>
                JPG, PNG or PDF
              </small>
            </div>
          )}
        </label>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {success && (
          <div className="success">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={!file || loading}
        >
          {loading
            ? "Verifying..."
            : "Verify document"}
        </button>
      </form>
    </section>
  );
}