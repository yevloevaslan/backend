import {Schema, model, Document} from 'mongoose';
import {IUser} from '../../entities/User.entity';

interface IUserModel extends IUser, Document {
    _id: string,
    phone: string,
    createdAt: string,
    updatedAt: string,
}

const User = new Schema({
    phone: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const UserModel = model<IUserModel>('user', User);