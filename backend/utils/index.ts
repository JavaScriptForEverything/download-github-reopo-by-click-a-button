import { mkdir, rm, existsSync, rmSync, mkdirSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'
import Adm_Zip from 'adm-zip'

type IDownloadRepo = {
	username: string,
	reponame: string
	dirname?: string
}



const root = process.cwd()


// const repos = await fetchUserRepos(username) 	=> [...repos]
export const fetchUserRepos = async (username: string) => {
	const userRepos = `https://api.github.com/users/${username}/repos`
	const res = await fetch(userRepos)
	const repos = await res.json()

	return repos.map( (repo: any) => repo.name)
}


// const buf = await downloadRepo({ username, reponame })
export const downloadRepo = ({ username, reponame, dirname='upload/repos' }: IDownloadRepo) => {
	return new Promise<any>((resolve, reject) => {
		try {

			if( !username ) return reject('username is empty')
			if( !reponame ) return reject('reponame is empty')

			const zip = new Adm_Zip()
			const savedDirectory = join( root, dirname )

			if( !existsSync(savedDirectory) ) mkdirSync(savedDirectory, { recursive: true })			

			const repoUrl = `https://github.com/${username}/${reponame}`
			// const repoUrl = join('https://github.com', username, reponame)
			const destinationDir = join( savedDirectory, reponame )

			if(existsSync(destinationDir)) rmSync(destinationDir, { recursive: true }) 		

			// Step-1: Download the Repository as folder 		: after that
			execSync(`git clone ${repoUrl} ${destinationDir}`)
			// if( (bufferResponse instanceof Buffer) ) return reject('username or reponame is not exists')

			// Step-2: Convert folder to zip and return as Buffer 	: after that
			zip.addLocalFolder(destinationDir)
			const buf = zip.toBuffer()
			resolve(buf)

			// Step-3: Finaly delete the folder that downloaded in Step-1
			rmSync(destinationDir, { recursive: true, force: true })

		} catch (err: any) {
			reject(err.message)			
		}
	})
}
