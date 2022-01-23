import {Router} from 'express';
const router = Router();
import {login, confirmLogin, updateUserData, deleteUser} from '../controllers/UserController';
import { UserRequestInterface } from './interfaces/UserRequest.interface';
import {checkTokenMiddleware} from './middlewares/auth.middleware';

router.post('/login', async (req, res, next) => {
    try {
        const result = await login(req.body);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

router.post('/confirm', async (req, res, next) => {
    try {
        const result = await confirmLogin(req.body);
        res.cookie('x-access-token', result.data.token);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

router.put('/info', checkTokenMiddleware('user'), async (req: UserRequestInterface, res, next) => {
    try {
        const result = await updateUserData(req.user, req.body);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

router.get('/info', checkTokenMiddleware('user'), (req: UserRequestInterface, res) => {
    res.send({
        data: req.user.data,
    });
});

router.delete('/deleting', checkTokenMiddleware('user'), async (req: UserRequestInterface, res, next) => {
    try {
        const result = await deleteUser(req.user._id);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

export default router;