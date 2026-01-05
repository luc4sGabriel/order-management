/* Eu nao sabia mt bem mexer com o mongoose , ai pedi aquela velha ajuda da IA pra entender 
um pouco desse formato de Document que ele usa , e tbm pra criar o schema e o model direito 
Achei ele um pouco verboso , to acostumado mais com o prisma msm */

import { Schema, model } from "mongoose";
import { orderStates, orderStatus, serviceStatus } from "../types/enum/enums.type";
import { IOrder, IService } from "../types/order.type";

// { name: string, value: number, status: 'PENDING' | 'DONE' }
const orderServiceSchema = new Schema<IService>({
    name: {
        type: String,
        required: [true, "Service name is required"],
        trim: true
    },
    value: {
        type: Number,
        min: [0, "Service value must be positive"],
        required: [true, "Service value is required"],
    },
    status: {
        type: String,
        enum: Object.values(serviceStatus),
        default: serviceStatus.PENDING,
        required: true
    }
})

// antes tava assim: const OrderSchema = new Schema<IOrder>({...})
// porem tava dando erro de tipagem no moongose com o typescript na hora, resolvi deixando assim ..
// dessa forma o proprio mongoose ja infere o tipo do schema
// tentei tipar e fui nerfado pelo typescript ..
const OrderSchema = new Schema<IOrder>({
    lab: {
        type: String,
        required: [true, "Lab is required"],
        trim: true
    },
    patient: {
        type: String,
        required: [true, "Patient is required"],
        trim: true
    },
    customer: {
        type: String,
        required: [true, "Customer is required"],
        trim: true
    },
    state: {
        type: String,
        enum: Object.values(orderStates),
        default: orderStates.CREATED
    },
    status: {
        type: String,
        enum: Object.values(orderStatus),
        default: orderStatus.ACTIVE
    },
    services: {
        type: [orderServiceSchema],
        required: [true, "At least one service is required"],
        validate: {
            validator: function (services: IService[]) {
                return Array.isArray(services) && services.length > 0;
            },
            message: "Order must have at least one service"
        }
    }
});

export const OrderModel = model<IOrder>("Order", OrderSchema);