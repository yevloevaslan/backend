import Boom from 'boom';
import { NextFunction, Request, Response } from 'express';

export const apiErrorHandler = (error: Boom, _req: Request, res: Response, _next: NextFunction): void => {
    console.error(new Date(), error);
    res.status(error.output ? error.output.statusCode || 500 : 500).send({
        error: error.output ? error.output.payload.message : 'Server error',
        data: null,
    });
};