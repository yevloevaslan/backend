import { ITaskModel, TaskModel } from '../../db/models/Task';
import { TaskOne, TaskParams } from '../../entities/Task';
import { taskDataInterface } from '../interfaces';
import { TaskClassInterface } from '../interfaces/Task';

export default class TaskOneClass implements TaskClassInterface {
    private task: ITaskModel<TaskParams>;

    constructor(task?: ITaskModel<TaskParams>) {
        this.task = task;
    }

    async createTask(data: taskDataInterface): Promise<void> {
        const params: TaskOne = {
            photos: data.params.photos,
            text: data.params.text,
            answer: data.params.answer,
        };
        delete data.params;
        this.task = await new TaskModel({
            ...data,
            params,
        });
    }

    checkAnswer(value: unknown): boolean {
        if (value === this.task.params.answer) return true;
        return false;
    }
}