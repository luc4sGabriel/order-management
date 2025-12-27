import { Request, Response } from "express";
import { RegisterUserService } from "../services/Auth/register.user.service";
import { LoginUserService } from "../services/Auth/login.user.service";
import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../errors/app-error";
import { ServiceError } from "../services/errors/service-errors";

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const userRepository = new UserRepository();
            const service = new RegisterUserService(userRepository);

            await service.execute(email, password);

            return res.status(201).send();
            
        } catch (error) {
            if (error instanceof AppError || error instanceof ServiceError) {
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }

            return res
                .status(500)
                .json({ message: "Internal server error" });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const userRepository = new UserRepository();
            const service = new LoginUserService(userRepository);

            const token = await service.execute(email, password);

            return res.json(token);

        } catch (error) {
            if (error instanceof AppError || error instanceof ServiceError) {
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }

            return res
                .status(500)
                .json({ message: "Internal server error" });
        }
    }
}