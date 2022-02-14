import express from 'express';

import { usersController } from '../controllers';

const router = express.Router();

router.get('/login', usersController.login);
router.get('/login/callback', usersController.callback)

export default router;
