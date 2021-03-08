import { IUser } from '../db/models/User';
import TokenController from './TokenController';
import UserController from './UserController';

export default class CheckTokenController {
    static async checkToken(token: string): Promise<{user?: IUser}> {
        const data = await TokenController.decodeToken(token);
        if (data.type === 'user') {
            const user = await UserController.getUser({_id: data._id});
            return {user};
        }
    }
}