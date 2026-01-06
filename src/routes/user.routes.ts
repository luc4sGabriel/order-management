import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { accessMiddleware } from "../middlewares/access.middleware";
import { ValidateMiddleware } from "../middlewares/validate.schema.middleware";
import { createUserSchema, updateUserSchema } from "../dtos/user.dto";

const userRoutes = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Rota pública para criação de usuário
userRoutes.post("/", 
  ValidateMiddleware.body(createUserSchema),
  (req, res) => userController.create(req, res)
);

// Middleware de autenticação
userRoutes.use(accessMiddleware);

userRoutes.get("/", (req, res) =>
  userController.findAll(req, res)
);

userRoutes.get("/email/:email", (req, res) =>
  userController.findByEmail(req, res)
);

userRoutes.get("/:id", (req, res) =>
  userController.findById(req, res)
);

userRoutes.put("/:id", 
  ValidateMiddleware.body(updateUserSchema),
  (req, res) => userController.update(req, res)
);

userRoutes.delete("/:id", (req, res) =>
  userController.softDelete(req, res)
);

export default userRoutes;