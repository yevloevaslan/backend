import express from 'express';
const router = express.Router();

import users from './users';
import admins from './admins';

router.use('/users', users);
router.use('/admins', admins);

export default router;
