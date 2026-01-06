import { IUserResponse } from "./user.type";

export interface ILoginResponse {
    user: IUserResponse;
    token: string;
}