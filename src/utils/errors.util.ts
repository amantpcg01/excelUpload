import { HttpCode } from "../enums";

export class AppError extends Error {
    status: HttpCode = HttpCode.InternalServerError;
    constructor(message: string, status:number = HttpCode.InternalServerError) {
        super(message);
        this.status = status;
    }
}