const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const pool = require("../db/db.js");

describe("auth routes", () => {
  test("register requires email", async () => {
    const response = await request(app)
      .post("/register")
      .send({
        password: "123456"
      });

    expect(response.status).toBe(400);
  });
  test("register requires password", async () => {
    const response = await request(app)
      .post("/register")
      .send({
        email: "nau@example.com"
      });

    expect(response.status).toBe(400);
  });
  test.skip("login fails with invalid credentials", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: "invalid@example.com",
        password: "wrong_password"
      });

    expect(response.status).toBe(401);
  });
  test("applications endpoint requires token", async () => {
    const response = await request(app)
      .get("/applications");

    expect(response.status).toBe(401);
  });
  test("change application status requires authentication", async () => {
    const response = await request(app)
      .patch("/applications/1/status");

    expect(response.status).toBe(401);
  });
  test("change application status requires admin authorization", async () => {
    const token = jwt.sign({
        userId: 1,
        role: "user"
    },
      "super-secret-key"
    );

    const response = await request(app)
      .patch("/applications/7/status")
      .set(
        "Authorization",
        `Bearer ${token}`
      );

    expect(response.status).toBe(403);
  });
  test.skip("admin can change application status", async () => {
    const created = await pool.query(
    `
    INSERT INTO applications (user_id, status, full_name, email)
    VALUES (7, 'pending', 'test', 'test@test.com')
    RETURNING id
    `
    );

    const id = created.rows[0].id;

    const token = jwt.sign({
        userId: 7,
        role: "admin"
    },
      "super-secret-key"
    );

    const response = await request(app)
      .patch(`/applications/${id}/status`)
      .set(
        "Authorization",
        `Bearer ${token}`)
      .send({
            status:"approved"
      });

    expect(response.status).toBe(200);
  });
});
