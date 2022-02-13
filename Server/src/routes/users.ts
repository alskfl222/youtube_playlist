import express from 'express';

import { usersController } from '../controllers';

const router = express.Router();

router.post('/login', usersController.login);

router.get('/verify', usersController.verify)

export default router;
