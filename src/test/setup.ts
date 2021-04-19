const {beforeAll, afterAll} = require('@jest/globals');
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {AdminModel, ConfirmCodeModel, UserModel, TaskModel} from '../db/models';

let mongoServer;
const opts = {useNewUrlParser: true, useUnifiedTopology: true};

export const deleteAll = async (): Promise<void> => {
    await UserModel.deleteMany();
    await AdminModel.deleteMany();
    await ConfirmCodeModel.deleteMany();
    await TaskModel.deleteMany();
};

beforeAll(async () => {
    await mongoose.disconnect();
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await new Promise((resolve, reject) => {
        mongoose.connect(mongoUri, opts, async (err) => {
            if (err) reject(err);
            await deleteAll();
            resolve(console.log('test db has been started'));
        });
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});