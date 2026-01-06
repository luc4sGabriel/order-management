import { Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { ServiceError } from "../services/errors/service-errors";
import { CreateOrderDto, FetchOrderQueryDto } from "../dtos/order.dto";
import { OrderService } from "../services/order.service";
import { orderStates } from "../types/enum/enums.type";

export class OrderController {
    constructor(
        private orderService: OrderService
    ) { }

    async findAll(req: Request, res: Response) {
        try {
            const queryParams: FetchOrderQueryDto = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                state: req.query.state as orderStates | undefined
            }

            const result = await this.orderService.findAll(queryParams.limit, queryParams.page, queryParams.state);

            return res.json(result);

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

    async create(req: Request, res: Response) {
        try {
            const data: CreateOrderDto = req.body;

            const order = await this.orderService.create(data)

            res.status(201).json({
                message: "Order created successfully",
                data: order
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

    async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Order ID is required" });
            }

            const order = await this.orderService.findById(id);

            return res.json({
                data: order,
            });
        } catch (error: any) {
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

    async changeState(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Order ID is required" });
        }

        try {
            const rst = await this.orderService.advance(id);

            return res.json({
                message: "Order state updated successfully",
                data: rst,
            });

        } catch (error: any) {
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

    async softDelete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Order ID is required" });
            }

            await this.orderService.softDelete(id);

            return res.json({
                message: "Order deleted successfully",
            });

        } catch (error: any) {
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
