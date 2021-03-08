import { unauthorized } from 'boom';
import { IConfirmCodeModel } from '../../db/models/ConfirmCodeModel';
import { IConfirmCode } from '../../entities';
import generateCode from '../../libs/generateCode';

// import moment from 'moment';

export default class ConfirmCodeClass {
    private confirmCode: IConfirmCodeModel;
    constructor(data: IConfirmCodeModel) {
        this.confirmCode = data;
    }

    // async setup(): Promise<void> {
    //     const query: {phone?: string, _id?: string} = {};
    //     if (this._id) query._id = this._id;
    //     if (this.phone) query.phone = this.phone;
    //     this.confirmCode = await ConfirmCodeModel.findOne(query);
    //     if (!this.confirmCode && this.phone) {
    //         this.confirmCode = new ConfirmCodeModel({phone: this.phone});
    //     }
    // }

    async generateCode(): Promise<void> {
        //check updatedAt confirmCode
        this.confirmCode.code = generateCode();
        await this.confirmCode.save();
    }

    async checkCode(inputCode: string): Promise<void> {
        if (!this.confirmCode || inputCode !== this.confirmCode.code) throw unauthorized('Auth error');
        await this.updateCode();
        return;
    }

    async updateCode(): Promise<void> {
        this.confirmCode.code = '';
        await this.confirmCode.save();
    }

    get getPhone(): string {
        return this.confirmCode.phone;
    }

    get data(): IConfirmCode {
        return {
            _id: this.confirmCode._id,
            code: this.confirmCode.code,
            phone: this.confirmCode.phone,
            updatedAt: this.confirmCode.updatedAt,
        };
    }
}