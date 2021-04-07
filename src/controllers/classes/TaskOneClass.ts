import { TaskModel } from '../../db/models/Task';
import { Task, TaskOne } from '../../entities/Task';
import { taskUpdateInterface } from '../interfaces/Task';

export default class TaskOneClass {
  private task: TaskModel;
  private params: TaskOne;
  constructor(data: TaskModel) {
    this.task = data;
    this.params = data.params;
  }

  get title(): string {
    return this.task.title;
  }

  get description(): string {
    return this.task.description;
  }

  get type(): string {
    return this.task.type;
  }

  get level(): string {
    return this.task.level;
  }

  get points(): string {
    return this.task.points;
  }

  get data(): Task {
    return {
      photos: this.params,
      answer: this.taskUpdateInterface.answer,
    };
  }
}