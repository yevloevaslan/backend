import {taskDataInterface} from '../../interfaces';

const setValuesToUpdate = function (context: any, data: taskDataInterface<any>): void {
    if (data.level) context.task.level = data.level;
    if (data.points) context.task.points = data.points;
    if (typeof data.active === 'boolean') context.task.active = data.active;
    return;
};

const baseCheckAnswer = (answer: unknown, value: unknown): boolean => String(value).toLowerCase() === String(answer).toLowerCase();

export {
    setValuesToUpdate,
    baseCheckAnswer,
};
