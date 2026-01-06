import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderService } from "../services/order.service";
import { OrderRepository } from "../repositories/order.repository";
import { accessMiddleware } from "../middlewares/access.middleware";
import { ValidateMiddleware } from "../middlewares/validate.schema.middleware";
import { CreateOrderDTO } from "../dtos/order.dto";

const orderRoutes = Router();

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

orderRoutes.use(accessMiddleware);

orderRoutes.post("/",
    ValidateMiddleware.body(CreateOrderDTO),
    (req, res) => orderController.create(req, res)
);

// fazer o validate das querys
orderRoutes.get("/",(req, res) => 
    orderController.findAll(req, res)
);

orderRoutes.get("/:id", (req, res) =>
    orderController.findById(req, res)
);

orderRoutes.patch("/:id/advance", (req, res) =>
    orderController.changeState(req, res)
);

orderRoutes.delete("/:id", (req, res) =>
    orderController.softDelete(req, res)
);

export default orderRoutes;