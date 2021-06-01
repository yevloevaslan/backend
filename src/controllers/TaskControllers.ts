import { taskDataInterface } from './interfaces';
import { TaskFactory } from './classes';
import { TaskParams } from '../entities/Task';
import { schemaErrorHandler } from '../libs/joiSchemaValidation';
import Joi from 'joi';
import { ITask } from '../entities/Task';
import { TaskModel } from '../db/models/Task';
import { paginationParams } from '../libs/checkInputParameters';
import UserClass from './classes/UserClass';
import {CompletedTaskModel} from '../db/models';
import {conflict, notFound} from 'boom';

export interface TaskResultData {
    _id: string,
    title: string,
    description: string,
    type: string,
    level: string,
    points: number,
    params: TaskParams,
    active: boolean,
}

export interface TaskResultMeta {
    count: number,
}
export interface getTasksResult {
    data: {
        tasks: Array<TaskResultData>,
    },
    meta: TaskResultMeta
}

interface getTaskResult {
    data: {
        task: ITask<TaskParams>,
    },
}

interface checkTaskResult {
    data: {
        trueResult: boolean,
        answer: string,
    },
}

interface voidResult {
    data: null,
}

interface creatTask {
    data: {
        title: string,
        description: string,
        type: string,
        level: string,
        points: number,
        active: boolean,
    }
}

export interface updateTaskData {
    title?: string,
    description?: string,
    level?: string,
    points?: number,
    params?: TaskParams,
    active?: boolean,
}

interface getRandomTask {
    userId: string,
    level: string,
}

interface randomTask {
    data: {
        task: TaskResultData
    }
}

const taskMainSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    type: Joi.string().min(1).max(5).required(),
    level: Joi.string().min(0).max(2).required(),
    points: Joi.number().required(),
    active: Joi.boolean().required(),
}).unknown();

const taskUpdateInputSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    level: Joi.string(),
    points: Joi.number(),
    params: Joi.object(),
    active: Joi.boolean(),
});

const test = Joi.object({
    _id: Joi.string().required(),
    answer: Joi.string().required(),
});

const randomTaskSchema = Joi.object({
    userId: Joi.string().required(),
    level: Joi.string().required(),
});

const createTask = async (data: taskDataInterface<TaskParams>): Promise<creatTask> => {
    if (!['1', '2', '3'].includes(data.level)) throw conflict('This level do not exist');
    schemaErrorHandler(taskMainSchema.validate(data));
    await TaskFactory(data);
    return {
        data: {
            title: data.title,
            description: data.description,
            type: data.type,
            level: data.level,
            points: data.points,
            active: data.active,
        },
    };
};

const checkTaskAnswer = async (user: UserClass, _id: string, answer: string): Promise<checkTaskResult> => {
    schemaErrorHandler(test.validate({_id, answer}));

    const task = await TaskFactory(null, _id);
    let trueResult = false;

    if (task.checkTask(answer) === true) {
        await user.upUserScore(task.data().points);
        await new CompletedTaskModel({userId: user._id, taskId: _id, correct: true}).save();
        trueResult = true;
    }
    return {
        data: {
            trueResult,
            answer: task.getAnswer(),
        },
    };
};

const giveRandomTaskToUser = async (data: getRandomTask): Promise<randomTask> => {
    schemaErrorHandler(randomTaskSchema.validate({userId: String(data.userId), level: data.level}));
    const completedTasks = await CompletedTaskModel.aggregate([
        {$match: {userId: String(data.userId)}},
        {$group: {_id: null, task_ids: {$push: '$taskId'} }},
    ]);
    let tasks = [];
    if (completedTasks[0]) {
        tasks = completedTasks[0].task_ids;
    }

    const countTasks = await TaskModel.count({_id: {$nin: tasks}, level: data.level, active: true});
    const randomTask = await TaskModel.findOne({_id: {$nin: tasks}, level: data.level, active: true}).skip(Math.floor(countTasks * Math.random()));
    if (!randomTask) throw notFound('No tasks for user');
    delete randomTask.params.answer;
    return {
        data: {
            task: randomTask,
        },
    };
};

const getTask = async (_id: string): Promise<getTaskResult> => {
    const task = await TaskFactory(null, _id);
    const data = task.data();
    delete data.params.answer;
    return {
        data: {
            task: data,
        },
    };
};

const getTasks = async (query: { type?: string, _id?: string }, options: { limit?: unknown, page?: unknown }): Promise<getTasksResult> => {
    const { skip, limit } = paginationParams(options.page, options.limit);
    const taskQuery: {[key: string]: string} = {};
    if (query.type) taskQuery.type = query.type;
    if (query._id) taskQuery._id = query._id;
    const [tasks, count] = await Promise.all([
        TaskModel.find(taskQuery).skip(skip).limit(limit).lean(),
        TaskModel.countDocuments(taskQuery),
    ]);

    return {
        data: {
            tasks,
        },
        meta: {
            count,
        },
    };
};

const deleteTask = async (_id: string): Promise<voidResult> => {
    await TaskModel.deleteOne({ _id });
    return {
        data: null,
    };
};

const updateTask = async (id: string, data: updateTaskData): Promise<creatTask> => {
    schemaErrorHandler(taskUpdateInputSchema.validate(data));

    const task = await TaskFactory(null, id);
    await task.updateTask(data);

    return {
        data: null,
    };
};


export {
    createTask,
    checkTaskAnswer,
    getTask,
    getTasks,
    deleteTask,
    updateTask,
    giveRandomTaskToUser,
};
