import { ServiceError } from "../service-errors";

export class ServiceValueMustBeGreaterThanZeroError extends ServiceError{
    constructor() {
        super(`Service Value Must Be Greater Than Zero.`);
    }
}