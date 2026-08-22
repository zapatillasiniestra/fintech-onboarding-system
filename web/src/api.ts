const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Request failed"
    );
  }

  return data;
}