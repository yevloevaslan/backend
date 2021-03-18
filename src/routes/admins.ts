import {Router} from 'express';
import {login} from '../controllers/AdminController';
const router = Router();

router.post('/login', async (req, res, next) => {
    try {
        const result = await login(req.body);
        res.cookie('x-access-token', result.data.token);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

export default router;