import express from 'express';
const router = express.Router();

import users from './users';
import admins from './admins';
import tasks from './tasks';
import dictionaries from './dictionaries';
import aboutProjects from './aboutProjects';


router.use('/users', users);
router.use('/admins', admins);
router.use('/tasks', tasks);
router.use('/dictionaries', dictionaries);
router.use('/about_projects', aboutProjects);
export default router;
