import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllRooms, getRecentRoomsRoute } from '../utilities/utility';
import { createAvatar } from '@dicebear/core';
import { avatarTypes } from '../utilities/utility';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import BearAvatar from './BearAvatar';

const GroupRooms = ({
    rooms,
    setRooms,
    groupMessages
}) => {
    const { id } = useParams()

    useEffect(() => {
        const getRecentRooms = async () => {
            try {
                const { data } = await axios.post(getRecentRoomsRoute, {
                    userId: JSON.parse(localStorage.getItem('user'))._id
                })
                const recentRooms = data
                const recentRoomsId = data.map(room => room._id)
                const response = await axios.get(getAllRooms);
                const roomData = response.data;
                const otherRooms = roomData.filter(room => !recentRoomsId.includes(room._id))
                setRooms([...recentRooms, ...otherRooms])
            } catch (err) {
                console.log(err)
            }
        }
        getRecentRooms()

    }, [groupMessages]);
    console.log(rooms)

    return (
        <div className='mt-5'>
            <div>
                <input
                    placeholder='Search...'
                    type="text"
                    className='w-full outline-none border-[#673ab7] bg-[#683ab74b] border px-3 py-2 text-white rounded-md'
                />
            </div>
            <div className='mt-10'>
                <div className='flex flex-col gap-y-4'>
                    {rooms.map((room, index) => (
                        <Link to={`/groups/${room._id}`}
                            key={room._id || index}
                            className={`${room._id === id ? 'bg-[#ea443556]' : 'bg-[hsl(259,47%,15%)] hover:bg-[#ffffff2a]'}  flex gap-x-3 items-center rounded-2xl p-2 cursor-pointer`}
                        >
                            <BearAvatar seed={room.avatar.svgId} type={room.avatar.type} />
                            <div className='truncate flex flex-col gap-y-1'>
                                <div className='text-white font-medium'>{room.name}</div>
                                <div className='text-white truncate text-sm'>{room.description}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GroupRooms;
