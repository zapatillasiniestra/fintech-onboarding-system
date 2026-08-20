import { JwtPayload } from "./auth";
import type { UserRole } from "./application";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: UserRole;
      };
    }
  }
}

export {};
