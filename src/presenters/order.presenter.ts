import { IOrder, IOrderResponse } from "../types/order.type";
import { PaginatedResponse } from "../types/pagination.types";

export class OrderPresenter {
  static toHttp(order: IOrder): IOrderResponse {
    return {
      id: order._id.toString(),
      lab: order.lab,
      patient: order.patient,
      customer: order.customer,
      state: order.state,
      status: order.status,
      services: order.services,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toHttpList(
    paginated: PaginatedResponse<IOrder>
  ): PaginatedResponse<IOrderResponse> {
    return {
      data: paginated.data.map(OrderPresenter.toHttp),
      meta: paginated.meta,
    };
  }

}