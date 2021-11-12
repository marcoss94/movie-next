import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { ChangeEvent, FormEvent, useState } from 'react'
import Form from '../../components/Form'

const NewMovie = () => {
    const formData = {
        title: '',
        plot: '',
    }
    return (
        <div className='container'>
            <h1 className='my-3'>Add Movie</h1>
            <Form formData={formData} />
        </div>
    )
}

export default NewMovie
