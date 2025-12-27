import { ServiceError } from "../service-errors";

export class WrongCredentialsError extends ServiceError{
    constructor() {
        super(`Invalid Credentials.`);
    }
}