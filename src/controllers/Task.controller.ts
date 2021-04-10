import { taskDataInterface } from './interfaces';
import {TaskFactory} from './classes';
import { TaskParams } from '../entities/Task';

const createTask = async (data: taskDataInterface<TaskParams>): Promise<void> => {
    await TaskFactory(data);
};

const checkTaskAnswer = async (_id: string, answer: string): Promise<void> => {
    const task = await TaskFactory(null, _id);
    task.checkAnswer(answer);
};

export {
    createTask,
    checkTaskAnswer,
};