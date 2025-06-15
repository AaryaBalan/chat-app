import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllRooms } from '../utilities/utility';
import { createAvatar } from '@dicebear/core';
import { avatarTypes } from '../utilities/utility';

const GroupRooms = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const getRooms = async () => {
            try {
                const response = await axios.get(getAllRooms);
                const roomData = response.data;

                const enrichedRooms = roomData.map((room) => {
                    const { avatar = {} } = room;
                    const { svgId, type } = avatar;

                    let svg = '';
                    if (svgId && type && avatarTypes[type]) {
                        const generatedAvatar = createAvatar(avatarTypes[type], {
                            seed: svgId,
                            rowColor: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                            shape1Color: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                            shape2Color: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                            ringColor: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                            backgroundColor: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                        });
                        svg = generatedAvatar.toString();
                    }
                    return {
                        ...room,
                        avatar: {
                            ...avatar,
                            svg, // add svg string into avatar object
                        }
                    };
                });

                setRooms(enrichedRooms);
            } catch (err) {
                console.error("Error fetching rooms:", err);
            }
        };

        getRooms();
    }, []);

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
                <div className='flex flex-col gap-y-5'>
                    {rooms.map((room, index) => (
                        <div
                            key={room._id || index}
                            className='flex gap-x-3 items-center border-b border-[#683ab79d] py-2 cursor-pointer'
                        >
                            <img
                                src={`data:image/svg+xml;utf8,${encodeURIComponent(room.avatar.svg)}`}
                                alt="Avatar"
                                className='w-12 h-12 rounded-full'
                            />
                            <div className='truncate flex flex-col gap-y-1'>
                                <div className='text-white font-medium'>{room.name}</div>
                                <div className='text-white truncate text-sm'>{room.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GroupRooms;
