/* eslint-disable @next/next/no-img-element */
'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'

interface User {
  _id: string
  image_url: string
  name: string
  username: string
  firstname: string
  lastname: string
}

interface ChatMessage {
  content: string
  senderId: string
  receiver: string
}

const ChatPage = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [transport, setTransport] = useState<string>('N/A')
  const [message, setMessage] = useState<string>('')
  const [receiver, setReceiver] = useState<string>('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [allUser, setAllUser] = useState<User[]>([])
  const [image, setImage] = useState([])
  const [imagePath, setImagePath] = useState('')
  const [activeUser, setActiveUser] = useState<{
    _id: string
    username: string
    firstname: string
    lastname: string
  }>({
    _id: '',
    username: '',
    firstname: '',
    lastname: '',
  })

  const [chatData, setChatData] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/user/${user._id}`
          )
          setAllUser(response.data)
        } catch (error) {
          console.log(error)
        }
      }

      fetchUserData()
    } else {
      handleLocalStorage()
    }
  }, [user?._id])

  useEffect(() => {
    const activeUserData = localStorage.getItem('activeUser')
    if (activeUserData !== null) {
      const parsedUser = JSON.parse(activeUserData)
      setActiveUser(parsedUser)
      setReceiver(parsedUser._id)
    }
  }, [])

  useEffect(() => {
    handleLocalStorage()

    if (!socket) {
      const newSocket = io('http://localhost:8000')
      setSocket(newSocket)

      return () => {
        if (newSocket) {
          newSocket.disconnect()
        }
      }
    }
  }, [])

  let chat = user?._id !== receiver ? 'chat chat-start' : 'chat chat-end'
  const handleLocalStorage = () => {
    const userData = localStorage.getItem('user')
    if (userData !== null) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }

  useEffect(() => {
    if (!socket) return

    const onConnect = () => {
      setIsConnected(true)
      setTransport(socket.io.engine.transport.name)

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name)
      })
    }

    const onDisconnect = () => {
      setIsConnected(false)
      setTransport('N/A')
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      if (socket) {
        socket.off('connect', onConnect)
        socket.off('disconnect', onDisconnect)
      }
    }
  }, [socket])

  const handleSubmit = () => {
    if (socket?.connected) {
      if (user && activeUser) {
        const messageData = {
          receiver: activeUser._id ?? activeUser._id,
          sender: user._id,
          content: message,
        }
        socket.emit('message', messageData)
        axios
          .post(`http://localhost:5000/message/send`, messageData)
          .then((res: object) => console.log('res', res))
          .catch((error: object) => console.log('error', error))
        setMessage('')
      }
    }
  }

  const handleClick = async (user: any): Promise<void> => {
    localStorage.setItem('activeUser', JSON.stringify(user))
    try {
      const res = await axios.get(
        `http://localhost:5000/message/receiver/${user._id}`
      )
      setChatData(res.data)
    } catch (error) {
      console.log('error', error)
    }
  }
  // File Upload
  const handleShowImage = (e: any) => {
    setImage(e.target.files[0])
    setImagePath(URL.createObjectURL(e.target.files[0]))
  }
  const handleUploadImage = (e: any) => {
    const file = e.target.files[0]
    const formData = new FormData()
    console.log(file, 'file')
    if (user && activeUser) {
      formData.append('content', file)
      formData.append('sender', user._id)
      formData.append('receiver', activeUser._id)
      axios
        .post('http://localhost:5000/message/send', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },})
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  // Ui
  return (
    <div className='bg-gray-900 text-white'>
      <main className='flex h-screen overflow-x-hidden'>
        <aside className='bg-gray-800 w-1/4'>
          <div className='p-4'>
            <h2 className='text-2xl font-semibold mb-4 p-50'>Contacts</h2>
            <ul className='divide-y divide-gray-700'>
              {allUser?.length > 0 ? (
                allUser.map((user) => {
                  return (
                    <>
                      <li
                        className='flex items-center py-3'
                        key={user._id}
                        onClick={() => handleClick(user)}
                      >
                        <div className='bg-gray-900 p-4 rounded-lg shadow-md flex items-center space-x-4 w-full'>
                          <img
                            src={`https://avatar.iran.liara.run/username?username=${encodeURIComponent(
                              user.firstname.trim()
                            )}+${encodeURIComponent(user.lastname)}`}
                            alt='Contact'
                            className='w-12 h-12 rounded-full'
                          />
                          <div>
                            <h3 className='text-lg font-medium text-white'>
                              {user.username.toUpperCase()}
                            </h3>
                            <p className='text-gray-300'>{`${user.firstname} ${user.lastname}`}</p>
                          </div>
                        </div>
                      </li>
                    </>
                  )
                })
              ) : (
                <li className='py-3'>
                  <div className='border border-blue-100 shadow rounded-md p-4 max-w-sm w-full mx-auto'>
                    <div className='flex space-x-4'>
                      <div className='rounded-full bg-slate-700 h-10 w-10'></div>
                      <div className='flex-1 space-y-6 py-1'>
                        <div className='h-2 bg-slate-700 rounded'></div>
                        <div className='space-y-3'>
                          <div className='grid grid-cols-3 gap-4'>
                            <div className='h-2 bg-slate-700 rounded col-span-2'></div>
                            <div className='h-2 bg-slate-700 rounded col-span-1'></div>
                          </div>
                          <div className='h-2 bg-slate-700 rounded'></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </aside>

        <section className='flex-1 bg-gray-900 border-l border-gray-800'>
          <header className='bg-gray-800 p-4 border-b border-gray-800'>
            <div className='w-full rounded-full flex items-center gap-3'>
              {activeUser ? (
                <img
                  src={`https://avatar.iran.liara.run/username?username=${encodeURIComponent(
                    activeUser.firstname.trim()
                  )}+${encodeURIComponent(activeUser.lastname)}`}
                  alt='Contact'
                  className='w-11 h-11'
                />
              ) : (
                <img src='https://images.unsplash.com/photo-1614097498786-e6e2626c0cf3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM4fFdkQ2hxbHNKTjljfHxlbnwwfHx8fHw%3D' />
              )}
              <h1 className='text-xl font-semibold'>
                Chat with {activeUser?.username.toUpperCase()}
              </h1>
            </div>
          </header>
          <div className='p-6'>
            <div className='p-4'>
              <div className='flex flex-col space-y-4 relative'>
                <div className='flex items-start justify-end'></div>
              </div>
            </div>
            <div className={chat}>
              <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                  {activeUser ? (
                    <img
                      src={`https://avatar.iran.liara.run/username?username=${encodeURIComponent(
                        activeUser.firstname.trim()
                      )}+${encodeURIComponent(activeUser.lastname)}`}
                      alt='Contact'
                    />
                  ) : (
                    <img src='https://images.unsplash.com/photo-1614097498786-e6e2626c0cf3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM4fFdkQ2hxbHNKTjljfHxlbnwwfHx8fHw%3D' />
                  )}
                </div>
              </div>
              <div className='chat-bubble'>This is Chatapp..!</div>

              {imagePath && (
                <img
                  src={imagePath}
                  alt=''
                  width={350}
                  height={350}
                  className='mt-5 rounded-xl'
                />
              )}
            </div>
            <div className={chat}>
              <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                  {activeUser ? (
                    <img
                      src={`https://avatar.iran.liara.run/username?username=${encodeURIComponent(
                        activeUser.firstname.trim()
                      )}+${encodeURIComponent(activeUser.lastname)}`}
                      alt='Contact'
                    />
                  ) : (
                    <img src='https://images.unsplash.com/photo-1614097498786-e6e2626c0cf3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM4fFdkQ2hxbHNKTjljfHxlbnwwfHx8fHw%3D' />
                  )}
                </div>
              </div>
              <div>
                {chatData.map((message, index) => (
                  <div key={index} className='chat-bubble my-5'>
                    {message?.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <footer className='bg-gray-800 p-4 border-t border-gray-800 absolute bottom-0 w-9/12 flex flex-col'>
            <div className='flex flex-row items-center gap-5'>
              <input
                type='text'
                value={message}
                placeholder='Type your message...'
                onChange={(e) => setMessage(e.target.value)}
                className='flex-1 border rounded p-2 bg-gray-700 text-white mr-2'
              />
              <div className='relative'>
                <input
                  type='file'
                  id='fileInput'
                  className='absolute inset-0 opacity-0 cursor-pointer'
                  accept='image/*'
                  onChange={(e) => handleShowImage(e)}
                />
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  className='text-white'
                  style={{ cursor: 'pointer' }}
                >
                  <path
                    fill='#ffffff'
                    d='m18.1 12.4l-6.2 6.2c-1.7 1.7-4.4 1.7-6 0c-1.7-1.7-1.7-4.4 0-6l8-8c1-.9 2.5-.9 3.5 0c1 1 1 2.6 0 3.5L10.5 15c-.3.3-.8.3-1.1 0c-.3-.3-.3-.8 0-1.1l5.1-5.1c.4-.4.4-1 0-1.4c-.4-.4-1-.4-1.4 0L8 12.6c-1.1 1.1-1.1 2.8 0 3.9c1.1 1 2.8 1 3.9 0l6.9-6.9c1.8-1.8 1.8-4.6 0-6.4c-1.8-1.8-4.6-1.8-6.4 0l-8 8c-1.2 1.2-1.8 2.8-1.8 4.4c0 3.5 2.8 6.2 6.3 6.2c1.7 0 3.2-.7 4.4-1.8l6.2-6.2c.4-.4.4-1 0-1.4s-1-.4-1.4 0z'
                  />
                </svg>
              </div>

              <button
                className='bg-blue-500 text-white px-4 py-2 rounded w-36'
                onClick={handleSubmit}
              >
                Send
              </button>
            </div>
          </footer>
        </section>
      </main>
    </div>
  )
}

export default ChatPage
