import { Document } from "mongoose";
import { serviceStatus, orderStates, orderStatus } from "./enum/enums.type";

// services (Array obrigatório): { name: string, value: number, status: 'PENDING' | 'DONE' }.
export interface IService {
    name: string;
    value: number;
    status: serviceStatus;
}

// Interface para retornar o order com os campos certinhos
export interface IOrderResponse {
    id: string;
    lab: string;
    patient: string;
    customer: string;
    state: orderStates;
    status: orderStatus;
    services: IService[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrder extends Document {
    lab: string;
    patient: string;
    customer: string;
    state: orderStates;
    status: orderStatus;
    services: IService[];
    createdAt: Date;
    updatedAt: Date;
}

