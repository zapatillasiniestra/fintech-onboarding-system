import { JwtPayload } from "./auth";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export {};