import { taskDataInterface } from './interfaces';
import { TaskFactory } from './classes';
import { TaskParams } from '../entities/Task';
import { schemaErrorHandler } from '../libs/joiSchemaValidation';
import Joi from 'joi';
import { ITask } from '../entities/Task';
import { TaskModel } from '../db/models/Task';
import { paginationParams } from '../libs/checkInputParameters';
import UserClass from './classes/UserClass';
import {CompletedTaskModel, TasksCountModel} from '../db/models';
import {conflict, notFound} from 'boom';
import { getUserTasksCount, userTasksCount } from './UserController';
import { ITasksCountEntity } from '../entities/TasksCount.entity';
import { Document } from 'mongoose';

export interface TaskResultData {
    _id: string,
    type: string,
    level: string,
    points: number,
    params: TaskParams,
    active: boolean,
}

export interface TaskResultMeta {
    count: number,
    tasksCount: any
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
        answer: string | string[],
    },
}

interface voidResult {
    data: null,
}

interface creatTask {
    data: {
        type: string,
        level: string,
        points: number,
        active: boolean,
    }
}

export interface updateTaskData {
    level?: string,
    points?: number,
    params?: TaskParams,
    active?: boolean,
    number?: number
}

interface getRandomTask {
    userId: string,
    level: string,
}

interface randomTask {
    data: {
        task: TaskResultData
        tasksCount: tasksCount
    }
}

interface tasksCount {
    userTasksCount?: userTasksCount
    totalTasksCount: ITasksCountEntity
}

const taskMainSchema = Joi.object({
    type: Joi.string().min(1).max(5).required(),
    level: Joi.string().min(0).max(2).required(),
    points: Joi.number().required(),
    active: Joi.boolean().required(),
}).unknown();

const taskUpdateInputSchema = Joi.object({
    level: Joi.string(),
    points: Joi.number(),
    params: Joi.object(),
    active: Joi.boolean(),
}).unknown();

const test = Joi.object({
    _id: Joi.string().required(),
    answer: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
});

const randomTaskSchema = Joi.object({
    userId: Joi.string().required(),
    level: Joi.string().required(),
});

const validateTaskNumber = async (taskData: any, id?: string) =>{
    if (taskData.number) {
        let type;
        if (taskData.type) {
            type = taskData.type;
        } else {
            type = (await TaskModel.findById(id).lean()).type;
        }
        const notUniqueNumberInType = await TaskModel.findOne({number: taskData.number, type}).lean();
        if (notUniqueNumberInType) {
            throw conflict(`Task with number ${taskData.number} already exist in type ${type}`);
        }
    } 
};
export const getNextTaskNumber = async (taskData: taskDataInterface<TaskParams>): Promise<number> =>{
    const maxNumberInType = await TaskModel.findOne({type: taskData.type}, {number: 1}).sort({number: -1});
    const nextNumber = maxNumberInType ? maxNumberInType.number + 1 : 1;
    return nextNumber;

};

const createTask = async (data: taskDataInterface<TaskParams>): Promise<creatTask> => {
    if (!['1', '2', '3'].includes(data.level)) throw conflict('This level do not exist');
    schemaErrorHandler(taskMainSchema.validate(data));
    if (data.number) {
        await validateTaskNumber(data);
    } else {
        data.number = await getNextTaskNumber(data);
    }
    await TaskFactory(data);
    await updateLevelCounter(data.level);
    return {
        data: {
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
        await user.upUserTaskResult(task.data().level);
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
    delete randomTask.params.answerArray;

    const tasksCount = await getTasksCount(data.userId);


    return {
        data: {
            task: randomTask,
            tasksCount,
        },
    };
};

const getTasksCount = async (userId?: string): Promise<tasksCount> =>{

    const totalTasksCount = (await getTotalTasksCount()).toObject();
    delete totalTasksCount._id;
    if (!userId) return {totalTasksCount};

    const userTasksCount = await getUserTasksCount(userId);
    return {
        userTasksCount, totalTasksCount,
    };
};


const getTask = async (_id: string): Promise<getTaskResult> => {
    const task = await TaskFactory(null, _id);
    const data = task.data();
    delete data.params.answer;
    delete data.params.answerArray;
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
        TaskModel.find(taskQuery).skip(skip).limit(limit).sort({number: -1}).lean(),
        TaskModel.countDocuments(taskQuery),
    ]);
    const {totalTasksCount: tasksCount} = await getTasksCount();
    return {
        data: {
            tasks,
        },
        meta: {
            count,
            tasksCount,
        },
    };
};

const deleteTask = async (_id: string): Promise<voidResult> => {
    const deleted = await TaskModel.findOneAndDelete({ _id });

    await updateLevelCounter(deleted ? deleted.level : null);
    return {
        data: null,
    };
};

const updateTask = async (id: string, data: updateTaskData): Promise<creatTask> => {
    schemaErrorHandler(taskUpdateInputSchema.validate(data));

    const task = await TaskFactory(null, id);
    if (task.data().number !== data.number) {
        await validateTaskNumber(data, id);
    }
    await task.updateTask(data);
    await updateLevelCounter(data.level);
    return {
        data: null,
    };
};

const getTotalTasksCount = async (): Promise<Document&ITasksCountEntity>=>{
    const tasksCount = await TasksCountModel.findOne({}, { __v: 0});
    return tasksCount;
};

export const updateLevelCounter = async (level?: string): Promise<void> => {
    
    try {
        const levelsCount = { };
        if (!level) {
            const levels = await TaskModel.find().distinct('level');
            for (const level of levels) {
                levelsCount[level] = await TaskModel.count({level, active: true});
            }
        } else {
            levelsCount[level] = await TaskModel.count({level, active: true});
        }

        const tasksCount = await getTotalTasksCount();
        if (!tasksCount) {
            await new TasksCountModel({byLevel: levelsCount}).save();
        } else {
            if (!level) {
                tasksCount.byLevel = levelsCount;
                await tasksCount.save();
            } else {
                const levelQuery = `byLevel.${level}`;
                await TasksCountModel.updateOne({}, {$set: {[levelQuery]: levelsCount[level]}});
            }
        }
        console.log(level, tasksCount);
    } catch (e) {
        console.log('update tasks count failed', e);
    }
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


