import { taskDataInterface } from './index';
import { ITask, TaskParams } from '../../entities/Task';
import {updateTaskData} from '../TaskControllers';

export interface TaskClassInterface {
  checkTask(value: unknown): boolean;
  createTask(data: taskDataInterface<TaskParams>): void;
  updateTask(data: updateTaskData): void;
  data(): ITask<TaskParams>;
  getAnswer(): string,
}
