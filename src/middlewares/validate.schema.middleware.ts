import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { AppError } from "../errors/app-error";

export class ValidateMiddleware {
  static body(schema: z.ZodTypeAny) {
    return async (req: Request, _res: Response, next: NextFunction) => {
      try {
        req.body = await schema.parseAsync(req.body);
        next();
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          const firstIssueMessage = error.issues?.[0]?.message || "Invalid request body";
          return next(new AppError(firstIssueMessage, 400));
        }
        next(error);
      }
    };
  }
}