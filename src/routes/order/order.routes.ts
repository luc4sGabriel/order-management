import { Router } from "express";
import { OrderController } from "../../controllers/order.controller";

const orderRoutes = Router();
const orderController = new OrderController();

orderRoutes.get("/", orderController.findPaginated);
orderRoutes.post("/new", orderController.create);
orderRoutes.patch("/:id/advance", orderController.changeState);

export default orderRoutes;