import { LoginUserDto } from "../dtos/login.dto";
import { AppError } from "../errors/app-error";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "../repositories/user.repository";
import { ILoginResponse } from "../types/authentication.type";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export class AuthenticationService {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async login(data: LoginUserDto): Promise<ILoginResponse> {
        try {
            const email = data.email.trim().toLowerCase();
            console.log("Login email:", email);
            console.log("password: ", data.password)
            const user = await this.userRepository.findByEmail(email);

            if (!user || !user.password) {
                throw new NotFoundError("Error here Invalid email");
            }

            const passwordMatch = await bcrypt.compare(
                data.password,
                user.password
            );

            if (!passwordMatch) {
                throw new NotFoundError("Invalid password");
            }

            if (!process.env.JWT_SECRET) {
                throw new AppError("JWT secret not configured", 500);
            }

            const token = jwt.sign({
                sub: user._id.toString(),
                email: user.email,
            },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
                } as jwt.SignOptions
            );

            return {
                userId: user._id.toString(),
                token,
            };
        } catch (error) {
            console.error(error); // ← loga o erro real
            throw error;
        }
    }
}