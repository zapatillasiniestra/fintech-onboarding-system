import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

async function adminOnly(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
  console.log("req.user",req.user);
  
  if (!req.user) {
      throw new AppError("Unauthorized", 401);
  }
  
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "forbidden"
    });
  }

  return next();
}

export default adminOnly;
