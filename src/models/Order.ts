/* Eu nao sabia mt bem mexer com o mongoose , ai pedi aquela velha ajuda da IA pra entender 
um pouco desse formato de Document que ele usa , e tbm pra criar o schema e o model direito 
Achei ele um pouco verboso , to acostumado mais com o prisma msm */

import { Schema, model, Document } from "mongoose";

// ENUM state: CREATED -> ANALYSIS -> COMPLETED
export enum State {
    CREATED = "CREATED",
    ANALYSIS = "ANALYSIS",
    COMPLETED = "COMPLETED"
}

// ENUM status: ACTIVE | DELETED
export enum Status {
    ACTIVE = "ACTIVE",
    DELETED = "DELETED"
}

// ENUM status services (Array obrigatório): { name: string, value: number, status: 'PENDING' | 'DONE' } . OBS: Só o de status !!

export enum ServicesStatus {
    PENDING = "PENDING",
    DONE = "DONE"
}

// { name: string, value: number, status: 'PENDING' | 'DONE' }
export interface Services {
    name: string;
    value: number;
    status: ServicesStatus;
}

export interface IOrder extends Document {
    lab: string;
    patient: string;
    customer: string;
    state: State;
    status: Status;
    services: Services[];
}

const OrderSchema = new Schema<IOrder>({
    lab: { type: String, required: true },
    patient: { type: String, required: true },
    customer: { type: String, required: true },

    state: {
        type: String,
        enum: Object.values(State),
        default: State.CREATED
    },

    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.ACTIVE
    },

    services: {
        type: [
            {
                name: { type: String, required: true },
                value: { type: Number, required: true },
                status: {
                    type: String,
                    enum: Object.values(ServicesStatus),
                    default: ServicesStatus.PENDING,
                    required: true
                }
            }
        ],
        required: true,
        validate: [(v: Services[]) => v.length > 0, "Service is required"]
    }
});

export const OrderModel = model<IOrder>("Order", OrderSchema);