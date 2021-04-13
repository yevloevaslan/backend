import { taskDataInterface } from './interfaces';
import { TaskFactory, User } from './classes';
import { TaskParams } from '../entities/Task';
import { schemaErrorHandler } from '../libs/joiSchemaValidation';
import Joi from 'joi';
import { ITask } from '../entities/Task';
import { TaskModel } from '../db/models/Task';
import { paginationParams } from '../libs/checkInputParameters';
import { IUser } from '../entities/User.entity';

interface getTasksResult {
    data: {
        tasks: Array<{
            _id: string,
            title: string,
            description: string,
            type: string,
            level: string,
            points: number,
        }>,
    },
    meta: {
        count: number,
    }
}

interface getTaskResult {
    data: {
        task: ITask<TaskParams>,
    },
}

interface checkTaskResult {
  data: {
      user: IUser['score'];
  },
}

interface voidResult {
    data: null,
}

interface createTask {
    data: {
        title: string,
        description: string,
        type: string,
        level: string,
        points: number,
    }
}

const taskMainSchema = Joi.object({
    _id: Joi.string(),
    title: Joi.string(),
    description: Joi.string(),
    type: Joi.string(),
    level: Joi.string(),
    points: Joi.number(),
});

const taskUpdateInputSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    type: Joi.string(),
    level: Joi.string(),
    points: Joi.number(),
    params: Joi.object(),
});

const createTask = async (data: taskDataInterface<TaskParams>): Promise<createTask> => {
    schemaErrorHandler(taskMainSchema.validate(data));

    await TaskFactory(data);

    return {
        data: {
            title: data.title,
            description: data.description,
            type: data.type,
            level: data.level,
            points: data.points,
        },
    };
};

const checkTaskAnswer = async (query: {_id: string, answerTrue}, _id: string, answer: string, data: taskDataInterface<TaskParams>): Promise<checkTaskResult> => {
    const { answerTrue } = query;
    const user = await User(query);
    const task = await TaskFactory(null, _id);
    task.checkTask(answer);
    const point = data.points;

    if ( answerTrue === answer) {
        return {
            data: {
                user: user.data.score + point,
            },
        };
    }
};

const getTask = async (_id: string): Promise<getTaskResult> => {
    const task = await TaskFactory(null, _id);
    return {
        data: {
            task: task.data(),
        },
    };
};

const getTasks = async (query: {type?: string}, options: {limit: number, page: number}): Promise<getTasksResult> => {
    const {skip, limit} = paginationParams(options.page, options.limit);
    const [tasks, count] = await Promise.all([
        TaskModel.find(query, {params: 0}).skip(skip).limit(limit),
        TaskModel.countDocuments(query),
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
    await TaskModel.deleteOne({_id});
    return {
        data: null,
    };
};

const updateTask = async (id: string, data: taskDataInterface<TaskParams>): Promise<createTask> => {
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
};
