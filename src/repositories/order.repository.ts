import { OrderModel } from "../models/Order";
import { orderStates, orderStatus } from "../types/enum/enums.type";
import { IOrder } from "../types/order.type";
import { CreateOrderDto, CreateOrderServiceSchema } from "../dtos/order.dto";
import { paginate } from "../utils/paginate";
import { NotFoundError } from "../errors/not-found-error";

export class OrderRepository {
  // Precisei tipar com o DTO pra o typescript inferir o tipo certo no service , dai que criei os dtos tudo ..
  async create(data: CreateOrderDto): Promise<IOrder> {
    const order = new OrderModel({
      ...data,
      state: orderStates.CREATED,
      status: orderStatus.ACTIVE,
    });

    return order.save();
  }

  async changeState(id: string, state: orderStates): Promise<IOrder> {
    const order = await OrderModel.findByIdAndUpdate(id, { state, updatedAt: new Date() }, { new: true });

    if (!order) throw new Error("Order not found");
    return order;
  }

  async findAll(
    page: number,
    limit: number,
    state?: orderStates,
  ) {
    const filter: any = {
      deletedAt: null,
    };

    if (state) {
      filter.state = state;
    }

    return paginate<IOrder>(OrderModel, {
      filter,
      page,
      limit,
    });
  }

  async softDelete(id: string): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(id,
      { status: orderStatus.DELETED, updatedAt: new Date() },
      { new: true }
    );
  }

  // Ao que parece o mongoose cria as tabelas com um capo _id automaticamente , entao da pra buscar os Orders por id ._.
  async findById(id: string): Promise<IOrder | null> {
    return OrderModel.findById(id);
  }

  async addService(data: CreateOrderServiceSchema, id: string): Promise<IOrder> {
    const order = await OrderModel.findById(id);

    if (!order) {
      throw new NotFoundError("Order");
    }

    order.services.push(data);
    order.updatedAt = new Date();

    order.save();

    return order;
  }
}