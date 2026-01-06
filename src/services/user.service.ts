import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
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

        // fazer os erros depois
        if (!user) {
            throw new Error("User not found");
        }

        return UserPresenter.toHttp(user);
    }

    async findByEmail(email: string): Promise<IUser> {
        const user = await this.userRepository.findByEmail(email);

        // fazer os erros depois
        if (!user) {
            throw new Error("User not found");
        }

        // nao converto para IUserResponse pq essa funcao eh usada internamente
        return user;
    }

    async findAll(
        page: number,
        limit: number
    ): Promise<PaginatedResponse<IUser>> {
        return this.userRepository.findAll(page, limit);
    }

    async create(data: CreateUserDto): Promise<IUser> {
        const existingUser = await this.userRepository.findByEmail(data.email);

        // fazer erros dps
        if (existingUser) {
            throw new Error("Email already in use");
        }

        // DEPOIS FAZER UM UTIL PRA ISSO ..
        const SALT = 6;

        const hashedPassword = await bcrypt.hash(data.password, SALT);

        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword,
        });

        return user;
    }

    async softDelete(id: string): Promise<IUser> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.deletedAt) {
            throw new Error("User already deleted");
        }

        const deletedUser = await this.userRepository.softDelete(id);

        if (!deletedUser) {
            throw new Error("Failed to delete user");
        }

        return deletedUser;
    }

    async update(
        id: string,
        data: UpdateUserDto
    ): Promise<IUser> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        // tava dando erro na tipagem sem isso .. 
        const updateData: Partial<IUser> = {};

        if (user.deletedAt) {
            throw new Error("User is deleted");
        }

        if (data.email !== undefined) {
            updateData.email = data.email;
        }

        if (data.password !== undefined) {
            const SALT = 6;
            updateData.password = await bcrypt.hash(data.password, SALT);
        }

        const updatedUser = await this.userRepository.update(id, updateData);

        if (!updatedUser) {
            throw new Error("Failed to update user");
        }

        return updatedUser;
    }
}