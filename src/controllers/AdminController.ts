import Joi from 'joi';
import { IAdmin } from '../entities';
import { schemaErrorHandler } from '../libs/joiSchemaValidation';
import { Admin } from './classes';
import AdminClass from './classes/AdminClass';
import {createToken} from './TokenController';
import {compareSync} from 'bcrypt';
import { unauthorized } from 'boom';

const loginInputSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required(),
});

interface adminLoginResult {
    data: {
        token: string,
        admin: IAdmin,
    },
}

const login = async (data: {login: string, password: string}): Promise<adminLoginResult> => {
    schemaErrorHandler(loginInputSchema.validate(data));
    const admin = await Admin({login: data.login});
    if (!compareSync(data.password, admin.password)) throw unauthorized('Auth error');
    const token = await createToken({_id: admin._id, type: 'admin'});
    return {
        data: {
            token,
            admin: admin.data,
        },
    };
};

const getAdminById = async (_id: string): Promise<AdminClass> => {
    const admin = await Admin({_id});
    return admin;
};

export {
    login,
    getAdminById,
};