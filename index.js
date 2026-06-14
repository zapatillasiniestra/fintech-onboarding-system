const express = require("express");
const pool = require("./db/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

function auth(req, res, next) {
    const header = req.headers.authorization;
  
    if (!header) {
      return res.status(401).json({
        error: "No token provided"
      });
    }
  
    try {
      const token = header.split(" ")[1];
  
      const decoded = jwt.verify(
        token,
        "super-secret-key"
      );
  
      req.user = decoded;
  
      next();
  
    } catch (err) {
      return res.status(401).json({
        error: "Invalid token"
      });
    }
  }

app.get("/applications", auth, async (req, res) => {
  const result = await pool.query(
    `SELECT *
    FROM applications
    WHERE user_id = $1`,
    [req.user.userId]
  );

  res.json(result.rows);
});

app.post("/applications", auth, async (req, res) => {
    if (!req.body?.title) {
        return res.status(400).json({
          error: "title is required"
        });
      }
  const { title } = req.body;

  const result = await pool.query(
    `INSERT INTO applications (title, user_id)
    VALUES ($1, $2)
    RETURNING *`,
    [title, req.user.userId]
  );

  res.json(result.rows[0]);
});

app.delete("/applications/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "DELETE FROM applications WHERE id = $1",
    [id]
  );

  res.json({ ok: true });
});

app.post("/register", async (req, res) => {
    const { email, password } = req.body;
  
    const hashedPassword =
      await bcrypt.hash(password, 10);
  
    const result = await pool.query(
      `
      INSERT INTO users (email, password)
      VALUES ($1, $2)
      RETURNING id, email
      `,
      [email, hashedPassword]
    );
  
    res.json(result.rows[0]);
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    const result = await pool.query(
      `SELECT *
      FROM users
      WHERE email = $1`,
      [email]
    );
  
    const user = result.rows[0];
  
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }
  
    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );
  
    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }
  
    const token = jwt.sign(
      { userId: user.id },
      "super-secret-key",
      { expiresIn: "1d" }
    );
  
    res.json({ token });
  });


  app.listen(3000, () => {
    console.log("API running on http://localhost:3000");
  });
  