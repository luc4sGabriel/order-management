import { CreateOrderDto } from "../dtos/order.dto";
import { OrderPresenter } from "../presenters/order.presenter";
import { OrderRepository } from "../repositories/order.repository";
import { orderStates } from "../types/enum/enums.type";
import { IOrder, IOrderResponse } from "../types/order.type";
import { PaginatedResponse } from "../types/pagination.types";

export class OrderService {
    constructor(
        private orderRepository: OrderRepository,
        private orderPresenter: typeof OrderPresenter
    ) { }

    async create(data: CreateOrderDto): Promise<IOrderResponse> {
        if (!data.services || data.services.length === 0) {
            throw new Error("At least one service is required");
        }

        const totalValue = data.services.reduce((sum, s) => sum + s.value, 0);
        if (totalValue <= 0) {
            throw new Error("Total value of services must be greater than zero");
        }

        // tudo validado no zod pae
        const order = await this.orderRepository.create(data);

        return this.orderPresenter.toHttp(order);
    }

    async advance(id: string): Promise<IOrderResponse> {
        const order = await this.orderRepository.findById(id);

        if (!order) {
            throw new Error("Order not found");
        }

        let nextState: orderStates;

        switch (order.state) {
            case orderStates.CREATED:
                nextState = orderStates.ANALYSIS;
                break;
            case orderStates.ANALYSIS:
                nextState = orderStates.COMPLETED;
                break;
            case orderStates.COMPLETED:
                throw new Error("Order is already completed");
            default:
                throw new Error("Invalid order state");
        }

        const updatedOrder = await this.orderRepository.changeState(id, nextState);

        return this.orderPresenter.toHttp(updatedOrder);
    }

    async findAll(
        page: number,
        limit: number,
        state?: orderStates,
    ): Promise<PaginatedResponse<IOrderResponse>> {
        const result = await this.orderRepository.findAll(page, limit, state);

        const data = result.data.map(order => this.orderPresenter.toHttp(order));

        return {
            ...result,
            data,
        };
    }

    async softDelete(id: string): Promise<IOrder> {
        const order = await this.orderRepository.findById(id);
        
        if (!order) {
            throw new Error("Order not found");
        }

        if (order.state === orderStates.COMPLETED) {
            throw new Error("Completed orders cannot be deleted");
        }

        const deletedOrder = await this.orderRepository.softDelete(id);

        if (!deletedOrder) {
            throw new Error("Failed to delete order");
        }

        return deletedOrder;
    }

    async findById(id: string): Promise<IOrderResponse> {
        const order = await this.orderRepository.findById(id);

        if (!order) {
            throw new Error("Order not found");
        }

        return this.orderPresenter.toHttp(order);
    }

}