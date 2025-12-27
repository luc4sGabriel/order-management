import { CreateOrderDTO } from "../dtos/create.order.dto";
import { OrderModel, IOrder, State, Status, ServicesStatus } from "../models/Order";

export class OrderRepository {
  // Precisei tipar com o DTO pra o type inferir o tipo certo no service
  async create(data: CreateOrderDTO & {
    state: State;
    status: Status;
    services: { name: string; value: number; status: ServicesStatus }[];
  }) {
    return OrderModel.create(data);
  }

  // Recebe
  async changeState(id: string, newState: State){
    return OrderModel.findByIdAndUpdate(id, { state: newState }, { new: true });
  }

  async findPaginated(
    filters: Record<string, any>,
    page: number,
  ) {
    const skip = (page - 1) * 20;

    const [orders, total] = await Promise.all([
      OrderModel.find(filters)
        .skip(skip)
        .limit(20)
        .lean<IOrder[]>(),
      OrderModel.countDocuments(filters),
    ]);

    return {
      data: orders,
      meta: {
        page,
        total,
        totalPages: Math.ceil(total / 20),
      },
    };
  }

  // Ao que parece o mongoose cria as tabelas com um capo _id automaticamente , entao da pra buscar os Orders por id ._.
  async findById(id: string) {
    return OrderModel.findById(id);
  }

  async save(order: IOrder) {
    return order.save();
  }
}