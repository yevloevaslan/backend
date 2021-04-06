import { IUserModel } from '../../db/models/User';
import { IUser } from '../../entities/User.entity';
import { userUpdateInterface } from '../interfaces';

export default class UserClass {
    private user: IUserModel;

    constructor(userData: IUserModel) {
        this.user = userData;
    }

    async endFirstLogin(): Promise<void> {
        this.user.firstIn = false;
        await this.user.save();
    }

    async updateUserData(data: userUpdateInterface): Promise<void> {
        if (data.firstName) this.user.firstName = data.firstName;
        if (data.lastName) this.user.lastName = data.lastName;
        if (data.middleName) this.user.middleName = data.middleName;
        if (data.birthday) this.user.birthday = data.birthday;
        if (data.email) this.user.email = data.email;
        if (data.sex) this.user.sex = data.sex;
        await this.user.save();
    }

    get _id(): string {
        return this.user._id;
    }

    get data(): IUser {
        return {
            _id: this.user._id,
            createdAt: this.user.createdAt,
            phone: this.user.phone,
            score: this.user.score,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            middleName: this.user.middleName,
            email: this.user.email,
            birthday: this.user.birthday,
            firstIn: this.user.firstIn,
            sex: this.user.sex,
            updatedAt: this.user.updatedAt,
        };
    }
}