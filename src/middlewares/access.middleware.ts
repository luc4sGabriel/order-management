import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error";
import { ServiceError } from "../services/errors/service-errors";

interface TokenPayload {
    sub: string;
}

export function accessMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const jwtSecret = process.env.JWT_SECRET;

    // o typescript tava reclamando que podia dar null no Env
    if (!jwtSecret) {
        throw new AppError("JWT_SECRET not defined", 500);
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError("JWT token is missing", 401);
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
        req.user = { id: decoded.sub };

        return next();

    } catch (error){
        if (error instanceof AppError || error instanceof ServiceError) {
            return res
                .status(error.statusCode)
                .json({ message: error.message });
        }

        return res
            .status(401)
            .json({ message: "Access Denied" });
}
}
