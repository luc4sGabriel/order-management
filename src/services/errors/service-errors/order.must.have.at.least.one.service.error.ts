import { ServiceError } from "../service-errors";

export class OrderMustHaveAtLeastOneServiceError extends ServiceError{
    constructor() {
        super(`Order Must Have At Least One Service.`);
    }
}