import { State } from "../../models/Order";
import { OrderRepository } from "../../repositories/order.repository";

interface FindOrdersParams {
    page: number;
    state?: State | undefined;
}

export class FindPaginatedOrderService {
    constructor(private orderRepository: OrderRepository) { }

    async execute({ page, state }: FindOrdersParams) {
        const filters: Record<string, any> = {};

        if (state) {
            filters.state = state;
        }

        return this.orderRepository.findPaginated(filters, page);
    }
}