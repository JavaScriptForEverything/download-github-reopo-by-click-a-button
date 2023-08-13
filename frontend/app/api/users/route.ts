import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
	const data = await req.json()
	
	const promise = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/repos`, {
				method: 'post',
				body: JSON.stringify({
					username: 'robitops10'
				})
			})

			const res = await promise.json() 

			console.log(res)
	console.log(data)
	
	return NextResponse.json({
		data
	})
}