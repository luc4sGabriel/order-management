import { describe, it, expect, vi, Mocked, beforeEach } from "vitest";
import { OrderRepository } from "../../repositories/order.repository";
import { ChangeStateService } from "./change.state.order.service";
import { State } from "../../models/Order";

describe("ChangeStateOrderService", () => {
    let repository: Mocked<OrderRepository>;
    let service: ChangeStateService;

    beforeEach(() => {
        // faz um mock do repositorio
        repository = {
            findById: vi.fn(), 
            findPaginated: vi.fn(),
            create: vi.fn(),
            changeState: vi.fn(),
            save: vi.fn(),
        } as Mocked<OrderRepository>

        service = new ChangeStateService(repository);
    })

    it("should be able to advance state from CREATED to ANALYSIS", async () => {
    repository.findById.mockResolvedValue ({ state: State.CREATED }  as any);
    repository.changeState.mockResolvedValue({ state: State.ANALYSIS }  as any);

    const result = await service.execute("order-id");

    if (!result) throw new Error("Result is undefined");

    expect(repository.changeState).toHaveBeenCalledWith(
      "order-id",
      State.ANALYSIS
    );
    expect(result.state).toBe(State.ANALYSIS);
  });



  it("should be able to advance state from ANALYSIS to COMPLETED", async () => {
    repository.findById.mockResolvedValue({ state: State.ANALYSIS }  as any );
    repository.changeState.mockResolvedValue({ state: State.COMPLETED }  as any);

    const result = await service.execute("order-id");

    if (!result) throw new Error("Result is undefined");

    expect(repository.changeState).toHaveBeenCalledWith(
      "order-id",
      State.COMPLETED
    );
    expect(result.state).toBe(State.COMPLETED);
  });



  it("should be able to not advance when state is COMPLETED", async () => {
    repository.findById.mockResolvedValue({ state: State.COMPLETED } as any);

    await expect(service.execute("order-id")).rejects.toThrow(
      "Order Already Completed"
    );

    expect(repository.changeState).not.toHaveBeenCalled();
  });

})