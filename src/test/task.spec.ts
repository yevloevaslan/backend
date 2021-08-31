import {createTask, giveRandomTaskToUser} from '../controllers/TaskControllers';

const {describe, it, expect} = require('@jest/globals');
import request from 'supertest';
import app from '../grapqhl';
import App from '../app';
import {confirmLogin, login} from '../controllers/UserController';
import {ConfirmCodeModel, TaskModel} from '../db/models';
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
    it('Create task with wrong level', async() => {
        await request(app)
            .post(URI)
            .send({query: `mutation{
                createTask(taskData: {
                    title: "Test title",
                    description: "Test description",
                    type: "1",
                    level: "4",
                    points: 1,
                    params: {
                        photos: ["one", "two", "free"],
                        text: "test task question",
                        answer: "one"
                    }
                    active: true,
                })
            }`})
            .expect(200);
        const TaskLevel4 = await TaskModel.findOne({level: '4'});
        expect(TaskLevel4).toBe(null);
    });

    it('give random task to user', async () => {
        for (let i = 1; i < 3; i++) {
            await createTask({
                type: '1',
                level: '1',
                points: 1,
                params: {
                    photos: ['photo1', 'photo2'],
                    text: 'test text',
                    answer: 'one',
                },
                active: true,
            });
            await createTask({
                type: '2',
                level: '1',
                points: 1,
                params: {
                    text: 'test text',
                    answers: ['one', 'answer2'],
                    answer: 'one',
                },
                active: true,
            });
            await createTask({
                type: '3',
                level: '1',
                points: 1,
                params: {
                    sound: 'sound',
                    answers: ['one', 'answer2'],
                    answer: 'one',
                },
                active: true,
            });
            await createTask({
                type: '4',
                level: '1',
                points: 1,
                params: {
                    sound: 'sound',
                    answer: 'one',
                },
                active: true,
            });
            await createTask({
                type: '5',
                level: '1',
                points: 1,
                params: {
                    text: 'test text',
                    answers: ['one', 'answer2'],
                    answer: 'one',
                },
                active: true,
            });
        }
        const phone = '+71234567890';
        const loginData = await login({phone});
        const confirmCodeModel = await ConfirmCodeModel.find({phone});
        const code = confirmCodeModel[0].code;
        const confirmLoginData = await confirmLogin({_id: `${loginData.data._id}`, code});
        const taskIds = new Set();
        for (let i = 0; i < 10; i++) {
            const randomTask = await giveRandomTaskToUser({userId: `${confirmLoginData.data.user._id}`, level: '1'});
            taskIds.add(randomTask.data.task._id);
            await request(App)
                .post(`/api/tasks/${randomTask.data.task._id}/answer`)
                .set({
                    'x-access-token': confirmLoginData.data.token,
                })
                .send({
                    answer: 'one',
                })
                .expect(200);
        }
        expect(taskIds.size).toEqual(10);
        // get tasks by level
        await request(App)
            .get('/api/tasks/random/?level=1')
            .set({
                'x-access-token': confirmLoginData.data.token,
            })
            .send({})
            .expect(200)
            .then((res) => {
                expect(res.body.data.task.level).toEqual('1');
            });
        // wrong level task by user
        await request(App)
            .get('/api/tasks/random/?level=8')
            .set({
                'x-access-token': confirmLoginData.data.token,
            })
            .send({})
            .expect(404);
        // get by specific level
        await createTask({
            type: '5',
            level: '3',
            points: 1,
            params: {
                text: 'test text',
                answers: ['one', 'answer2'],
                answer: 'one',
            },
            active: true,
        });
        const TaskLevel3 = await TaskModel.findOne({level: '3'});
        await request(App)
            .get('/api/tasks/random/?level=3')
            .set({
                'x-access-token': confirmLoginData.data.token,
            })
            .send({})
            .expect(200)
            .then((res) => {
                expect(res.body.data.task.level).toEqual('3');
                expect(res.body.data.task._id).toEqual(String(TaskLevel3._id));
            });
        await request(App)
            .get('/api/tasks/random/?level=3')
            .set({
                'x-access-token': confirmLoginData.data.token,
            })
            .send({})
            .expect(200)
            .then((res) => {
                expect(res.body.data.task.level).toEqual('3');
                expect(res.body.data.task._id).toEqual(String(TaskLevel3._id));
            });
    });
});
