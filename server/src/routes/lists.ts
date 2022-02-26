import express from 'express';

import { listsController } from '../controllers';

const router = express.Router();

router.get('/', listsController.getAll);
router.post('/', listsController.add);

export default router;
