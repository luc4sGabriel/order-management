import { LoginUserDto } from "../dtos/login.dto";
import { AppError } from "../errors/app-error";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "../repositories/user.repository";
import { ILoginResponse } from "../types/authentication.type";
import { JwtService } from "../utils/jwt.utils";
import { compare } from "../utils/bcrypt.utils";
import { UserPresenter } from "../presenters/user.presenter";

export class AuthenticationService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }

    async login(data: LoginUserDto): Promise<ILoginResponse> {
        const email = data.email.trim().toLowerCase();

        const user = await this.userRepository.findByEmail(email);

        if (!user || !user.password) {
            throw new NotFoundError("Invalid Email or Password");
        }

        const passwordMatch = await compare(
            data.password,
            user.password
        );

        if (!passwordMatch) {
            throw new NotFoundError("Invalid Email or Password");
        }

        if (!process.env.JWT_SECRET) {
            throw new AppError("JWT secret not configured", 500);
        }

        const token = this.jwtService.generate({
            sub: user._id.toString(),
            email: user.email,
        },
        );

        return {
            user: UserPresenter.toHttp(user),
            token,
        };
    }
}