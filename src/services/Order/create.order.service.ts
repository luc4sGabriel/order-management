import { OrderRepository } from "../../repositories/order.repository";
import { CreateOrderDTO, CreateOrderServiceDTO } from "../../dtos/create.order.dto";
import { State, Status, ServicesStatus } from "../../models/Order"
import { ServiceValueMustBeGreaterThanZeroError } from "../errors/service-errors/service.value.must.be.greater.than.zero.error";

export class CreateOrderService {
    constructor(private orderRepository: OrderRepository) { }

    async execute(data: CreateOrderDTO) {
        // Regra de negocio : Não permitir criação de pedidos sem serviços ou com valor total zerado.
        if (!data.services?.length) {
            throw new Error("Order must have at least one service");
        }

        // N sabia como validar isso , devido ao estilo que fiz no Model , n to mt acostumado com o mongoose , ai fui no velho GPT e ele sugeriu esse jeito de 3 opcoes , por ser mais curto e funcionar deixei esse
        if (data.services.some((service: CreateOrderServiceDTO) => service.value <= 0)) {
            throw new ServiceValueMustBeGreaterThanZeroError();
        }

        const order = await this.orderRepository.create({
            ...data,
            state: State.CREATED,
            status: Status.ACTIVE,
            services: data.services.map((service: CreateOrderServiceDTO) => ({
                ...service,
                status: ServicesStatus.PENDING
            }))
        });

        return order;;
    }
}