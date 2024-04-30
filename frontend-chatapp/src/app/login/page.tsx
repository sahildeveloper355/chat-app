'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useState } from 'react'

interface FormData {
  username: string
  password: string
}

export default function LoginPage() {
    const [formData, setFormData] = useState<FormData>({
      username: '',
      password: '',
    })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const router = useRouter()
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)

    axios
      .post(`http://localhost:5000/user/login`, formData)
      .then((res: any) => {
        if (res.data.user && res.status) {
          console.log(res.user)
          localStorage.setItem('user', JSON.stringify(res.data.user))

          router.push('/chat')
        }
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  return (
    <div className='min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-white'>
          Log in to your account
        </h2>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-white'
              >
                Username
              </label>
              <input
                id='username'
                name='username'
                type='text'
                autoComplete='username'
                required
                className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-700 text-white h-8'
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-white'
              >
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-700 text-white h-8'
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
