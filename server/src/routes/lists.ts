import express from 'express';

import { listsController } from '../controllers';

const router = express.Router();

router.get('/', listsController.getAll);

export default router;
