import { notFound } from 'boom';
import { AdminModel, ConfirmCodeModel, UserModel } from '../../db/models';
import AdminClass from './AdminClass';
import ConfirmCodeClass from './ConfirmCodeClass';
import UserClass from './UserClass';

export const User = async (data: {phone?: string, _id?: string}): Promise<UserClass> => {
    const query = data._id ? {_id: data._id} : {phone: data.phone};
    let userData = await UserModel.findOne(query);
    if (!userData) {
        if (query.phone) {
            userData = await new UserModel({
                phone: data.phone,
                score: 0,
                firstIn: true,
            }).save();
        }
        if (!userData) throw notFound('User not found');
    } 
    const user = new UserClass(userData);
    return user;
};

export const ConfirmCode = async (data: {phone?: string, _id?: string}): Promise<ConfirmCodeClass> => {
    const query = data._id ? {_id: data._id} : {phone: data.phone};
    let confirmCodeData = await ConfirmCodeModel.findOne(query);
    if (!confirmCodeData) {
        if (data.phone) {
            confirmCodeData = await new ConfirmCodeModel({
                phone: data.phone,
            }).save();
        }
    }
    const confirmCode = new ConfirmCodeClass(confirmCodeData);
    return confirmCode;
};

export const Admin = async (query: {_id?: string, login?: string}): Promise<AdminClass> => {
    const admin = await AdminModel.findOne(query);
    if (!admin) throw notFound('Admin not found');
    return new AdminClass(admin);
};