import { ITaskModel, TaskModel } from '../../db/models/Task';
import { ITask, TaskFour, TaskParams } from '../../entities/Task';
import { taskDataInterface } from '../interfaces';
import { TaskClassInterface } from '../interfaces/Task';
import Joi from 'joi';
import { schemaErrorHandler } from '../../libs/joiSchemaValidation';

const taskMainShema = Joi.object({
  _id: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
  type: Joi.string(),
  level: Joi.string(),
  points: Joi.string(),
});

const taskParamsShema = Joi.object({
  sound: Joi.string(),
  answer: Joi.string(),
});

export default class TaskOneClass implements TaskClassInterface {
  private task: ITaskModel<TaskParams>;

  constructor(task?: ITaskModel<TaskParams>) {
    this.task = task;
  }

  checkTask(value: unknown): boolean {
    if (value === this.task.params.answer) return true;
    return false;
  }

  async createTask(data: taskDataInterface<TaskFour>): Promise<void> {
    schemaErrorHandler(taskMainShema.validate(data));
    schemaErrorHandler(taskParamsShema.validate(data));
    this.task = await new TaskModel(data);
  }

  async updateTask(data: taskDataInterface<TaskFour>): Promise<void> {
    if (data.title) this.task.title = data.title;
    if (data.description) this.task.description = data.description;
    if (data.type) this.task.type = data.type;
    if (data.level) this.task.level = data.level;
    if (data.points) this.task.points = data.points;
    if (data.params) {
      schemaErrorHandler(taskParamsShema.validate(data));
      this.task.params = data.params
    }
  }

  async deleteTask() {
    console.log('');
  }

  get data(): ITask<TaskFour> {
    return {
      _id: this.task._id,
      title: this.task.title,
      type: this.task.type,
      description: this.task.description,
      points: this.task.points,
      level: this.task.level,
      params: this.task.params as TaskFour,
    };
  }
}
