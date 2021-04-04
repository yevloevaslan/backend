const {describe, it, afterEach, afterAll, expect} = require('@jest/globals');
import request from 'supertest';
import app from '../app';
import {deleteAll} from './setup';
import {ConfirmCodeModel} from '../db/models';
import {confirmLogin, login} from '../controllers/UserController';

describe('User routes tests', () => {
    afterAll(async () => {
        await deleteAll();
    });
    afterEach(async () => {
        await deleteAll();
    });

    it('success login', async () => {
        const phone = '+71234567890';
        await request(app)
            .post('/api/users/login')
            .send({phone})
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual({
                    data: {
                        _id: expect.any(String),
                        updatedAt: expect.any(String),
                    },
                });
            });
    });
    it('success confirm', async () => {
        const phone = '+71234567890';
        const loginData = await login({phone});
        const confirmCodeModel = await ConfirmCodeModel.find({phone});
        const code = confirmCodeModel[0].code;
        await request(app)
            .post('/api/users/confirm')
            .send({
                _id: loginData.data._id,
                code,
            })
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual({
                    data: {
                        token: expect.any(String),
                        user: {
                            _id: expect.any(String),
                            createdAt: expect.any(String),
                            phone: expect.any(String),
                            updatedAt: expect.any(String),
                        },
                    },
                });
            });
    });
    it('success get user info', async () => {
        const phone = '+71234567890';
        const loginData = await login({phone});
        const confirmCodeModel = await ConfirmCodeModel.find({phone});
        const code = confirmCodeModel[0].code;
        const confirmLoginData = await confirmLogin({_id: `${loginData.data._id}`, code});
        await request(app)
            .get('/api/users/info')
            .set({'x-access-token': confirmLoginData.data.token})
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual({
                    data: {
                        _id: expect.any(String),
                        createdAt: expect.any(String),
                        phone: expect.any(String),
                        updatedAt: expect.any(String),
                    },
                });
            });
    });
});