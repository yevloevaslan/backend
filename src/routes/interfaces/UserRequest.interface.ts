import { Request } from 'express';
import UserClass from '../../controllers/classes/UserClass';

export interface UserRequestInterface extends Request {
    user?: UserClass,
}