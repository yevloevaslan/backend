import { taskDataInterface } from './interfaces';
import {TaskFactory} from './classes';

const createTask = async (data: taskDataInterface): Promise<void> => {
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