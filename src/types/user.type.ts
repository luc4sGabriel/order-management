import { Document } from "mongoose";

// Interface para retornar o user com os campos certinhos
export interface IUserResponse {
    id: string;
    email: string;
    updatedAt: Date;
    createdAt: Date;
    deletedAt?: Date | null;
}

export interface IUser extends Document {
    email: string;
    password: string;
    updatedAt: Date;
    createdAt: Date;
    deletedAt: Date | null;
}

