import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderService } from "../services/order.service";
import { OrderRepository } from "../repositories/order.repository";
import { OrderPresenter } from "../presenters/order.presenter";

const orderRoutes = Router();

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

orderRoutes.get("/", (req, res) =>
  orderController.findAll(req, res)
);

orderRoutes.post("/", (req, res) =>
  orderController.create(req, res)
);

orderRoutes.get("/:id", (req, res) =>
  orderController.findById(req, res)
);

orderRoutes.patch("/:id/state", (req, res) =>
  orderController.changeState(req, res)
);

orderRoutes.delete("/:id", (req, res) =>
  orderController.softDelete(req, res)
);

export default orderRoutes;