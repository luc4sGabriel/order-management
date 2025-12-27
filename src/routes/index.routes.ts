import { Router } from "express";
import authRoutes from "./authentication/authentication.routes";
import { accessMiddleware } from "../middlewares/access.middleware";
import orderRoutes from "./order/order.routes";
import swagger from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

const routes = Router();

// Sem Middleware
routes.use("/auth", authRoutes);

// Documentação Swagger
routes.use('/docs', swagger.serve, swagger.setup(swaggerDocument))

routes.use(accessMiddleware);

// Com Middleware a parti daqui
routes.use("/order", orderRoutes);

export default routes;