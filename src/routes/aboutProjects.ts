import {Router} from 'express';
import {getInformationAboutProject} from '../controllers/AboutProject.Controller';
import { checkTokenMiddleware } from './middlewares/auth.middleware';

const router = Router();

router.get('/', checkTokenMiddleware('user'), async (_req, res, next) => {
    try {
        const result = await getInformationAboutProject();
        res.send(result);
    } catch (err) {
        next(err);
    }
});

export default router;