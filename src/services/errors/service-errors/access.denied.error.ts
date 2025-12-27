import { ServiceError } from "../service-errors";

export class AccessDeniedError extends ServiceError{
    constructor() {
        super(`Access Denied.`);
    }
}