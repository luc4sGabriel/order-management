import { OrderRepository } from "../../repositories/order.repository";
import { State } from "../../models/Order";
import { ResourceNotFoundError } from "../errors/service-errors/resource.not.found.error";
import { OrderAlreadyCompletedError } from "../errors/service-errors/order.already.completed.error";
import { InvalidOrderStateError } from "../errors/service-errors/invalid.order.state.error";

export class ChangeStateService {
    constructor(private orderRepository: OrderRepository) { }

    async execute(orderId: string) {
        const order = await this.orderRepository.findById(orderId);
        // fazer o erro dps
        if (!order) 
            throw new ResourceNotFoundError();

        let nextState: State;

        // Dava pra fazer usando numeros no enum do Model de Order , as a essa altura se eu fosse refatorar ia fazer mt dor de cabeca , entao deixei assim msm um switch simples

        switch (order.state) {
            case State.CREATED:
                nextState = State.ANALYSIS;
                break;
            case State.ANALYSIS:
                nextState = State.COMPLETED;
                break;
            case State.COMPLETED:
                // fazer o erro dps
                throw new OrderAlreadyCompletedError();
            default:
                // fazer o erro dps
                throw new InvalidOrderStateError();
        }

        return this.orderRepository.changeState(orderId, nextState);
    }
}