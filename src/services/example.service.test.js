const pool = require("../db/db.js");

const {
  getUserCount
} = require("./example.service");

jest.mock("../db/db.js");

test(
  "returns total users",
  async () => {
    pool.query.mockResolvedValue({
      rows: [
        { total: "7" }
      ]
    });

    const count =
      await getUserCount();

    expect(count).toBe(7);
  }
);
