import ConfirmCodeClass from './ConfirmCodeClass';
import UserClass from './UserClass';

export const User = async (data: {phone?: string, _id?: string}): Promise<UserClass> => {
    const user = new UserClass(data);
    await user.setup();
    return user;
};

export const ConfirmCode = async (data: {phone?: string, _id?: string}): Promise<ConfirmCodeClass> => {
    const confirmCode = new ConfirmCodeClass(data);
    await confirmCode.setup();
    return confirmCode;
};