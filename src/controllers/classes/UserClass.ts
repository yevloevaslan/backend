import { notFound } from 'boom';
import { UserModel } from '../../db/models/User';
import { IUser } from '../../entities/User.entity';

export default class UserClass {
    private inputData: {phone?: string, _id?: string|undefined};
    private user: IUser;

    constructor(data: {phone?: string, _id?: string}) {
        this.inputData = {};
        if (data.phone) this.inputData.phone = data.phone; 
        this.inputData._id = data._id;  
    }

    async setup(): Promise<void> {
        this.user = await UserModel.findOne(this.inputData);
        if (!this.user && this.inputData.phone) {
            this.user = await new UserModel({
                phone: this.inputData.phone,
            }).save();
        } else if (!this.user) throw notFound('User not found');
        return;
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