import { IUserModel } from '../../db/models/User';
import { IUser } from '../../entities/User.entity';

export default class UserClass {
    private user: IUserModel;

    constructor(userData: IUserModel) {
        this.user = userData;
    }

    get _id(): string {
        return this.user._id;
    }

    get data(): IUser {
        return {
            _id: this.user._id,
            createdAt: this.user.createdAt,
            phone: this.user.phone,
            updatedAt: this.user.updatedAt,
        };
    }
}