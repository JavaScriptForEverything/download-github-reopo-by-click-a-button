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
	const [ repoErrorMessage, setRepoErrorMessage ] = useState('')

	const [ isDownloadingRepos, setIsDownloadingRepos ] = useState(false)
	const [ selectedRepo, setSelectedRepo ] = useState('')

	const changeHandler = (name: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		setFields({ ...fields, [name]: evt.target.value })
	}
	const submitHandler = async(evt: React.FocusEvent<HTMLFormElement>) => {
		evt.preventDefault()

		try {
			setIsDownloadingRepos(true)
			setErrorMessage('')

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
			if(result.message) {
				setErrorMessage(result.message)
				setIsDownloadingRepos(false)
				return
			}

			setRepos(result.data)
			setIsDownloadingRepos(false)

			/* username must require in body for later use so bellow command reset user to null

							setFields({ ...fields, username: ''}) 		
				
				That is a problems, because later for every request we need 'username' and 'reponame'
				if we need to empty the input field then we have to save the username into another
				state variable and then we can set field to empth.
			*/ 


		} catch (err: any) {
			setIsDownloadingRepos(false)
			console.log(err)
		}
	}

	const repoDownloadHandler = (name: string) => async (evt: React.MouseEvent<HTMLButtonElement>) => {
		try {
			setSelectedRepo(name)
			setRepoErrorMessage('')

			const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/repos/${name}`, {
				method: 'post',
				body: JSON.stringify(fields),
				headers: {
					'content-type': 'application/json',
					'accept': 'application/octet-stream',
				}
			})


			if( !res.ok ) {
				const { message } = await res.json()
				setRepoErrorMessage(message)
				throw new Error(message)
			}

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
						<li key={repo}>{repo} 
							<button 
								onClick={repoDownloadHandler(repo)}
								disabled={ selectedRepo === repo }
							>{selectedRepo === repo ? 'Downloading ...' : 'Download' }</button>
							{selectedRepo === repo && <small style={{ color: 'red' }}>{repoErrorMessage}</small>
							}
						</li>
					))}
				</ul>
		</>
	)
}
export default Home
