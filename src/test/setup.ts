const {beforeAll, afterAll} = require('@jest/globals');
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {AdminModel, ConfirmCodeModel, UserModel} from '../db/models';

let mongoServer;
const opts = {useNewUrlParser: true};

export const deleteAll = async () => {
    await UserModel.deleteMany();
    await AdminModel.deleteMany();
    await ConfirmCodeModel.deleteMany();
};

beforeAll(async () => {
    await mongoose.disconnect();
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, opts, async (err) => {
        if (err) throw err;
        await deleteAll();
        console.log('test db has been started');
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});