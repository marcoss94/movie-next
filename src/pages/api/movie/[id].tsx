// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../lib/dbConnect'
import Movie from '../../../../models/Movie'
import { IMovie } from '../../../interface/IMovie'

type Data = {
    data?: IMovie
    success?: boolean
    error?: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    await dbConnect()

    const {
        method,
        query: { id },
    } = req
    switch (method) {
        case 'GET':
            try {
                const movie = await Movie.findById(id).lean()
                if (!movie) {
                    return errorResponse(res, 404, 'Not found')
                }
                return successResponse(res, movie)
            } catch (error) {
                return errorResponse(res, 404, error)
            }
            break

        case 'DELETE':
            try {
                const movie = await Movie.findByIdAndDelete(id)
                if (!movie) {
                    return errorResponse(res, 404, 'Not found')
                }
                return successResponse(res, movie)
            } catch (error) {
                return errorResponse(res, 404, error)
            }
            break

        case 'PUT':
            try {
                const movie = await Movie.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                })
                if (!movie) {
                    return errorResponse(res, 404, 'Not found')
                }
                return successResponse(res, movie)
            } catch (error) {
                return errorResponse(res, 404, error)
            }
            break

        default:
            return errorResponse(res, 500)
            break
    }
}

const errorResponse = (
    res: NextApiResponse<Data>,
    code: number,
    error: any = 'Falla del servidor',
) => {
    return res.status(code).json({ success: false, error })
}

const successResponse = (res: NextApiResponse<Data>, data: any) => {
    return res.status(200).json({ success: true, data })
}
