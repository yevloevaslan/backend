import { TaskModel } from '../../db/models/Task';
import { ITask, TaskThree, TaskParams } from '../../entities/Task';
import { taskDataInterface } from '../interfaces';
import { TaskClassInterface } from '../interfaces/Task';
import Joi from 'joi';
import { schemaErrorHandler } from '../../libs/joiSchemaValidation';
import { badData, conflict } from 'boom';
import { Document } from 'mongoose';
import { setValuesToUpdate } from './functions/setValuesToUpdate';

const taskParamsSchema = Joi.object({
    sound: Joi.string().required(),
    answers: Joi.array().items(Joi.string()).required().min(2),
    answerArray: Joi.array().items(Joi.string()).required().min(1),
}).unknown();

export default class TaskThreeClass implements TaskClassInterface {
    private task: ITask<TaskParams>&Document;

    constructor(task?: ITask<TaskParams>&Document) {
        this.task = task ;
    }

    getAnswer(): string[] {
        return this.task.params.answerArray;
    }

    checkTask(value: string[]): boolean {
        if (value.length !== this.task.params.answerArray.length) return false;
        for (let i = 0; i < value.length; i++) {
            if (value[i] !== this.task.params.answerArray[i]) return false;
        }
        return true;
    }

    static validateCorrectAnswer(answers: string[], variants: string[]): void {
        for (const ans of answers) {
            if (!variants.includes(ans)) throw badData('answer not in answers array');
        }
    }

    async createTask(data: taskDataInterface<TaskThree>): Promise<void> {
        if (this.task) {
            console.error('Conflict in creating task three', JSON.stringify({task: this.task, data}));
            throw conflict('Задание уже существует.');
        }
        schemaErrorHandler(taskParamsSchema.validate(data.params));

        TaskThreeClass.validateCorrectAnswer(data.params.answerArray, data.params.answers);

        this.task = await new TaskModel(data).save();
    }

    async updateTask(data: taskDataInterface<TaskThree>): Promise<void> {
        setValuesToUpdate(this, data);
        if (data.params) {
            schemaErrorHandler(taskParamsSchema.validate(data.params));

            TaskThreeClass.validateCorrectAnswer(data.params.answerArray, data.params.answers);
            this.task.params = data.params;
        }
        await this.task.save();
        return;
    }

    data(): ITask<TaskThree> {
        return {
            _id: this.task._id,
            type: this.task.type,
            points: this.task.points,
            level: this.task.level,
            params: this.task.params as TaskThree,
            active: this.task.active,
        };
    }
}
