import express from 'express';

import { listsController } from '../controllers';

const router = express.Router();

router.get('/', listsController.getAll);
router.get('/search', listsController.search)
router.get('/quota', listsController.quota)
router.post('/', listsController.add);

export default router;
