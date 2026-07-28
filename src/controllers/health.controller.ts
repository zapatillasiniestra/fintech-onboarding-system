import type { Request, Response, NextFunction } from "express";
import { getHealth } from "../services/health.service";

export default async function health(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getHealth();
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};
