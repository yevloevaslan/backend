import { taskDataInterface } from './index';
import { TaskParams } from '../../entities/Task';

export interface TaskClassInterface {
  checkTask(value: unknown): boolean;
  createTask(data: taskDataInterface<TaskParams>): void;
  deleteTask(): Promise<void>;
  updateTask(data: taskDataInterface<TaskParams>): void;
}
