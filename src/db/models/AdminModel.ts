import {Schema, model, Document} from 'mongoose';
import { IAdmin } from '../../entities';

export interface IAdminModel extends Document, IAdmin {
    _id: string,
    login: string,
    createdAt: string,
    updatedAt: string,
    password: string,
}

const Admin = new Schema({
    login: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const AdminModel = model<IAdminModel>('admin', Admin);