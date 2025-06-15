import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import CreateGroup from "../components/CreateGroup"
import GroupRooms from '../components/GroupRooms';
import GroupIcons from '../components/GroupIcons';


const Groups = () => {

    const [createGroup, setCreateGroup] = useState(false)
    const [showGroupIcon, setShowGroupIcon] = useState(false)
    const [roomDetails, setRoomDetails] = useState({
        roomName: "",
        roomDescription: "",
    })
    console.log(roomDetails)

    return (
        <>
            <div className='bg-[#131324] h-[100vh] w-full flex justify-center items-center px-4 py-8'>
                <div className='bg-[#00000076] w-full max-w-7xl h-[90vh] rounded-lg'>
                    <div className='flex w-full'>
                        <div className='w-1/3 bg-[#13132428] p-3 flex flex-col gap-y-4'>
                            <div className='flex justify-between'>
                                <div className='text-white'>Groups</div>
                                <div className={`${createGroup ? "rotate-45" : ""} transition-all cursor-pointer`} onClick={() => setCreateGroup(prev => !prev)}><FaPlus size={20} color='white' /></div>
                            </div>
                            {
                                createGroup ?
                                    <CreateGroup
                                        setShowGroupIcon={setShowGroupIcon}
                                        roomDetails={roomDetails}
                                        setRoomDetails={setRoomDetails}
                                    /> :
                                    <GroupRooms />
                            }
                        </div>
                        {
                            showGroupIcon ?
                                <GroupIcons
                                    roomDetails={roomDetails}
                                    setRoomDetails={setRoomDetails}
                                /> :
                                <div className='w-2/3 bg-[#683ab73a] h-[90vh]'></div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Groups