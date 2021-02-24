import { IUser } from '../db/models/User';
import UserClass from './classes/UserClass';

export default class UserController {
    static async login (phone?: unknown): Promise<{data: IUser}> {
        const user = new UserClass({phone: String(phone)});
        const exists = await user.setup();
        if (!exists) await user.createUser();
        return {
            data: user.getUser(),
        };
    }
}