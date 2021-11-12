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

    const { method } = req
    switch (method) {
        case 'POST':
            try {
                const movie = new Movie(req.body)
                await movie.save()
                return successResponse(res, movie)
            } catch (error) {
                return errorResponse(res, 400, error)
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
