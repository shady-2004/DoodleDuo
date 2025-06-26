import { Request, Response, NextFunction, RequestHandler } from "express";

export default (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = fn(req, res, next);
    if (result && typeof (result as Promise<void>).catch === "function") {
      (result as Promise<void>).catch(next);
    }
  };
};
