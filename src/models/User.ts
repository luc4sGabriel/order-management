import { Schema, model } from "mongoose"
import { IUser } from "../types/user.type";

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email: string) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
            },
            message: "Invalid Email",
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters long"],
        select: false, // O campo password não será retornado por padrão nas consultas (chat deu a dica dessa boa pratica) . Se precisar retornar --> user.select('+password') nas queries
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

export const UserModel = model<IUser>("User", UserSchema);