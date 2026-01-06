import { CreateUserDto } from "../dtos/user.dto";
import { UserModel } from "../models/User";
import { IUser } from "../types/user.type";
import { paginate } from "../utils/paginate";

export class UserRepository {
    async findByEmail(email: string): Promise<IUser | null> {
        // Seleciona o campo password que por padrao esta com select: false no schema
        return UserModel.findOne({
            email: email.trim().toLowerCase(),
            deletedAt: null
        }).select("+password");
    }

    async findById(id: string): Promise<IUser | null> {
        return UserModel.findById(id);
    }

    async findAll(page: number, limit: number) {
        // fiz um utils pra paginacao pra reutilizar em outros repositorios
        return paginate<IUser>(UserModel, {
            filter: { deletedAt: null },
            page,
            limit,
        });
    }

    async create(data: CreateUserDto & { password: string}): Promise<IUser> {
        const user = new UserModel({
            ...data,
            deletedAt: null, // ja deixo o campo deletedAt como null ao criar
        });

        console.log("Creating user with data:", user);
        // salva no banco
        return await user.save();
    }

    // soft delete: apenas marca a data de exclusao sem remover o registro do banco
    async softDelete(id: string): Promise<IUser | null> {
        return UserModel.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
    }

    // usei o partial pra permitir atualizar apenas alguns campos sem precisar passar o objeto completo                   ||
    //                               \  /
    //                                \/
    async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
        return UserModel.findByIdAndUpdate(id, data, { new: true });
    }

}