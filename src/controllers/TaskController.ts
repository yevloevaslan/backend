import { taskDataInterface } from './interfaces';
import { TaskFactory } from './classes';
import { TaskParams } from '../entities/Task';
import { TaskModel } from '../db/models/Task';
import { schemaErrorHandler } from '../libs/joiSchemaValidation';
import Joi from 'joi';
import { ITask } from '../entities/Task';

interface getTasksResult {
  [
    title: string,
    description: string,
    type: string,
    level: string,
    points: string,
    params: object,
  ]
}

interface getTask {
  ITask<TaskParams>
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
    points: string,
    params: object,
  }
}

const taskMainShema = Joi.object({
  _id: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
  type: Joi.string(),
  level: Joi.string(),
  points: Joi.string(),
});

const taskUpdateInputSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  type: Joi.string(),
  level: Joi.string(),
  points: Joi.string(),
  params: Joi.object(),
});

const createTask = async (data: taskDataInterface<TaskParams>): Promise<createTask> => {
  schemaErrorHandler(taskMainShema.validate(data));

  await TaskFactory(data);
  return {
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      level: data.level,
      points: data.points,
      params: data.params,
    },
  };
};

const checkTaskAnswer = async (_id: string, answer: string): Promise<void> => {
  const task = await TaskFactory(null, _id);
  task.checkTask(answer);
};

const getTask = async (_id: string): Promise<taskClass> => {
  const task = await TaskFactory(null, _id);
  return task;
};

const getTasks = async (): Promise<getTasksResult> => {

  const tasks = await TaskModel.find({});
  return tasks;
};

const deleteTask = async (_id: string): Promise<voidResult> => {
  return {
    data: null,
  };
};

const updateTask = async (data: taskDataInterface<TaskParams>): Promise<createTask> => {
  schemaErrorHandler(taskUpdateInputSchema.validate(data));

  await TaskFactory(data);

  return {
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      level: data.level,
      points: data.points,
      params: data.params,
    },
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
