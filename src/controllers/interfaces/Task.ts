import { taskDataInterface } from './index';
import { ITask, TaskParams } from '../../entities/Task';

export interface TaskClassInterface {
  checkTask(value: unknown): boolean;
  createTask(data: taskDataInterface<TaskParams>): void;
  updateTask(data: taskDataInterface<TaskParams>): void;
  data(): ITask<TaskParams>;
}
