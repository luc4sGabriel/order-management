import { ServiceError } from "../service-errors";

export class UserAlreadyExistsError extends ServiceError{
    constructor() {
        super(`User Already Exists.`);
    }
}