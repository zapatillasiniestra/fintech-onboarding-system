import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/applications");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Nahuela</h1>
        <p>Auditable onboarding infrastructure.</p>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}