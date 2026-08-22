import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function NewApplicationPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/applications", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          email,
        }),
      });

      navigate(
        `/applications/${data.id ?? data.applicationId}`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create application"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dashboard">

      <header className="topbar">
        <strong>Nahuela</strong>

        <button
          className="secondary-button"
          onClick={() => navigate("/applications")}
        >
          ← Applications
        </button>
      </header>

      <section className="content">

        <div className="page-header">
          <h1>New application</h1>
          <p>
            Start a new onboarding application.
          </p>
        </div>

        <form
          className="panel form-panel"
          onSubmit={handleSubmit}
        >

          <label>
            Full name
          </label>

          <input
            value={fullName}
            onChange={(event) =>
              setFullName(event.target.value)
            }
            placeholder="John Smith"
            required
          />

          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="john@example.com"
            required
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create application"}
          </button>

        </form>

      </section>

    </main>
  );
}