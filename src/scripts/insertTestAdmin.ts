import { hashSync } from 'bcrypt';
import db from '../db';
db();

import {AdminModel} from '../db/models';

(async () => {
    try {
        const login = 'admin';
        const password = 'password';
        const hash = hashSync(password, 10);
        const adminExists = await AdminModel.findOne({login});
        if (adminExists) return console.log('Success create test admin (exists)');
        await new AdminModel({
            login,
            password: hash,
        }).save();
        console.log('Success create test admin');
    } catch (err) {
        console.error(err);
    }
})();