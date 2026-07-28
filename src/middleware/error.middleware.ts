import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: err.issues
    });
  }

  const status =
    typeof err === "object" &&
    err !== null &&
    "status" in err
      ? (err as { status: number }).status
      : 500;

  const message =
    typeof err === "object" &&
    err !== null &&
    "message" in err
      ? (err as { message: string }).message
      : "internal server error";

  return res.status(status).json({
    error: message
  });
}

export default errorHandler;