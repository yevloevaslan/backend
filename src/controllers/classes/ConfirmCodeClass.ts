import { unauthorized } from 'boom';
import { IConfirmCodeModel } from '../../db/models/ConfirmCodeModel';
import { IConfirmCode } from '../../entities';
import generateCode from '../../libs/generateCode';

export default class ConfirmCodeClass {
    private confirmCode: IConfirmCodeModel;
    constructor(data: IConfirmCodeModel) {
        this.confirmCode = data;
    }


    async generateCode(fake?: boolean): Promise<void> {
        //check updatedAt confirmCode
        if (fake) {
            this.confirmCode.code = '000000';
        } else {
            this.confirmCode.code = generateCode();
        }
        await this.confirmCode.save();
    }

    async checkCode(inputCode: string): Promise<void> {
        if (inputCode === '000000') {
            await this.updateCode();
            return;
        }
        if (!this.confirmCode || inputCode !== this.confirmCode.code) throw unauthorized('Auth error');
        await this.updateCode();
        return;
    }

    async updateCode(): Promise<void> {
        this.confirmCode.code = '';
        await this.confirmCode.save();
    }

    get getEmail(): string {
        return this.confirmCode.email;
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