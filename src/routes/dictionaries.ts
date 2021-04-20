import {Router} from 'express';
import {findWord} from '../controllers/DictionaryController';
import {checkTokenMiddleware} from './middlewares/auth.middleware';

const router = Router();

router.post('/find', checkTokenMiddleware('user'), async (req, res, next) => {
    try {
        const result = await findWord(req.body);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

export default router;