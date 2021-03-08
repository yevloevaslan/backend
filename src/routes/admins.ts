import {Router} from 'express';
import AdminController from '../controllers/AdminController';
const router = Router();

router.post('/login', async (req, res, next) => {
    try {
        const result = await AdminController.login(req.body);
        res.cookie('x-access-token', result.data.token);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

export default router;