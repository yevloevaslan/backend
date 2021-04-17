import { ITaskModel, TaskModel } from '../../db/models/Task';
import { ITask, TaskOne, TaskParams } from '../../entities/Task';
import { taskDataInterface } from '../interfaces';
import { TaskClassInterface } from '../interfaces/Task';
import Joi from 'joi';
import { schemaErrorHandler } from '../../libs/joiSchemaValidation';
import { conflict } from 'boom';

const taskParamsSchema = Joi.object({
    photos: Joi.array().items(Joi.string()).required().min(2),
    text: Joi.string().required(),
    answer: Joi.string().required(),
});

export default class TaskOneClass implements TaskClassInterface {
    private task: ITaskModel<TaskParams>;

    constructor(task?: ITaskModel<TaskParams>) {
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
        if (data.title) this.task.title = data.title;
        if (data.description) this.task.description = data.description;
        
        if (data.level) this.task.level = data.level;
        if (data.points) this.task.points = data.points;
        if (data.params) {
            schemaErrorHandler(taskParamsSchema.validate(data));
            this.task.params = data.params;
        }
        await this.task.save();
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
        };
    }
}

