import { useRouter } from 'next/dist/client/router'
import React from 'react'
import useSWR from 'swr'
import Form from '../../components/Form'
import { Suspense } from 'react'

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        const error: any = new Error(
            'An error occurred while fetching the data.',
        )
        error.info = await res.json()
        error.status = res.status
        throw error
    }
    const { data } = await res.json()
    return data
}
const Edit = () => {
    const router = useRouter()
    const { id } = router.query

    const { data: movie, error } = useSWR(
        id ? `/api/movie/${id}` : null,
        fetcher,
    )

    if (error) {
        return (
            <div className='container mt-5 text-center'>
                <h1>Error...</h1>
            </div>
        )
    }

    if (!movie) {
        return (
            <div className='container mt-5 text-center'>
                <h1>Loading...</h1>
            </div>
        )
    }

    const formData = {
        title: movie.title,
        plot: movie.plot,
    }
    return (
        <div className='container'>
            <h1 className='my-3'>Edit Movie</h1>
            <Form forNewMovie={false} formData={formData} />
        </div>
    )
}

export default Edit
