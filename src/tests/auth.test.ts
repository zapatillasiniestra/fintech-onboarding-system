import detenv from "dotenv";
detenv.config();
import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import pool from "../db/db";

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
      process.env.JWT_SECRET!
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
      process.env.JWT_SECRET!
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
  test("AI audit verification requires authentication", async () => {
  const response = await request(app)
    .get("/applications/4/ai-audit/verify");

  expect(response.status).toBe(401);
});

test("AI audit verification returns valid chain", async () => {
  const token = jwt.sign(
    {
      userId: 4,
      role: "user"
    },
    process.env.JWT_SECRET!
  );

  const response = await request(app)
    .get("/applications/4/ai-audit/verify")
    .set(
      "Authorization",
      `Bearer ${token}`
    );

  expect(response.status).toBe(200);

  expect(response.body).toEqual({
    valid: true,
    events: expect.any(Number)
  });

  expect(response.body.events).toBeGreaterThanOrEqual(1);
});

test("AI audit verification rejects invalid application ID", async () => {
  const token = jwt.sign(
    {
      userId: 1,
      role: "user"
    },
    process.env.JWT_SECRET!
  );

  const response = await request(app)
    .get("/applications/not-a-number/ai-audit/verify")
    .set(
      "Authorization",
      `Bearer ${token}`
    );

  expect(response.status).toBe(400);
});

test("application details require authentication", async () => {
  const response = await request(app)
    .get("/applications/4");

  expect(response.status).toBe(401);
});

test("application owner can access application details", async () => {
  const token = jwt.sign(
    {
      userId: 4,
      role: "user"
    },
    process.env.JWT_SECRET!
  );

  const response = await request(app)
    .get("/applications/4")
    .set(
      "Authorization",
      `Bearer ${token}`
    );

  expect(response.status).toBe(200);
  expect(response.body.id).toBe(4);
});

test("different user cannot access application details", async () => {
  const token = jwt.sign(
    {
      userId: 1,
      role: "user"
    },
    process.env.JWT_SECRET!
  );

  const response = await request(app)
    .get("/applications/4")
    .set(
      "Authorization",
      `Bearer ${token}`
    );

  expect(response.status).toBe(403);
});

test("admin can access application details", async () => {
  const token = jwt.sign(
    {
      userId: 1,
      role: "admin"
    },
    process.env.JWT_SECRET!
  );

  const response = await request(app)
    .get("/applications/4")
    .set(
      "Authorization",
      `Bearer ${token}`
    );

  expect(response.status).toBe(200);
  expect(response.body.id).toBe(4);
});

  afterAll(async () => {
    await pool.end();
  });

});

export {};