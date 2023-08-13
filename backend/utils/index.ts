import { mkdir, rm, existsSync } from 'fs'
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
		const zip = new Adm_Zip()
		const savedDirectory = join( root, dirname )

		const repoUrl = `https://github.com/${username}/${reponame}`
		const destinationDir = join( savedDirectory, reponame )

		if( !existsSync(destinationDir) ) {
			mkdir(destinationDir, { recursive: true }, (err) => {
				if(err) return reject(err)
			})
		}

		// Step-1: Download the Repository as folder 		: after that
		execSync(`git clone ${repoUrl} ${destinationDir}`)

		// Step-2: Convert folder to zip and return as Buffer 	: after that
		zip.addLocalFolder(destinationDir)
		const buf = zip.toBuffer()
		resolve(buf)

		// Step-3: Finaly delete the folder that downloaded in Step-1
		rm(destinationDir, { recursive: true, force: true }, (err: any) => {
			if(err) return reject(err)
		})
	})
}
