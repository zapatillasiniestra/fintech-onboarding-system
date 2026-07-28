import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  logger.info(
    {
      method: req.method,
      url: req.originalUrl
    },
    "Incoming request"
  );

  next();
}

export default requestLogger;