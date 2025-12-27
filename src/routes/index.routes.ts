import { Router } from "express";
import authRoutes from "./authentication/authentication.routes";
import { accessMiddleware } from "../middlewares/access.middleware";
import orderRoutes from "./order/order.routes";

const routes = Router();

// Sem Middleware
routes.use("/auth", authRoutes);

routes.use(accessMiddleware);

// Com Middleware a parti daqui
routes.use("/order", orderRoutes);

export default routes;