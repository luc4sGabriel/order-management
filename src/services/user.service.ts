import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { BadRequestError } from "../errors/bad-request-error";
import { ConflictError } from "../errors/conflict-error";
import { NotFoundError } from "../errors/not-found-error";
import { UserPresenter } from "../presenters/user.presenter";
import { UserRepository } from "../repositories/user.repository";
import { PaginatedResponse } from "../types/pagination.types";
import { IUser, IUserResponse } from "../types/user.type";

import bcrypt from "bcryptjs";

export class UserService {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async findById(id: string): Promise<IUserResponse> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundError("User");
        }

        return UserPresenter.toHttp(user);
    }

    async findByEmail(email: string): Promise<IUser> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundError("User");
        }

        // nao converto para IUserResponse pq essa funcao eh usada internamente
        // fica como IUser mesmo
        return user;
    }

    async findAll(
        page: number,
        limit: number
    ): Promise<PaginatedResponse<IUserResponse>> {
        const result = await this.userRepository.findAll(page, limit);

        return {
            ...result,
            data: result.data.map(UserPresenter.toHttp),
        };
    }

    async create(data: CreateUserDto): Promise<IUser> {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new ConflictError("Email already in use");
        }

        // DEPOIS FAZER UM UTIL PRA ISSO ..
        const SALT = 6;

        const hashedPassword = await bcrypt.hash(data.password, SALT);

        console.log("Hashed password:", hashedPassword);

        const user = await this.userRepository.create({
            ...data,
            email: data.email.trim().toLowerCase(),
            password: hashedPassword,
        });

        return user;
    }

    async softDelete(id: string): Promise<IUser> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundError("User");
        }

        if (user.deletedAt) {
            throw new BadRequestError("User is already deleted");
        }

        const deletedUser = await this.userRepository.softDelete(id);

        if (!deletedUser) {
            throw new NotFoundError("User");
        }

        return deletedUser;
    }

    async update(
        id: string,
        data: UpdateUserDto
    ): Promise<IUser> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundError("User");
        }

        if (user.deletedAt) {
            throw new BadRequestError("Cannot update a deleted user");
        }

        // tava dando erro na tipagem sem isso .. 
        const updateData: Partial<IUser> = {};

        if (data.email !== undefined) {
            updateData.email = data.email;
        }

        if (data.password !== undefined) {
            const SALT = 6;
            updateData.password = await bcrypt.hash(data.password, SALT);
        }

        const updatedUser = await this.userRepository.update(id, updateData);

        if (!updatedUser) {
            throw new NotFoundError("User");
        }

        return updatedUser;
    }
}