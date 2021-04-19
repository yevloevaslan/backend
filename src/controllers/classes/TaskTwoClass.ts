import { TaskModel } from '../../db/models/Task';
import { ITask, TaskTwo, TaskParams } from '../../entities/Task';
import { taskDataInterface } from '../interfaces';
import { TaskClassInterface } from '../interfaces/Task';
import Joi from 'joi';
import { schemaErrorHandler } from '../../libs/joiSchemaValidation';
import { conflict } from 'boom';
import { Document } from 'mongoose';
import { updateTask } from './functions/updateTask';

export const taskParamsSchema = Joi.object({
    text: Joi.string().required(),
    answers: Joi.array().items(Joi.string()).required(),
    answer: Joi.string().required(),
}).unknown();

export default class TaskTwoClass implements TaskClassInterface {
    private task: ITask<TaskParams> & Document;

    constructor(task?: ITask<TaskParams> & Document) {
        this.task = task;
    }

    getAnswer(): string {
        return this.task.params.answer;
    }

    checkTask(value: unknown): boolean {
        if (value === this.task.params.answer) return true;
        return false;
    }

    async createTask(data: taskDataInterface<TaskTwo>): Promise<void> {
        if (this.task) {
            console.error('Conflict in creating task two', JSON.stringify({task: this.task, data}));
            throw conflict('Задание уже существует.');
        }
        schemaErrorHandler(taskParamsSchema.validate(data.params));
        if (!data.params.answers.includes(data.params.answer)) throw conflict('Среди вариантов ответа нет верного ответа');

        this.task = await new TaskModel(data).save();
    }

    async updateTask(data: taskDataInterface<TaskTwo>): Promise<void> {
        await updateTask(data);
    }

    data(): ITask<TaskTwo> {
        return {
            _id: this.task._id,
            title: this.task.title,
            type: this.task.type,
            description: this.task.description,
            points: this.task.points,
            level: this.task.level,
            params: this.task.params as unknown as TaskTwo,
            active: this.task.active,
        };
    }
}
