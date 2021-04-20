import express from 'express';
const router = express.Router();

import users from './users';
import admins from './admins';
import tasks from './tasks';
import dictionaries from './dictionaries';

router.use('/users', users);
router.use('/admins', admins);
router.use('/tasks', tasks);
router.use('/dictionaries', dictionaries);

export default router;
