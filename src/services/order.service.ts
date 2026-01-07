import { CreateOrderDto, CreateOrderServiceSchema } from "../dtos/order.dto";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { OrderPresenter } from "../presenters/order.presenter";
import { OrderRepository } from "../repositories/order.repository";
import { orderStates } from "../types/enum/enums.type";
import { IOrder, IOrderResponse } from "../types/order.type";
import { PaginatedResponse } from "../types/pagination.types";

export class OrderService {
    constructor(
        private orderRepository: OrderRepository,
    ) { }

    async create(data: CreateOrderDto): Promise<IOrderResponse> {
        if (!data.services || data.services.length === 0) {
            throw new BadRequestError("At least one service must be provided");
        }

        const totalValue = data.services.reduce((sum, s) => sum + s.value, 0);
        if (totalValue <= 0) {
            throw new BadRequestError("Total value of services must be greater than zero");
        }

        // tudo validado no zod pae
        const order = await this.orderRepository.create(data);

        return OrderPresenter.toHttp(order);
    }

    async advance(id: string): Promise<IOrderResponse> {
        const order = await this.orderRepository.findById(id);

        if (!order) {
            throw new NotFoundError("Order");
        }

        let nextState: orderStates;

        // sei que desse jeito seria horrivel pra escalar, seria bacana fazer um util bonitinho pra ajeitar e escalar a nivel de producao caso futuramente tenha um novo state .. o que me ferrou aqui foi o tempo mesmo
        switch (order.state) {
            case orderStates.CREATED:
                nextState = orderStates.ANALYSIS;
                break;
            case orderStates.ANALYSIS:
                nextState = orderStates.COMPLETED;
                break;
            case orderStates.COMPLETED:
                throw new BadRequestError("Order is already completed and cannot be advanced");
            default:
                throw new BadRequestError("Invalid order state");
        }

        const updatedOrder = await this.orderRepository.changeState(id, nextState);

        return OrderPresenter.toHttp(updatedOrder);
    }

    async findAll(
        page: number,
        limit: number,
        state?: orderStates,
    ): Promise<PaginatedResponse<IOrderResponse>> {
        const result = await this.orderRepository.findAll(page, limit, state);

        const data = result.data.map(order => OrderPresenter.toHttp(order));

        return {
            ...result,
            data,
        };
    }

    async softDelete(id: string): Promise<IOrderResponse> {
        const order = await this.orderRepository.findById(id);
        
        if (!order) {
            throw new NotFoundError("Order");
        }

        if (order.state === orderStates.COMPLETED) {
            throw new BadRequestError("Completed orders cannot be deleted");
        }

        const deletedOrder = await this.orderRepository.softDelete(id);

        if (!deletedOrder) {
            throw new NotFoundError("Order");
        }

        return OrderPresenter.toHttp(deletedOrder);
    }

    async findById(id: string): Promise<IOrderResponse> {
        const order = await this.orderRepository.findById(id);

        if (!order) {
            throw new NotFoundError("Order");
        }

        return OrderPresenter.toHttp(order);
    }

    async addService(data: CreateOrderServiceSchema, id: string): Promise<IOrder>{
        const order = await this.orderRepository.addService(data, id);

        if (!order) {
            throw new NotFoundError("Order");
        }

        return order;
    }

}