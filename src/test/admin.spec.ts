const {describe, it, afterAll, expect} = require('@jest/globals');
import request from 'supertest';
import app from '../app';
import {deleteAll} from './setup';
import {AdminModel} from '../db/models';

afterAll(async () => {
    await deleteAll();
});


describe('Admin routes tests', () => {
    it('success login', async () => {
        const admin = await new AdminModel({
            login: 'admin',
            password: '$2a$10$Pf7yK8V46gw7Fg/V/7auLevmDvLZkwlU.ZdtPL3i8K8ivPjIHUwEa',
        }).save();
        await request(app)
            .post('/api/admins/login')
            .send({
                login: 'admin',
                password: 'password',
            })
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual({
                    data: {
                        token: expect.any(String),
                        admin: {
                            _id: expect.any(String),
                            login: expect.any(String),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        },
                    },
                });
            });

    });
});