import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";

const userRoutes = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRoutes.post("/", (req, res) =>
  userController.create(req, res)
);

userRoutes.get("/", (req, res) =>
  userController.findAll(req, res)
);

userRoutes.get("/:id", (req, res) =>
  userController.findById(req, res)
);

userRoutes.get("/email/:email", (req, res) =>
  userController.findByEmail(req, res)
);

userRoutes.put("/:id", (req, res) =>
  userController.update(req, res)
);

userRoutes.delete("/:id", (req, res) =>
  userController.softDelete(req, res)
);

export default userRoutes;