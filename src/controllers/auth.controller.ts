import { Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { ServiceError } from "../services/errors/service-errors";
import { LoginUserDto } from "../dtos/login.dto";
import { AuthenticationService } from "../services/authentication.service";

export class AuthController {
    constructor(
        private authService: AuthenticationService
    ){}

    async login(req: Request, res: Response) {
        try {
            const data: LoginUserDto = req.body;

            const rst = await this.authService.login(data);

            res.status(200).json({
                message: "Login successful",
                data: rst,
            });

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