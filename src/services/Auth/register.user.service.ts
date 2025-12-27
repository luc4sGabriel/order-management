import bcrypt from "bcryptjs";
import { UserRepository } from "../../repositories/user.repository";

export class RegisterUserService {
  constructor(private userRepository: UserRepository) { }

  async execute(email: string, password: string) {

    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      // Criar erro depois
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 6);

    return this.userRepository.create({
      email,
      password: hashedPassword
    });
  }
}