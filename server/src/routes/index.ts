import express from 'express'
import usersRouter from './users'
import listsRouter from './lists'

const router = express.Router()

router.use('/users', usersRouter)
router.use('/lists', listsRouter)

export default router;