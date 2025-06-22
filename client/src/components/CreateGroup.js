import React from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { createRoomRoute, toastOptions } from '../utilities/utility'
import { MdEdit } from "react-icons/md";
import group from '../assets/group.svg'


const CreateGroup = ({
    setShowGroupIcon,
    roomDetails,
    setRoomDetails,
    setCreateGroup,
    socketRef
}) => {

    const handleRoom = (e) => {
        setRoomDetails(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    console.log(roomDetails)

    const createRoom = async (e) => {
        e.preventDefault()
        if (!roomDetails.svg) {
            toast.error('Please select the group icon', toastOptions)
            setShowGroupIcon(true)
            return
        }
        try {
            const { data } = await axios.post(createRoomRoute, {
                ...roomDetails,
                admin: JSON.parse(localStorage.getItem('user'))._id,
                svgId: roomDetails?.svg?.svgId || "default",
                type: roomDetails?.svg?.type || 'default'
            })

            if (data.status) {
                toast.success("Room created successfully!", toastOptions)
                // emiting a new user joined event
                socketRef.current.emit('joined', {
                    username: JSON.parse(localStorage.getItem('user')).username,
                    roomId: data.room._id
                })

                setShowGroupIcon(false)
                setInterval(() => {
                    setCreateGroup(false)
                }, 1500)
            }
            else if (data.status === false) {
                toast.error(data.message, toastOptions)
            }
        } catch (err) {
            toast.error('Internal server error', toastOptions)
        }
    }

    return (
        <>
            <form onSubmit={createRoom} className='w-full h-full mt-20 bg-[#0b0b16]'>
                <div className='flex flex-col gap-y-7 justify- items-center h-full'>
                    <div className='relative'>
                        {
                            roomDetails.svg ?
                                <img src={`data:image/svg+xml;utf8,${encodeURIComponent(roomDetails.svg.svg)}`} alt="Avatar" className='w-24 h-24 border-[#673ab7] border-3 rounded-full' /> :
                                <img src={group} alt="" className='w-24 h-24 border-[#673ab7] border-3 rounded-full' />
                        }
                        <div onClick={() => setShowGroupIcon(prev => !prev)} className='absolute right-0 bottom-0 bg-[#34a853] w-7 h-7 flex items-center justify-center rounded-full cursor-pointer'><MdEdit size={20} color='white' /></div>
                    </div>
                    <input
                        onChange={(e) => handleRoom(e)}
                        value={roomDetails.roomName}
                        name='roomName'
                        type="text"
                        placeholder="Room Name"
                        className='border-[#673ab7] border px-3 py-2 rounded-md outline-none focus:border-[#34a853] text-white bg-transparent w-96'
                        required
                    />
                    <textarea
                        onChange={(e) => handleRoom(e)}
                        value={roomDetails.roomDescription}
                        name='roomDescription'
                        type="text"
                        placeholder="Description"
                        className='h-40 border-[#673ab7] border px-3 py-2 rounded-md outline-none focus:border-[#34a853] text-white bg-transparent w-96'
                        required
                    />
                    <button type='submit' className='bg-[#fbbc05] px-3 py-2 rounded cursor-pointer'>Create Group</button>
                </div>
            </form>
            <ToastContainer />
        </>
    )
}

export default CreateGroup