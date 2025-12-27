import { Request, Response } from "express";
import { FindPaginatedOrderService } from "../services/Order/find.paginated.order.service";
import { OrderRepository } from "../repositories/order.repository";
import { State } from "../models/Order";
import { CreateOrderService } from "../services/Order/create.order.service";
import { ChangeStateService } from "../services/Order/change.state.order.service";
import { AppError } from "../errors/app-error";
import { ServiceError } from "../services/errors/service-errors";

export class OrderController {
    async findPaginated(req: Request, res: Response) {
        try {
            const { page = 1, state } = req.query;

            const service = new FindPaginatedOrderService(new OrderRepository());

            const result = await service.execute({
                page: Number(page),
                state: state as State | undefined,
            });

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
            const service = new CreateOrderService(new OrderRepository());

            const result = await service.execute(req.body);

            return res.status(201).json(result);

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

    async changeState(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const service = new ChangeStateService(new OrderRepository());

            if (!id) {
                return res.status(400).json({ error: "Order ID is required" });
            }

            const result = await service.execute(id);

            return res.json(result);

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
