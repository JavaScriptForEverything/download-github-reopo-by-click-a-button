import type { Request, RequestHandler, Response } from 'express'
import { appError } from './errorController'


export const getUsers = (req: Request, res: Response ) => {
	res.status(200).json({
		status: 'success',
		data: {
			users: []
		}
	})
}

export const addUser: RequestHandler = (req, res, next) => {
	
	return next( appError('something', 404) )

	res.status(201).json({
		status: 'success',
		data: {
			user: {}
		}
	})
}