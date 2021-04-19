import { TaskModel } from '../../db/models/Task';
import { ITask, TaskOne, TaskParams } from '../../entities/Task';
import { taskDataInterface } from '../interfaces';
import { TaskClassInterface } from '../interfaces/Task';
import Joi from 'joi';
import { schemaErrorHandler } from '../../libs/joiSchemaValidation';
import { conflict } from 'boom';
import { Document } from 'mongoose';
import { updateTask } from './functions/updateTask';

const taskParamsSchema = Joi.object({
    photos: Joi.array().items(Joi.string()).required().min(2),
    text: Joi.string().required(),
    answer: Joi.string().required(),
});

export default class TaskOneClass implements TaskClassInterface {
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

    async createTask(data: taskDataInterface<TaskOne>): Promise<void> {
        if (this.task) {
            console.error('Conflict in creating task one', JSON.stringify({task: this.task, data}));
            throw conflict('Задание уже существует.');
        }
        schemaErrorHandler(taskParamsSchema.validate(data.params));
        this.task = await new TaskModel(data).save();
    }

    async updateTask(data: taskDataInterface<TaskOne>): Promise<void> {
        await updateTask(data);
    }


    data(): ITask<TaskOne> {
        return {
            _id: this.task._id,
            title: this.task.title,
            type: this.task.type,
            description: this.task.description,
            points: this.task.points,
            level: this.task.level,
            params: this.task.params as unknown as TaskOne,
            active: this.task.active,
        };
    }
}

