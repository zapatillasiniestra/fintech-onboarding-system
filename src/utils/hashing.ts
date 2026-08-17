import { createHash } from "crypto";

export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }

  const object = value as Record<string, unknown>;
  const keys = Object.keys(object).sort();

  return `{${keys
    .map(
      (key) =>
        `${JSON.stringify(key)}:${canonicalize(object[key])}`
    )
    .join(",")}}`;
}

export function sha256(value: unknown): string {
  const canonical = canonicalize(value);

  return createHash("sha256")
    .update(canonical)
    .digest("hex");
}