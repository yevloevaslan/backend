import {Router} from 'express';
//import { taskDataInterface } from '../controllers/interfaces';
const router = Router();
import { getTask, /*getTasks,*/ checkTaskAnswer } from '../controllers/TaskControllers';
import { TaskRequestInterface } from './interfaces/TaskRequestInterface';
import { UserRequestInterface } from './interfaces/UserRequest.interface';
import { checkTokenMiddleware } from './middlewares/auth.middleware';
//import { TaskParams } from '../entities/Task';

router.get('/tasks', async (req: TaskRequestInterface /*res, next*/) => {
    delete req.task.data().params.answer;
    try {
        // const result = await getTasks([req.task.data()], null);
        // res.send(result);
    } catch (err) {
        //next(err);
    }
});

router.get('/tasks/:id', async (req: TaskRequestInterface, res, next) => {
    delete req.task.data().params.answer;
    try {
        const result = await getTask(req.task.data()._id);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

router.get('/tasks/:id/check', checkTokenMiddleware('user'), async (req: UserRequestInterface & TaskRequestInterface, res, next) => {
    try {
        const result = await checkTaskAnswer(req.user, req.task.data()._id, req.task.data().params.answer);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

export default router;