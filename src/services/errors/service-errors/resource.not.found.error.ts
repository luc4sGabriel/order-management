import { ServiceError } from "../service-errors";

export class ResourceNotFoundError extends ServiceError{
    constructor() {
        super(`Resource Not Found.`);
    }
}