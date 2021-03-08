import { IConfirmCode } from '../db/models/ConfirmCodeModel';
import { IUser } from '../db/models/User';
import {User, ConfirmCode} from './classes/index';
import TokenController from '../controllers/TokenController';
import Joi from 'joi';
import { schemaErrorHandler } from '../libs/joiSchemaValidation';

interface confirmLoginResult {
    data: {
        token: string,
        user: IUser,
    },
}

const loginInputSchema = Joi.object({
    phone: Joi.string().required().pattern(/^((\+7)+([0-9]){10})$/),
});

const confirmInputSchema = Joi.object({
    _id: Joi.string().required(),
    code: Joi.string().required(),
});

export default class UserController {
    static async login (data: {phone?: unknown}): Promise<{data: IConfirmCode}> {
        schemaErrorHandler(loginInputSchema.validate(data));
        const confirmCode = await ConfirmCode({phone: String(data.phone)});
        await confirmCode.generateCode();
        return {
            data: confirmCode.data,
        };
    }

    static async confirmLogin (data: {_id: string, code: string}): Promise<confirmLoginResult> {
        schemaErrorHandler(confirmInputSchema.validate(data));
        const confirmCode = await ConfirmCode({_id: data._id});
        await confirmCode.checkCode(data. code);
        const user = await User({phone: confirmCode.getPhone});
        const token = await TokenController.createToken({_id: user._id, type: 'user'});
        return {
            data: {
                token,
                user: user.data,
            },
        };
    }

    static async getUser(query: {_id: string}): Promise<IUser> {
        const user = await User(query);
        return user.data;
    }
}