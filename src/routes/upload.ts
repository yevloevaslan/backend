import { badRequest } from 'boom';
import { Router } from 'express';
import { createFile } from '../controllers/FileController';
import { upload } from '../libs/upload';
import { checkTokenMiddleware } from './middlewares/auth.middleware';
const router = Router();

router.post('/', checkTokenMiddleware('admin'),
    async (req, res, next) => {
        try {
            upload().single('file')(req, res, next);
        } catch (err) {
            next(err);
        }
    }, async (req, res, next) => {
        try {
            if (!req.file) {
                throw badRequest('File is missing');
            }
            console.log(req.file);
            const {location: path, key} = req.file as unknown as Record<'location'|'key', string>;
            res.send({
                data: {
                    path,
                },
            });
            createFile({path, key});
        } catch (err) {
            next(err);
        }
    });

export default router;