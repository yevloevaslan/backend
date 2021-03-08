import { NextFunction, Response } from 'express';
import CheckTokenController from '../../controllers/CheckTokenController';
import { UserRequestInterface } from '../interfaces/UserRequest.interface';

export async function checkTokenMiddleware (req: UserRequestInterface, _res: Response, next: NextFunction): Promise<void> {
    try {
        const token = req.cookies['x-access-token'] || req.headers['x-access-token'];
        const {user} = await CheckTokenController.checkToken(token);
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}