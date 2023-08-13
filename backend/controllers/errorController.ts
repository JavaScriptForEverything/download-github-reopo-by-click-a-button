import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';


type Fn = {
	(req: Request, res: Response, next: NextFunction): Promise<any>
}
export const catchAsync = (fn: Fn) => {
	return (req: Request, res: Response, next: NextFunction) => {
		return fn(req, res, next).catch(next)
	}
}


type ErrorResponse = {
	// status: 'failed' | 'error'
	status: string,
	message?: string
	stack?: string
	statusCode: number
}

export const appError = (message?: string, statusCode = 400, status = 'failed'): ErrorResponse => {
	const err = new Error(message)

	return {
		status: status,
		message: err.message,
		stack: err.stack,
		statusCode,
	}
}



export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next ) => {
	const { DEBUG, SHOW_ERROR_STACK } = process.env

	err = err.status ? err : appError(err, 500, 'ServerError' )

	if( !(SHOW_ERROR_STACK === 'true') ) delete err.stack 
	if( DEBUG === 'true' ) console.log(err)

	res.status(err.statusCode || 500).json(err)
}