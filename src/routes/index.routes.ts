import { Router } from "express";

import authRoutes from "./authentication.routes";
import userRoutes from "./user.routes";
import orderRoutes from "./order.routes";

import { accessMiddleware } from "../middlewares/access.middleware";

import swagger from "swagger-ui-express";
import swaggerDocument from "../swagger.json";


const routes = Router();

// Documentação Swagger (publica)
routes.use('/docs', swagger.serve, swagger.setup(swaggerDocument))

// Rotas públicas
routes.use("/auth", authRoutes);

// Middleware de autenticação
routes.use(accessMiddleware);

// Rotas protegidas
routes.use("/orders", orderRoutes);
routes.use("/users", userRoutes);

export default routes;