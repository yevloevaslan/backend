import { unauthorized } from 'boom';
import { NextFunction, Response } from 'express';
import {checkToken} from '../../controllers/CheckTokenController';
import { UserRequestInterface } from '../interfaces/UserRequest.interface';

export function checkTokenMiddleware(type?: 'user'|'admin') {
    return async (req: UserRequestInterface, _res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.cookies['x-access-token'] || req.headers['x-access-token'];
            if (!token) throw unauthorized('Auth error');
            const {user} = await checkToken(token, type);
            req.user = user;
            next();
        } catch (err) {
            throw unauthorized(err);
        }
    };
} 