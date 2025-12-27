import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../repositories/user.repository";

export class LoginUserService {
  constructor(private userRepository: UserRepository) { }

  async execute(email: string, password: string) {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const access_token = jwt.sign(
      { sub: user._id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return { access_token };
  }
}