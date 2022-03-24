import express from 'express';

import { playerController } from '../controllers';

const router = express.Router();

router.post('/', playerController.id)
router.get('/:id', playerController.items);

export default router;
