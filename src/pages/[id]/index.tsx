import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React from 'react'
import dbConnect from '../../../lib/dbConnect'
import Movie from '../../../models/Movie'
import { IMovie } from '../../interface/IMovie'

interface IProps {
    movie: IMovie
    success: boolean
    error: any
}

function MovieDetail({ success, error, movie }: IProps) {
    const router = useRouter()

    if (!success) {
        return (
            <div className='container text-center my-5'>
                <h1>{error}</h1>
                <Link href={'/'}>
                    <a className='btn btn-success'>Back...</a>
                </Link>
            </div>
        )
    }

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/movie/${id}`, {
                method: 'DELETE',
            })
            router.push('/')
        } catch (error) {}
    }
    return (
        <div className='container'>
            <h1>Movie Detail</h1>
            <div className='card'>
                <div className='card-body'>
                    <div className='card-title'>
                        <h5 className='text-uppercase'>{movie.title}</h5>
                    </div>
                    <p className='fw-light'>{movie.plot}</p>
                    <Link href={'/'}>
                        <a className='btn btn-success btn-sm me-2'>Back...</a>
                    </Link>
                    <Link href={`/${movie._id}/edit`}>
                        <a className='btn btn-warning btn-sm me-2'>Edit</a>
                    </Link>
                    <button
                        onClick={() => handleDelete(movie._id)}
                        className='btn btn-danger btn-sm'>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MovieDetail

export async function getServerSideProps({ params }: any) {
    try {
        await dbConnect()

        const movie = await Movie.findById(params.id).lean()
        if (!movie) {
            return { props: { success: false, error: 'Movie not found' } }
        }
        console.log(movie)
        movie._id = `${movie._id}`
        return { props: { success: true, movie } }
    } catch (error: any) {
        console.log(error)
        if (error.kind === 'ObjectId') {
            return { props: { success: false, error: 'Movie not valid' } }
        } else {
            return { props: { success: false, error: 'Server error' } }
        }
    }
}
