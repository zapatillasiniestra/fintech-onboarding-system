import { ZodError, z } from "zod";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: z.treeifyError(err),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    error: "Internal server error",
  });
}