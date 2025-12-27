import { ServiceError } from "../service-errors";

export class InvalidOrderStateError extends ServiceError{
    constructor() {
        super(`Invalid Order State`);
    }
}