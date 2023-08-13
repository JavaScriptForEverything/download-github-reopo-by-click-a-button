'use client'
import { useEffect, useState } from 'react'

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL


const download = async (blob: Blob, filename: string) => {
	const dataUrl = URL.createObjectURL(blob)

	const link = document.createElement('a')
	link.href = dataUrl
	link.download = `${filename}.zip`
	// document.appendChild(link)
	link.click()
	// link.parentNode?.removeChild(link)

	URL.revokeObjectURL(dataUrl)
	
}


const Home = () => {
	const [ fields, setFields ] = useState({ username: '' })
	const [ repos, setRepos ] = useState<string[]>([])
	const [ errorMessage, setErrorMessage ] = useState('')

	const [ isDownloadingRepos, setIsDownloadingRepos ] = useState(false)
	const [ selectedRepo, setSelectedRepo ] = useState('')

	const changeHandler = (name: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		setFields({ ...fields, [name]: evt.target.value })
	}
	const submitHandler = async(evt: React.FocusEvent<HTMLFormElement>) => {
		evt.preventDefault()
		setIsDownloadingRepos(true)

		try {
			const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/repos?id=1`, {
				method: 'post',
				body: JSON.stringify(fields),
				headers: {
					'content-type': 'application/json',
					'accept': 'application/json'
				}
			})

			const result = await res.json() 


			// for those erro that server not handled, like server is down 
			if( !result.status ) throw new Error(result.message)

			// if request not success then data will be empty, and result.message will be the error
			if(result.message) return setErrorMessage(result.message)

			setRepos(result.data)
			setIsDownloadingRepos(false)
			setFields({ ...fields, username: ''})


		} catch (err: any) {
			console.log(err)
		}
	}

	const repoDownloadHandler = (name: string) => async (evt: React.MouseEvent<HTMLButtonElement>) => {
		setSelectedRepo(name)

		try {
			const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/repos/${name}`, {
				method: 'post',
				body: JSON.stringify(fields),
				headers: {
					'content-type': 'application/json',
					'accept': 'application/octet-stream',
				}
			})

			const blob = await res.blob()
			await download(blob, name)


			setSelectedRepo('')

		} catch (err: any) {
			setSelectedRepo('')
			// if request not success then data will be empty, and result.message will be the error
			if(err.message) return setErrorMessage(err.message)
		}
	}



	return (
		<>
			<h1>Download Github Repo</h1>
			<p>
				We can download any github repository by clicking the button beside repository name.
			</p>
			<div>
				Just Enter your (any) github username. 
				<p>
					<small>
						<em>Note: Github has Download RateLimit per user.</em>
					</small>
				</p>
			</div>
			<br />

			<form onSubmit={submitHandler}>

				<input 
					type="text" 
					value={fields.username}
					onChange={changeHandler('username')}

					placeholder='ex. robitops10'
				/> <br />

				{!!errorMessage && (
					<>
						<small style={{ color: 'red' }}>{errorMessage}</small> 
						<br />
					</>
				)}

				<button disabled={isDownloadingRepos} >{isDownloadingRepos ? 'Downloading ...': 'Get Repos'}</button>
			</form>

				<ul>
					{repos.map((repo, key) => (
						<li key={repo}>{repo} <button 
							onClick={repoDownloadHandler(repo)}
							disabled={ selectedRepo === repo }
						>{selectedRepo === repo ? 'Downloading ...' : 'Download' }</button></li>
					))}
				</ul>
		</>
	)
}
export default Home
