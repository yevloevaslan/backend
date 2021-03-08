import Joi from 'joi';
import { IAdmin } from '../entities';
import { schemaErrorHandler } from '../libs/joiSchemaValidation';
import { Admin } from './classes';
import TokenController from './TokenController';

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

export default class AdminController {
    static async login(login: string, password: string): Promise<adminLoginResult> {
        schemaErrorHandler(loginInputSchema.validate({login, password}));
        const admin = await Admin({login});
        const token = await TokenController.createToken({_id: admin._id, type: 'admin'});
        return {
            data: {
                token,
                admin: admin.data,
            },
        };
    }
}