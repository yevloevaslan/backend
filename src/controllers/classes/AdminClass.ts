import { IAdminModel } from '../../db/models/AdminModel';
import { IAdmin } from '../../entities';

export default class AdminClass {
    private admin: IAdminModel;
    constructor(data: IAdminModel) {
        this.admin = data;
    }

    get _id(): string {
        return this.admin._id;
    }

    get password(): string {
        return this.admin.password;
    }

    get data(): IAdmin {
        return {
            _id: this.admin._id,
            login: this.admin.login,
            createdAt: this.admin.createdAt,
            updatedAt: this.admin.updatedAt,
        };
    }
}