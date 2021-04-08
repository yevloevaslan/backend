import { taskDataInterface } from '.';
import { TaskParams } from '../../entities/Task';

export interface TaskClassInterface {
    checkAnswer(value: unknown): boolean;
    createTask(data: taskDataInterface<TaskParams>): void;
}