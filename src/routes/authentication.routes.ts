import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthenticationService } from "../services/authentication.service";
import { UserRepository } from "../repositories/user.repository";

const authRoutes = Router();

const authService = new AuthenticationService(new UserRepository());
const authController = new AuthController(authService);

authRoutes.post("/login", (req, res) => 
    authController.login(req, res)
);

export default authRoutes;