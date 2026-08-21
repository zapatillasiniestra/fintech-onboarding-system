import { getHealth } from "./health.service";

describe("health service", () => {
  test("returns healthy status", async () => {
    const result = await getHealth();

    expect(result.status).toBe("ok");
    expect(result.database).toBe("connected");
    expect(result.uptime).toEqual(expect.any(Number));
    expect(result.timestamp).toEqual(expect.any(String));
    expect(result.version).toBeDefined();
  });
});