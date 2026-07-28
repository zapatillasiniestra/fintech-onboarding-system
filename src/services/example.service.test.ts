import pool from "../db/db";
import getUserCount from "./example.service";

jest.mock("../db/db");

test(
  "returns total users",
  async () => {
    (pool.query as jest.Mock).mockResolvedValue({
      rows: [{ total: "7" }]
    });

    const count =
      await getUserCount();

    expect(count).toBe(7);
  }
);
