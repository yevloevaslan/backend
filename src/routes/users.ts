import {Router} from 'express';
const router = Router();
import UserController from '../controllers/UserController';
import { UserRequestInterface } from './interfaces/UserRequest.interface';
import {checkTokenMiddleware} from './middlewares/auth.middleware';

router.post('/login', async (req, res, next) => {
    try {
        const result = await UserController.login(req.body);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

router.post('/confirm', async (req, res, next) => {
    try {
        const result = await UserController.confirmLogin(req.body);
        res.cookie('x-access-token', result.data.token);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

router.get('/info', checkTokenMiddleware, (req: UserRequestInterface, res) => {
    console.log(req.user);
    res.send({
        data: req.user.data,
    });
});

export default router;