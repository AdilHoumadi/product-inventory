import { Request, Response, NextFunction } from "express";
import HttpException from "../config/HttpException";

export const errorHandler = (
    err: HttpException,
    req: Request,
    res: Response,
    _: NextFunction
) => {
    const status = err.statusCode || 500;
    console.log(err);
    const message = err.message || "Server error exception";
    res.status(status).json({error: message});
};


export const notFoundHandler = (
    request: Request,
    response: Response,
    _: NextFunction
) => {
    const message = "Resource not found";
    response.status(404).json({error: message});
};