import { IUserModel } from '../../db/models/User';
import { IUser } from '../../entities/User.entity';

export default class UserClass {
    // private inputData: {phone?: string, _id?: string|undefined};
    private user: IUserModel;

    constructor(userData: IUserModel) {
        this.user = userData;
    }

    // async setup(): Promise<void> {
    //     const query: {_id?: string, phone?: string} = {};
    //     if (this.inputData._id) query._id = this.inputData._id;
    //     if (this.inputData.phone) query.phone = this.inputData.phone;
    //     this.user = await UserModel.findOne(query);
    //     if (!this.user && this.inputData.phone) {
    //         this.user = await new UserModel({
    //             phone: this.inputData.phone,
    //         }).save();
    //     } else if (!this.user) throw notFound('User not found');
    //     return;
    // }

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