import {Schema, model, Document} from 'mongoose';
import {IConfirmCode} from '../../entities';
export interface IConfirmCodeModel extends IConfirmCode, Document {
    _id: string,
    phone: string,
    code: string,
    updatedAt: string,
}

const ConfirmCode = new Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
    },
}, {
    timestamps: true,
});

export const ConfirmCodeModel = model<IConfirmCodeModel>('confirm_code', ConfirmCode);