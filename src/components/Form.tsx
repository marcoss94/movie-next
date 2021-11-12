import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { ChangeEvent, FormEvent, useState } from 'react'

interface IFormValue {
    title: string
    plot: string
}

interface IMessage {
    message: any
}

interface IformData {
    title: string
    plot: string
}
interface IProps {
    formData: IformData
    forNewMovie?: boolean
}

const Form = ({ formData, forNewMovie = true }: IProps) => {
    const router = useRouter()
    const [form, setForm] = useState<IFormValue>({
        title: formData.title,
        plot: formData.plot,
    })
    const [message, setMessage] = useState<IMessage[]>([])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target
        setForm({
            ...form,
            [name]: value,
        })
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage([])
        if (forNewMovie) {
            postData(form)
        } else putData(form)
    }

    const putData = async (form: IFormValue) => {
        const { id } = router.query
        try {
            const res = await fetch(`/api/movie/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(form),
            })

            const data = await res.json()
            if (!data.success) {
                for (const key in data.error.errors) {
                    let error = data.error.errors[key]
                    setMessage((prev) => [...prev, { message: error.message }])
                }
            } else {
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const postData = async (form: IFormValue) => {
        try {
            const res = await fetch('/api/movie', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(form),
            })

            const data = await res.json()
            if (!data.success) {
                for (const key in data.error.errors) {
                    let error = data.error.errors[key]
                    setMessage((prev) => [...prev, { message: error.message }])
                }
            } else {
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type='text'
                className='form-control my-2'
                placeholder='Title'
                autoComplete='off'
                name='title'
                value={form.title}
                onChange={handleChange}
            />
            <input
                type='text'
                className='form-control my-2'
                placeholder='Plot'
                name='plot'
                autoComplete='off'
                value={form.plot}
                onChange={handleChange}
            />
            <button className='btn btn-primary w-100 mb-2' type='submit'>
                {forNewMovie ? 'Add' : 'Edit'}
            </button>
            <Link href={'/'}>
                <a className='btn btn-warning w-100 '>Back</a>
            </Link>
            {message.map(({ message }, index) => (
                <p key={index}>{message}</p>
            ))}
        </form>
    )
}

export default Form
