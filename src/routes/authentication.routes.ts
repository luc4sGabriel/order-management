import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthenticationService } from "../services/authentication.service";
import { UserRepository } from "../repositories/user.repository";
import { ValidateMiddleware } from "../middlewares/validate.schema.middleware";
import { loginSchema } from "../dtos/login.dto";
import { JwtService } from "../utils/jwt.utils";

const authRoutes = Router();

const authService = new AuthenticationService(new UserRepository(), new JwtService());
const authController = new AuthController(authService);

authRoutes.post("/login",
    ValidateMiddleware.body(loginSchema),
    (req, res) => authController.login(req, res)
);

export default authRoutes;