import {Router} from 'express';
import { taskDataInterface } from '../controllers/interfaces';
const router = Router();
import { getTask, getTasks, createTask, checkTaskAnswer, updateTask, deleteTask } from '../controllers/TaskController';
import { TaskParams } from '../entities/Task';

router.get('/tasks', getTasks);

router.get('/tasks/:id', getTask);

export default router;