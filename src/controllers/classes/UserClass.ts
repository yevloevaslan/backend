import { IUser, UserModel } from '../../db/models/User';

export default class UserClass {
    private phone;
    private user: IUser;
    constructor(data: {phone: string}) {
        this.phone = data.phone;   
    }

    async setup(): Promise<boolean> {
        this.user = await UserModel.findOne({phone: this.phone});
        return !!this.user;
    }

    async createUser(): Promise<void> {
        this.user = await new UserModel({
            phone: this.phone,
        }).save();
    }

    getUser(): IUser {
        return this.user;
    }
}