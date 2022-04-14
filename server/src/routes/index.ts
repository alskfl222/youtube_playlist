import express from 'express'
import usersRouter from './users'
import listsRouter from './lists'
import playerRouter from './player'

const router = express.Router()

router.use('/users', usersRouter)
router.use('/lists', listsRouter)
router.use('/player', playerRouter)

router.get('/', (req, res) => {
  res.send('HELLO!')
})

export default router;