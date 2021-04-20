import { TaskModel } from '../../db/models/Task';
import { ITask, TaskFour, TaskParams } from '../../entities/Task';
import { taskDataInterface } from '../interfaces';
import { TaskClassInterface } from '../interfaces/Task';
import Joi from 'joi';
import { schemaErrorHandler } from '../../libs/joiSchemaValidation';
import { conflict } from 'boom';
import { Document } from 'mongoose';
import { updateTask } from './functions/updateTask';

const taskParamsSchema = Joi.object({
    sound: Joi.string().required(),
    answer: Joi.string().required(),
}).unknown();

export default class TaskFourClass implements TaskClassInterface {
    private task: ITask<TaskParams>&Document;

    constructor(task?: ITask<TaskParams>&Document) {
        this.task = task;
    }

    getAnswer(): string {
        return this.task.params.answer;
    }

    checkTask(value: unknown): boolean {
        if (value === this.task.params.answer) return true;
        return false;
    }

    async createTask(data: taskDataInterface<TaskFour>): Promise<void> {
        if (this.task) {
            console.error('Conflict in creating task one', JSON.stringify({task: this.task, data}));
            throw conflict('Задание уже существует.');
        }
        schemaErrorHandler(taskParamsSchema.validate(data.params));
        this.task = await new TaskModel(data).save();
    }

    async updateTask(data: taskDataInterface<TaskFour>): Promise<void> {
        await updateTask(data);
        if (data.params) {
            schemaErrorHandler(taskParamsSchema.validate(data));
            this.task.params = data.params;
        }
        await this.task.save();
        return;
    }

    data(): ITask<TaskFour> {
        return {
            _id: this.task._id,
            title: this.task.title,
            type: this.task.type,
            description: this.task.description,
            points: this.task.points,
            level: this.task.level,
            params: this.task.params as TaskFour,
            active: this.task.active,
        };
    }
}
