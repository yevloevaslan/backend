const {describe, it, afterEach, afterAll, expect} = require('@jest/globals');
import request from 'supertest';
import app from '../app';
import {deleteAll} from './setup';
import {ConfirmCodeModel, UserModel} from '../db/models';
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
                            firstIn: true,
                            score: 0,
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
                        firstIn: false,
                        score: 0,
                        updatedAt: expect.any(String),
                    },
                });
            });
    });
    it('success put user info', async () => {
        const phone = '+71234567890';
        const loginData = await login({phone});
        const confirmCodeModel = await ConfirmCodeModel.find({phone});
        const code = confirmCodeModel[0].code;
        const confirmLoginData = await confirmLogin({_id: `${loginData.data._id}`, code});
        await request(app)
            .put('/api/users/info')
            .set({'x-access-token': confirmLoginData.data.token})
            .send({
                firstName: 'TestName',
                lastName: 'TestLastName',
                middleName: 'TestMiddleName',
                birthday: '2001-01-01',
                email: 'email@mail.ru',
            })
            .expect(200);
        const user = await UserModel.find({email: 'email@mail.ru'});
        expect(user[0]).toBe({
            _id: expect.any(String),
            firstName: 'TestName',
            lastName: 'TestLastName',
            middleName: 'TestMiddleName',
            birthday: '2001-01-01T00:00:00.000Z',
            email: 'email@mail.ru',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            firstIn: false,
            phone: '+71234567890',
            score: 0,
            __v: 0,

        });
    });
});