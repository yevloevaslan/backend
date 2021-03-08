import { unauthorized } from 'boom';
import AdminController from './AdminController';
import AdminClass from './classes/AdminClass';
import UserClass from './classes/UserClass';
import TokenController from './TokenController';
import UserController from './UserController';

export default class CheckTokenController {
    static async checkToken(token: string, type?: 'user'|'admin'): Promise<{user?: UserClass, admin?: AdminClass}> {
        const data = await TokenController.decodeToken(token);
        if (data.type === 'user') {
            if (type && type !== 'user') throw unauthorized('Auth error');
            const user: UserClass = await UserController.getUser({_id: data._id});
            return {user};
        } else if (data.type === 'admin') {
            if (type && type !== 'admin') throw unauthorized('Auth error');
            const admin = await AdminController.getAdminById(data._id);
            return {admin};
        } else throw unauthorized('Auth error');
    }
}