import { IUser } from '../entities';
import {User, ConfirmCode} from './classes/index';
import {createToken} from '../controllers/TokenController';
import Joi from 'joi';
import { schemaErrorHandler } from '../libs/joiSchemaValidation';
import UserClass from './classes/UserClass';
import { paginationParams } from '../libs/checkInputParameters';
import { UserModel } from '../db/models';
import moment from 'moment';
import { badGateway, badRequest } from 'boom';
import { userUpdateInterface } from './interfaces';
import needle from 'needle';
import config from '../config';
import { GroupByLevel } from '../entities/TasksCount.entity';

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

interface usersCountResult {
    data: {
        count: number,
    },
}

export interface userTasksCount {
    byLevel: GroupByLevel
}

interface loginResult {
    data: {
        _id: string,
        updatedAt: string,
    }
}

interface voidResult {
    data: null,
}

const fakePhones = ['+79991111111', '+79992222222', '+79993333333'];

const loginInputSchema = Joi.object({
    phone: Joi.string().required().pattern(/^((\+7)+([0-9]){10})$/),
});

const confirmInputSchema = Joi.object({
    _id: Joi.string().required(),
    code: Joi.string().required(),
});

const userUpdateInputSchema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    middleName: Joi.string(),
    birthday: Joi.string().allow('', null).pattern(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
    email: Joi.string().email(),
    sex: Joi.string().allow('', null).valid('f', 'm'),
    img: Joi.string(),
}).unknown();

const login = async (data: {phone?: string}): Promise<loginResult> => {
    schemaErrorHandler(loginInputSchema.validate(data));
    const confirmCode = await ConfirmCode({phone: String(data.phone)});
    if (fakePhones.includes(data.phone)) {
        await confirmCode.generateCode(true);
    } else {
        await confirmCode.generateCode();
        const succesSend = await sendSms(String(data.phone), confirmCode.data.code);
        if (!succesSend) throw badGateway('Sms service error');
    }

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
    const userData = user.data;
    if (user.data.firstIn) await user.endFirstLogin();
    return {
        data: {
            token,
            user: userData,
        },
    };
};

const updateUserData = async (user?: UserClass, data?: userUpdateInterface, userId?: string): Promise<voidResult> => {
    schemaErrorHandler(userUpdateInputSchema.validate(data));
    if (!user) {
        if (!userId) throw badRequest('Enter user id');
        user = await User({_id: userId});
    }
    await user.updateUserData(data);
    return {
        data: null,
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
                if (!u.score) u.score = 0;
                return u;
            }),
        },
    };
};

const usersCount = async (): Promise<usersCountResult> => {
    const count = await UserModel.countDocuments();
    return {
        data: {
            count,
        },
    };
};

const sendSms = async(phone: string, code: string): Promise<boolean>=>{
    phone = parseInt(phone).toString();
    const text = `Код подтверждения ${code}`;
    const uri = `${config.smsServiceUri}?api_id=${config.smsApiID}&to=${phone}&msg=${text}&json=1`;
    const result = await needle('get', encodeURI(uri));
    if (100 <= parseInt(result?.body?.status_code) && parseInt(result?.body?.status_code)<= 103) {
        return true;
    }
    return false;
};

const getUserTasksCount = async(userId: string): Promise<userTasksCount>=>{
    const result = await UserModel.findOne({_id: userId}, {tasksCount: 1, _id: 0});
    return result ? result.tasksCount : null;
};

export {
    login,
    confirmLogin,
    getUser,
    getUsers,
    usersCount,
    updateUserData,
    getUserTasksCount,
};