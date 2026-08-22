import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

interface Application {
  id: number;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
}

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await apiFetch("/applications");
        setApplications(data.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load applications"
        );
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <strong>Nahuela</strong>

        <button className="secondary-button" onClick={logout}>
          Sign out
        </button>
      </header>

      <section className="content">
        <div className="page-header">
            <div>
                <h1>Applications</h1>
            </div>

            <Link
                to="/applications/new"
                className="primary-button"
            >
                + New application
            </Link>
        </div>

        {loading && <p>Loading...</p>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <div className="table">
            <div className="table-header">
              <span>ID</span>
              <span>Applicant</span>
              <span>Email</span>
              <span>Status</span>
              <span />
            </div>

            {applications.map((application) => (
              <Link
                key={application.id}
                to={`/applications/${application.id}`}
                className="table-row"
              >
                <span>#{application.id}</span>
                <span>{application.full_name}</span>
                <span>{application.email}</span>
                <span>
                  <span className={`status status-${application.status}`}>
                    {application.status}
                  </span>
                </span>
                <span>→</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}