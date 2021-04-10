import express from 'express';
const router = express.Router();

import users from './users';
import admins from './admins';
import tasks from './tasks';

router.use('/users', users);
router.use('/admins', admins);
router.use('/tasks', tasks);

export default router;
