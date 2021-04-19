import { TaskModel } from '../../db/models/Task';
import { ITask, TaskFive, TaskParams } from '../../entities/Task';
import { taskDataInterface } from '../interfaces';
import { TaskClassInterface } from '../interfaces/Task';
import Joi from 'joi';
import { schemaErrorHandler } from '../../libs/joiSchemaValidation';
import { conflict } from 'boom';
import { Document } from 'mongoose';

const taskParamsSchema = Joi.object({
    text: Joi.string().required(),
    answers: Joi.array().items(Joi.string()).required().min(2),
    answer: Joi.string().required(),
}).unknown();

export default class TaskFiveClass implements TaskClassInterface {
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

    async createTask(data: taskDataInterface<TaskFive>): Promise<void> {
        if (this.task) {
            console.error('Conflict in creating task five', JSON.stringify({task: this.task, data}));
            throw conflict('Задание уже существует.');
        }
        schemaErrorHandler(taskParamsSchema.validate(data.params));
        this.task = await new TaskModel(data).save();
    }

    async updateTask(data: taskDataInterface<TaskFive>): Promise<void> {
        if (data.title) this.task.title = data.title;
        if (data.description) this.task.description = data.description;
        
        if (data.level) this.task.level = data.level;
        if (data.points) this.task.points = data.points;
        if (data.params) {
            schemaErrorHandler(taskParamsSchema.validate(data.params));
            this.task.params = data.params;
        }
        await this.task.save();
    }

    data(): ITask<TaskFive> {
        return {
            _id: this.task._id,
            title: this.task.title,
            type: this.task.type,
            description: this.task.description,
            points: this.task.points,
            level: this.task.level,
            params: this.task.params as TaskFive,
        };
    }
}
