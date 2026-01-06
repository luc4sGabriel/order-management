import { Request, Response } from "express";
import { LoginUserDto } from "../dtos/login.dto";
import { AuthenticationService } from "../services/authentication.service";

export class AuthController {
    constructor(
        private authService: AuthenticationService
    ){}

    async login(req: Request, res: Response) {
            const data: LoginUserDto = req.body;

            const rst = await this.authService.login(data);

            res.status(200).json({
                message: "Login successful",
                data: rst,
            });
    }
}