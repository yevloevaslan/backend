import {Schema, Document, model} from 'mongoose';

export interface IUser extends Document {
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

export const UserModel = model<IUser>('user', User);