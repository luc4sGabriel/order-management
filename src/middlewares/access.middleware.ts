import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error";

interface TokenPayload {
    sub: string;
}

export function accessMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new AppError("JWT_SECRET not defined", 500);
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError("JWT token is missing", 401);
    }

    if (!authHeader.startsWith("Bearer ")) {
        throw new AppError("Invalid authorization header", 401);
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
        req.user = { id: decoded.sub };

        return next();
    } catch {
        throw new AppError("Invalid or expired token", 401);
    }
}