import { canonicalize, sha256 } from "./hashing";

describe("hashing", () => {
  test("produces the same hash regardless of object property order", () => {
    const first = {
      name: "Nau",
      age: 36
    };

    const second = {
      age: 36,
      name: "Nau"
    };

    expect(sha256(first)).toBe(sha256(second));
  });

  test("produces different hashes when data changes", () => {
    const first = {
      name: "Nau",
      age: 36
    };

    const second = {
      name: "Nau",
      age: 37
    };

    expect(sha256(first)).not.toBe(sha256(second));
  });

  test("canonicalizes object keys alphabetically", () => {
    const value = {
      z: 1,
      a: 2
    };

    expect(canonicalize(value)).toBe(
      '{"a":2,"z":1}'
    );
  });
});