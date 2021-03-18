import { unauthorized } from 'boom';
import {getAdminById} from './AdminController';
import AdminClass from './classes/AdminClass';
import UserClass from './classes/UserClass';
import {decodeToken} from './TokenController';
import {getUser} from './UserController';

const checkToken = async (token: string, type?: 'user'|'admin'): Promise<{user?: UserClass, admin?: AdminClass}> => {
    const data = await decodeToken(token);
    if (data.type === 'user') {
        if (type && type !== 'user') throw unauthorized('Auth error');
        const user: UserClass = await getUser({_id: data._id});
        return {user};
    } else if (data.type === 'admin') {
        if (type && type !== 'admin') throw unauthorized('Auth error');
        const admin = await getAdminById(data._id);
        return {admin};
    } else throw unauthorized('Auth error');
};

export {
    checkToken,
};