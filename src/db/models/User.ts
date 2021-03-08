import {Schema, model, Document} from 'mongoose';
import {IUser} from '../../entities/User.entity';

export interface IUserModel extends IUser, Document {
    _id: string,
    phone: string,
    createdAt: string,
    updatedAt: string,
}

const User = new Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

export const UserModel = model<IUserModel>('user', User);