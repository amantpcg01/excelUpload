import { NextFunction, Request, Response } from 'express';
import { HttpCode } from '../enums';
import { ZodError, ZodIssue } from "zod";
import { formatZodErrors } from '../helpers';
import { AppError } from '../utils/errors.util';

export const errorHandlerMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
	
	if (!err) {
		return next();
	}

	if (err instanceof ZodError) {
		res.status(HttpCode.UnprocessableEntity).json({
			message:"Validation error",
			errors: formatZodErrors(err)
		});
	} else if(err instanceof AppError) {
        res.status(err.status).json({
            message: 'App Error',
            errors: [err.message]
        })
    }
    else {
        res.status(HttpCode.InternalServerError).json({
			message:"Internal server error!",
			errors: [(err as Error).message]
		});
    }
};