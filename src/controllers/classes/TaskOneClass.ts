import { ITaskModel, TaskModel } from '../../db/models/Task';
import { ITask, TaskOne, TaskParams } from '../../entities/Task';
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

    get data(): ITask<TaskOne> {
        return {
            _id: this.task._id,
            title: this.task.title,
            type: this.task.type,
            description: this.task.description,
            points: this.task.points,
            level: this.task.level,
            params: this.task.params as TaskOne,
        };
    }
}