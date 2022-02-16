import express from 'express';

import { usersController } from '../controllers';

const router = express.Router();

router.get('/auth', usersController.auth);
router.post('/login', usersController.login)

export default router;
