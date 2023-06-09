import { unauthorized } from 'boom';
import { NextFunction, Response } from 'express';
import {checkToken} from '../../controllers/CheckTokenController';
import { UserRequestInterface } from '../interfaces/UserRequest.interface';
const NODE_ENV = process.env.NODE_ENV;

export function checkTokenMiddleware(type?: 'user'|'admin') {
    return async (req: UserRequestInterface, _res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.cookies['x-access-token'] || req.headers['x-access-token'];
            if (!token) {
                if (NODE_ENV === 'test') return next();
                throw unauthorized('Auth error');
            }
            const {user} = await checkToken(token, type);
            req.user = user;
            next();
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') console.error(err);
            next(unauthorized('Auth error'));
        }
    };
}
