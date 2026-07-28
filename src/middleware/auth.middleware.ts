import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

async function auth(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      userId: number;
      email: string;
      role: "user" | "admin";
    };
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export default auth;
