import {Schema, model, Document} from 'mongoose';

export interface IConfirmCode{
    _id: string,
    phone: string,
    code: string,
    updatedAt: string,
}

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
    },
    code: {
        type: String,
    },
}, {
    timestamps: true,
});

export const ConfirmCodeModel = model<IConfirmCodeModel>('confirm_code', ConfirmCode);