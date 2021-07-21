import {Router} from 'express';
import {findWord} from '../controllers/DictionaryController';
import {checkTokenMiddleware} from './middlewares/auth.middleware';

const router = Router();

router.get('/', checkTokenMiddleware('user'), async (req, res, next) => {
    try {
        const result = await findWord(req.query, { page: req.query.page, limit: req.query.limit });
        res.send(result);
    } catch (err) {
        next(err);
    }
});

export default router;