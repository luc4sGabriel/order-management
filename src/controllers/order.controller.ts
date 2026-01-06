import { Request, Response } from "express";
import { CreateOrderDto, FetchOrderQueryDto } from "../dtos/order.dto";
import { OrderService } from "../services/order.service";
import { orderStates } from "../types/enum/enums.type";
import { BadRequestError } from "../errors/bad-request-error";

export class OrderController {
    constructor(
        private orderService: OrderService
    ) { }

    async findAll(req: Request, res: Response) {
        const queryParams: FetchOrderQueryDto = {
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
            state: req.query.state as orderStates | undefined
        }

        const result = await this.orderService.findAll(queryParams.page, queryParams.limit, queryParams.state);

        return res.json(result);
    }

    async create(req: Request, res: Response) {
        const data: CreateOrderDto = req.body;

        const order = await this.orderService.create(data)

        res.status(201).json({
            message: "Order created successfully",
            data: order
        });
    }

    async findById(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestError("Order ID is required");
        }

        const order = await this.orderService.findById(id);

        return res.json({
            data: order,
        });
    }

    async changeState(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestError("Order ID is required");
        }
        const rst = await this.orderService.advance(id);

        return res.json({
            message: "Order state updated successfully",
            data: rst,
        });
    }

    async softDelete(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestError("Order ID is required");
        }

        await this.orderService.softDelete(id);

        return res.json({
            message: "Order deleted successfully",
        });
    }
}
