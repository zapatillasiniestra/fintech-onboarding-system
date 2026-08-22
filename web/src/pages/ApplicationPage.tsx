import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api";

interface DecisionHistory {
  applicationId: number;
  identity: any[];
  documents: any[];
  compliance: any[];
  aiAssessments: any[];
  auditEvents: any[];
  auditVerification: {
    valid: boolean;
    events: number;
  };
}

export default function ApplicationPage() {
  const { id } = useParams();

  const [data, setData] = useState<DecisionHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const result = await apiFetch(
          `/applications/${id}/decision-history`
        );

        setData(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load application"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return <main className="content">Loading...</main>;
  }

  if (error) {
    return (
      <main className="content">
        <div className="error">{error}</div>
      </main>
    );
  }

  if (!data) return null;

  const identityVerified = data.identity.length > 0;
  const documentsVerified = data.documents.length > 0;
  const complianceClear = data.compliance.length > 0;
  const aiCompleted = data.aiAssessments.length > 0;

  const aiAssessment = data.aiAssessments[0];

  return (
    <main className="dashboard">
      <header className="topbar">
        <strong>Nahuela</strong>

        <Link to="/applications">
          ← Applications
        </Link>
      </header>

      <section className="content">

        <div className="application-heading">
          <div>
            <p className="eyebrow">
              ONBOARDING APPLICATION
            </p>

            <h1>
              Application #{data.applicationId}
            </h1>
          </div>

          <div className="decision-badge">
            {aiAssessment?.decision === "approved"
              ? "APPROVED"
              : "PENDING"}
          </div>
        </div>

        <div className="cards">

          <div className="card">
            <span>Identity</span>
            <strong>
              {identityVerified
                ? "✓ Verified"
                : "— Not verified"}
            </strong>
          </div>

          <div className="card">
            <span>Documents</span>
            <strong>
              {documentsVerified
                ? "✓ Verified"
                : "— Not submitted"}
            </strong>
          </div>

          <div className="card">
            <span>Compliance</span>
            <strong>
              {complianceClear
                ? "✓ Clear"
                : "— Pending"}
            </strong>
          </div>

          <div className="card">
            <span>AI Assessment</span>
            <strong>
              {aiCompleted
                ? `✓ ${aiAssessment?.decision}`
                : "— Pending"}
            </strong>

            {aiAssessment?.riskLevel && (
              <small>
                Risk: {aiAssessment.riskLevel}
              </small>
            )}
          </div>

          <div className="card">
            <span>Audit Chain</span>
            <strong>
              {data.auditVerification.valid
                ? "✓ Valid"
                : "✕ Invalid"}
            </strong>
          </div>

          <div className="card">
            <span>Audit Events</span>
            <strong>
              {data.auditVerification.events}
            </strong>
          </div>

        </div>

        {documentsVerified && (
          <section className="panel">

            <h2>Document verification</h2>

            {data.documents.map((document) => (
              <div
                className="document-row"
                key={document.id}
              >
                <div>
                  <strong>
                    {document.documentType}
                  </strong>

                  <small>
                    {document.fileName}
                  </small>
                </div>

                <div>
                  <span className="status status-approved">
                    {document.status}
                  </span>
                </div>

                <div>
                  <small>
                    Provider: {document.provider}
                  </small>
                </div>
              </div>
            ))}

          </section>
        )}

        <section className="panel">

          <h2>Audit timeline</h2>

          {data.auditEvents.map((event) => (
            <div
              className="timeline-item"
              key={event.id}
            >
              <div>
                <strong>
                  {event.event_type}
                </strong>

                <small>
                  {new Date(
                    event.created_at
                  ).toLocaleString()}
                </small>
              </div>

              <span className="timeline-decision">
                {event.decision}
              </span>
            </div>
          ))}

        </section>

      </section>
    </main>
  );
}