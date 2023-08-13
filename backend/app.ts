import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'

import { globalErrorHandler } from './controllers/errorController'
import { userRouter } from './routes/userRoute'
import { repoRouter } from './routes/repoRoute'

config()
const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))

// app.get('/', (req: Request, res: Response) => {
// 	res.status(200).json({
// 		status: 'success',
// 		data: {}
// 	})
// })

app.use('/api/users', userRouter)
app.use('/api/repos', repoRouter)

app.use(globalErrorHandler)

const PORT = +process.env.PORT! || 5000
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})

process.on('unhandledRejection', (err: any) => {
	console.log({ globalPromiseError: 'PromiseHandler' })
	console.log(err.message)
})

process.on('uncaughtException', (err: any) => {
	console.log({ globalError: 'GlobalHandler' })
	console.log(err)
})
