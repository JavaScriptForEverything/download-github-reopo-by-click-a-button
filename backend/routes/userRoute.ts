import { Router } from 'express'
import * as userController from '../controllers/userController'

export const userRouter = Router()

userRouter.get('/', userController.getUsers)
userRouter.post('/', userController.addUser)
