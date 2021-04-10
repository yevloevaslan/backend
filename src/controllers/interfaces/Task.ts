<<<<<<< HEAD
import { taskDataInterface } from './index';
import { TaskParams } from '../../entities/Task';

export interface TaskClassInterface {
  checkTask(value: unknown): boolean;
  createTask(data: taskDataInterface<TaskParams>): void;
  deleteTask(): Promise<void>;
  updateTask(data: taskDataInterface<TaskParams>): void;
}
=======
import { taskDataInterface } from '.';
import { TaskParams } from '../../entities/Task';

export interface TaskClassInterface {
    checkAnswer(value: unknown): boolean;
    createTask(data: taskDataInterface<TaskParams>): void;
}
>>>>>>> 5b390ab475507ed82dcd6120d87eca97613d808a
