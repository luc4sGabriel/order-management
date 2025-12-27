import { UserModel, IUser } from "../models/User";

export class UserRepository {
    async findByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email });
    }

    async create(data: { email: string; password: string }): Promise<IUser> {
        return UserModel.create(data);
    }
}