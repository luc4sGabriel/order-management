import { Request, Response } from "express";
import { CreateUserDto, FetchUsersQueryDto, UpdateUserDto } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { BadRequestError } from "../errors/bad-request-error";

export class UserController {
    constructor(
        private userService: UserService,
    ) { }

    async create(req: Request, res: Response) {
        const data: CreateUserDto = req.body;
        const rst = await this.userService.create(data);

        res.status(201).json({
            message: "User created successfully",
            data: rst,
        });
    }

    async findById(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestError("User ID is required");
        }

        const user = await this.userService.findById(id);

        res.status(200).json({
            data: user,
        });
    }

    async findAll(req: Request, res: Response) {
        const queryParams: FetchUsersQueryDto = {
            page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        }

        const rst = await this.userService.findAll(
            queryParams.page,
            queryParams.limit
        );

        res.status(200).json(rst);
    }

    async findByEmail(req: Request, res: Response) {
        const { email } = req.params;

        if (!email) {
            throw new BadRequestError("Email is required");
        }

        const user = await this.userService.findByEmail(email);

        res.status(200).json({
            data: user,
        });
    }

    async softDelete(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestError("User ID is required");
        }

        const user = await this.userService.softDelete(id);

        res.status(200).json({
            message: "User deleted successfully",
            data: user,
        });
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestError("User ID is required");
        }

        const data: UpdateUserDto = req.body;

        const user = await this.userService.update(id, data);

        return res.status(200).json({
            message: "User updated successfully",
            data: user,
        });
    }
}