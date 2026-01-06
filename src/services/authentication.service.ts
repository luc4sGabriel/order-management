import { LoginUserDto } from "../dtos/login.dto";
import { UserRepository } from "../repositories/user.repository";
import { ILoginResponse } from "../types/authentication.type";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export class AuthenticationService {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async login(data: LoginUserDto): Promise<ILoginResponse> {
        const user = await this.userRepository.findByEmail(data.email);

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const passwordMatch = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!passwordMatch) {
            throw new Error("Invalid email or password");
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
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
    }
}