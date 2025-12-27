import { ServiceError } from "../service-errors";

export class OrderAlreadyCompletedError extends ServiceError{
    constructor() {
        super(`Order Already Completed`);
    }
}