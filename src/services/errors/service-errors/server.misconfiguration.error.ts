import { ServiceError } from "../service-errors";

export class ServerMisconfigurationError extends ServiceError{
    constructor() {
        super(`Server Misconfiguration.`);
    }
}