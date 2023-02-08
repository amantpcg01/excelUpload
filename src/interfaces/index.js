// import { NextFunction, Response } from "express";
const { NextFunction, Response } = require("express")

// class implement interface
export interface CRUD {
    get(req: any, res: IResponse<any>, next: NextFunction): void;
    getAll(req: any, res: IResponse<any>, next: NextFunction): void;
    add(req: any, res: IResponse<any>, next: NextFunction): void;
    edit(req: any, res: IResponse<any>, next: NextFunction): void;
    delete(req: any, res: IResponse<any>, next: NextFunction): void;
}

interface ResponseBody <T> {
    message: string;
    errors?: string | string[],
    data?: T
}

export type IResponse<T> = Response<ResponseBody<T>>;
