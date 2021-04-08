import { taskDataInterface } from '.';

export interface TaskClassInterface {
    checkAnswer(value: unknown): boolean;
    createTask(data: taskDataInterface): void;
}