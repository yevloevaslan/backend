const {describe, it, expect} = require('@jest/globals');
import request from 'supertest';
import app from '../grapqhl';
const URI = '/api/admin';

describe('Tasks', () => {
    it('Creating task', async () => {
        await request(app)
            .post(URI)
            .send({query: `mutation{
                createTask(taskData: {
                    title: "Test title",
                    description: "Test description",
                    type: "1",
                    level: "1",
                    points: 1,
                    params: {
                        photos: ["one", "two", "free"],
                        text: "test task question",
                        answer: "one"
                    }
                    active: true,
                })
            }`})
            .expect(200)
            .then(({body: {data: {createTask}}}) => {
                expect(createTask).toEqual(true);
            });
    });
});