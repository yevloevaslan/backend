import { taskDataInterface } from './interfaces';
import { TaskFactory } from './classes';
import { TaskParams, taskClass } from '../entities/Task';
import { TaskModel } from '../db/models/Task';
import { schemaErrorHandler } from '../libs/joiSchemaValidation';
import Joi from 'joi';
import { ITask } from '../entities/Task';

interface getTasksResult {
  data: Array<ITask<TaskParams>>
}

interface voidResult {
  data: null,
}

const taskUpdateInputSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  type: Joi.string(),
  level: Joi.string(),
  points: Joi.string(),
  params: Joi.object(),
});

const createTask = async (data: taskDataInterface<TaskParams>): Promise<void> => {
  schemaErrorHandler(taskUpdateInputSchema.validate(data));
  await TaskFactory(data);
};

const checkTaskAnswer = async (_id: string, answer: string): Promise<void> => {
  const task = await TaskFactory(null, _id);
  task.checkTask(answer);
};

const getTask = async (_id: string,): Promise<taskClass> => {
  const task = await TaskFactory(null, _id);
  return task;
};

const getTasks = async (): Promise<getTasksResult> => {

  const tasks = await TaskModel.find({});
  return tasks;
};

const deleteTask = async (): Promise<voidResult> => {
  return {
    data: null,
  };
};

const updateTask = async (data: taskDataInterface<TaskParams>): Promise<?> => {
  schemaErrorHandler(taskUpdateInputSchema.validate(data));

  await taskClass.updateTask(data);
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
