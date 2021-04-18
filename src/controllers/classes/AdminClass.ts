import { Document } from 'mongoose';
import { IAdmin } from '../../entities';

export default class AdminClass {
    private admin: Document&IAdmin;
    
    constructor(data: Document&IAdmin) {
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