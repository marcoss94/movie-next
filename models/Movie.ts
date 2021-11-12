import mongoose from 'mongoose'

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'ingrese titulo'] },
    plot: { type: String, required: [true, 'ingrese plot'] },
})

export default mongoose.models.Movie || mongoose.model('Movie', MovieSchema)
