import {Schema, model, Document} from 'mongoose';
import {IUser} from '../../entities/User.entity';

// export interface IUserModel extends IUser, Document {
//     _id: string,
//     phone: string,
//     firstIn: boolean,
//     score: number,
//     birthday: string,
//     firstName: string,
//     lastName: string,
//     middleName: string,
//     email: string,
//     createdAt: string,
//     updatedAt: string,
// }

const User = new Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    firstIn: {
        type: Boolean,
        default: true,
    },
    score: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
    },
    birthday: {
        type: Date,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    middleName: {
        type: String,
    },
    email: {
        type: String,
    },
    sex: {
        type: String,
        enum: [
            'm',
            'f',
        ],
    },
}, {
    timestamps: true,
});

export const UserModel = model<IUser&Document>('user', User);
