import { TaskModel } from '../../db/models/Task';
import { ITask, TaskFive, TaskParams } from '../../entities/Task';
import { taskDataInterface } from '../interfaces';
import { TaskClassInterface } from '../interfaces/Task';
import Joi from 'joi';
import { schemaErrorHandler } from '../../libs/joiSchemaValidation';
import { conflict } from 'boom';
import { Document } from 'mongoose';
import { baseCheckAnswer, setValuesToUpdate } from './functions/setValuesToUpdate';

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
        if (baseCheckAnswer(this.task.params.answer, value)) return true;
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
        setValuesToUpdate(this, data);
        if (data.params) {
            schemaErrorHandler(taskParamsSchema.validate(data.params));
            this.task.params = data.params;
        }
        await this.task.save();
        return;
    }

    data(): ITask<TaskFive> {
        return {
            _id: this.task._id,
            type: this.task.type,
            points: this.task.points,
            level: this.task.level,
            params: this.task.params as TaskFive,
            active: this.task.active,
        };
    }
}
