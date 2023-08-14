import { downloadRepo, fetchUserRepos } from '../utils';
import { appError, catchAsync } from './errorController';


export const getRepos = catchAsync( async (req, res, next) => {

	const { username = '' } = req.body as { username: string }
	if( !username.trim() ) return next( appError('Invalid: Github username must required'))
	
	const repos = await fetchUserRepos(username)
	if( !repos.length ) return next( appError('Not Found: may be username is not exists'))

	res.json({ 
		status: 'success',
		length: repos.length,
		data: repos
	})
})



export const downloadRepoByName = catchAsync( async (req, res, next) => {
	const { name: reponame ='' } = req.params as { name: string }
	const { username = '' } = req.body as { username: string }
	
	if( !username ) return next(appError('username is empty'))
	if( !reponame ) return next(appError('reponame is empty'))

	const buf = await downloadRepo({ username, reponame })

	res.set('content-type', 'application/octet-stream')
	res.set('content-length', buf.length.toString())
	res.set('content-disposition', `attachment; filename=${reponame}.zip`)

	res.send(buf)
})
