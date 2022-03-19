import express from 'express';

import { playerController } from '../controllers';

const router = express.Router();

router.post('/', playerController.getPlayerItems);

export default router;
