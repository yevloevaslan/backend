import {Router} from 'express';
const router = Router();
import UserController from '../controllers/UserController';

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

export default router;