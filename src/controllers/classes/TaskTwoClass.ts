import { ITaskModel, TaskModel } from '../../db/models/Task';
import { ITask, TaskTwo, TaskParams } from '../../entities/Task';
import { taskDataInterface } from '../interfaces';
import { TaskClassInterface } from '../interfaces/Task';
import Joi from 'joi';
import { schemaErrorHandler } from '../../libs/joiSchemaValidation';

const taskParamsShema = Joi.object({
    text: Joi.string(),
    answers: [Joi.string()],
    answer: Joi.string(),
});

export default class TaskOneClass implements TaskClassInterface {
    private task: ITaskModel<TaskParams>;

    constructor(task?: ITaskModel<TaskParams>) {
        this.task = task;
    }

    checkTask(value: unknown): boolean {
        if (value === this.task.params.answer) return true;
        return false;
    }

    async createTask(data: taskDataInterface<TaskTwo>): Promise<void> {
        schemaErrorHandler(taskParamsShema.validate(data));
        this.task = await new TaskModel(data);
    }

    async updateTask(data: taskDataInterface<TaskTwo>): Promise<void> {
        if (data.title) this.task.title = data.title;
        if (data.description) this.task.description = data.description;
        if (data.type) this.task.type = data.type;
        if (data.level) this.task.level = data.level;
        if (data.points) this.task.points = data.points;
        if (data.params) {
            schemaErrorHandler(taskParamsShema.validate(data));
            this.task.params = data.params;
        }
    }

    get data(): ITask<TaskTwo> {
        return {
            _id: this.task._id,
            title: this.task.title,
            type: this.task.type,
            description: this.task.description,
            points: this.task.points,
            level: this.task.level,
            params: this.task.params as TaskTwo,
        };
    }
}
