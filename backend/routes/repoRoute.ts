import { Router } from 'express'
import * as repoController from '../controllers/repoController'

export const repoRouter = Router()

repoRouter.post('/', repoController.getRepos)
repoRouter.post('/:name', repoController.downloadRepoByName)
