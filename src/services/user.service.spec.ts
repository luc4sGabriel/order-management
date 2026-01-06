import { describe, it, expect, beforeEach, vi } from "vitest";
import { OrderService } from "./order.service";
import { orderStates } from "../types/enum/enums.type";
import { NotFoundError } from "../errors/not-found-error"
import { BadRequestError } from "../errors/bad-request-error"
import { Types } from "mongoose";

const mockOrderRepository = {
  findById: vi.fn(),
  changeState: vi.fn(),
};

const orderService = new OrderService(mockOrderRepository as any);

describe("ChangeStateOrderService", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should be able to advance state from CREATED to ANALYSIS", async () => {
    const order = {
      _id: new Types.ObjectId(),
      lab: "Lab A",
      patient: "Patient X",
      state: orderStates.CREATED,
    };

    mockOrderRepository.findById.mockResolvedValue(order);
    mockOrderRepository.changeState.mockImplementation((id, state) =>
      Promise.resolve({ ...order, state })
    );

    const result = await orderService.advance("1");

    expect(result.state).toBe(orderStates.ANALYSIS);
    expect(mockOrderRepository.changeState).toHaveBeenCalledWith("1", orderStates.ANALYSIS);
  });

  it("should be able to advance state from ANALYSIS to COMPLETED", async () => {
    const order = { _id: new Types.ObjectId(), state: orderStates.ANALYSIS };

    mockOrderRepository.findById.mockResolvedValue(order);
    mockOrderRepository.changeState.mockImplementation((id, state) =>
      Promise.resolve({ ...order, state })
    );

    const result = await orderService.advance("1");

    expect(result.state).toBe(orderStates.COMPLETED);
    expect(mockOrderRepository.changeState).toHaveBeenCalledWith("1", orderStates.COMPLETED);
  });

  it("should not be able to advance when state is COMPLETED", async () => {
    const order = { _id: new Types.ObjectId(), state: orderStates.COMPLETED };
    mockOrderRepository.findById.mockResolvedValue(order);

    await expect(orderService.advance("1")).rejects.toThrow(BadRequestError);
  });

  it("should not be able to advance if the order doesn't exists", async () => {
    mockOrderRepository.findById.mockResolvedValue(null);

    await expect(orderService.advance("1")).rejects.toThrow(NotFoundError);
  });

});