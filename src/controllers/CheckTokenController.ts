import UserClass from './classes/UserClass';
import TokenController from './TokenController';
import UserController from './UserController';

export default class CheckTokenController {
    static async checkToken(token: string): Promise<{user?: UserClass}> {
        const data = await TokenController.decodeToken(token);
        if (data.type === 'user') {
            const user: UserClass = await UserController.getUser({_id: data._id});
            return {user};
        }
    }
}