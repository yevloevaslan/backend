import { IUser } from '../entities';
import {User, ConfirmCode} from './classes/index';
import {createToken} from '../controllers/TokenController';
import Joi from 'joi';
import { schemaErrorHandler } from '../libs/joiSchemaValidation';
import UserClass from './classes/UserClass';
import { paginationParams } from '../libs/checkInputParameters';
import { UserModel } from '../db/models';
import moment from 'moment';
interface confirmLoginResult {
    data: {
        token: string,
        user: IUser,
    },
}

interface getUsersResult {
    data: {
        users: Array<IUser>
    },
}

interface loginResult {
    data: {
        _id: string,
        updatedAt: string,
    }
}

const loginInputSchema = Joi.object({
    phone: Joi.string().required().pattern(/^((\+7)+([0-9]){10})$/),
});

const confirmInputSchema = Joi.object({
    _id: Joi.string().required(),
    code: Joi.string().required(),
});

const login = async (data: {phone?: unknown}): Promise<loginResult> => {
    schemaErrorHandler(loginInputSchema.validate(data));
    const confirmCode = await ConfirmCode({phone: String(data.phone)});
    await confirmCode.generateCode();
    //sendcode
    return {
        data: {
            _id: confirmCode.data._id,
            updatedAt: confirmCode.data.updatedAt,
        },
    };
};

const confirmLogin = async (data: {_id: string, code: string}): Promise<confirmLoginResult> => {
    schemaErrorHandler(confirmInputSchema.validate(data));
    const confirmCode = await ConfirmCode({_id: data._id});
    await confirmCode.checkCode(data.code);
    const user = await User({phone: confirmCode.getPhone});
    const token = await createToken({_id: user._id, type: 'user'});
    return {
        data: {
            token,
            user: user.data,
        },
    };
};

const getUser = async (query: {_id: string}): Promise<UserClass> => {
    const user = await User(query);
    return user;
};

const getUsers = async ({_id}: {_id: string}, options: {page?: number, limit?: number} = {}): Promise<getUsersResult> => {
    const query: {_id?: string} = {};
    if (_id) query._id = _id;
    const {skip, limit} = paginationParams(options.page, options.limit);
    const users = await UserModel.find(query).lean().limit(limit).skip(skip);
    return {
        data: {
            users: users.map(u => {
                u.createdAt = moment(u.createdAt).toISOString();
                u.updatedAt = moment(u.updatedAt).toISOString();
                return u;
            }),
        },
    };
};


export {
    login,
    confirmLogin,
    getUser,
    getUsers,
};