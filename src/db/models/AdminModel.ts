import {Schema, model, Document} from 'mongoose';
import { IAdmin } from '../../entities';

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

export const AdminModel = model<Document&IAdmin>('admin', Admin);