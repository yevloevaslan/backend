import {Router} from 'express';
const router = Router();
import {getTask, checkTaskAnswer, getTasks, giveRandomTaskToUser} from '../controllers/TaskControllers';
import { UserRequestInterface } from './interfaces/UserRequest.interface';
import { checkTokenMiddleware } from './middlewares/auth.middleware';

router.get('/', checkTokenMiddleware('user'), async (req, res, next) => {
    try {
        const result = await getTasks(req.query, req.query);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', checkTokenMiddleware('user'), async (req, res, next) => {
    try {
        const result = await getTask(req.params.id);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

router.post('/:id/answer', checkTokenMiddleware('user'), async (req: UserRequestInterface, res, next) => {
    try {
        const result = await checkTaskAnswer(req.user, req.params.id, req.body.answer);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

router.get('/random/:userId/:level', checkTokenMiddleware('user'), async (req, res, next) => {
    try {
        const result = await giveRandomTaskToUser({userId: req.params.userId, level: req.params.level});
        res.send(result);
    } catch (err) {
        next(err);
    }
});

export default router;
