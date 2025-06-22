import React, { useEffect, useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { identicon, rings, shapes } from '@dicebear/collection';
import { TfiReload } from "react-icons/tfi";


const GroupIcons = ({
    roomDetails,
    setRoomDetails
}) => {
    const [avatars, setAvatars] = useState([]);

    const generateAvatars = () => {
        const allAvatars = [];
        const avatarTypes = [
            { type: identicon, name: "identicon" },
            { type: shapes, name: "shapes" },
            { type: rings, name: "rings" },
        ];

        avatarTypes.forEach((type) => {
            for (let i = 0; i < 5; i++) {
                const randomNumber = Math.random().toString()
                const avatar = createAvatar(type.type, {
                    seed: randomNumber, // seed must be a string
                    rowColor: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                    shape1Color: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                    shape2Color: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                    ringColor: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                    backgroundColor: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                });
                const svg = avatar.toString();
                allAvatars.push({ svgId: randomNumber, svg, type: type.name });
            }
        });

        setAvatars(allAvatars);
    };
    useEffect(() => {
        generateAvatars();
    }, []);

    return (
        <div className='w-2/3 bg-[#683ab73a] h-[90vh] flex flex-col items-center justify-center gap-y-10'>
            <div className='bg-[#ea44354d] border-[#ea4335] border px-3 py-1 text-white rounded'>Select Group Icons</div>
            <div className='flex gap-x-10 gap-y-10 flex-wrap max-w-2xl mx-auto justify-center'>
                {avatars.map((svg, idx) => (
                    <img
                        key={idx}
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(svg.svg)}`}
                        alt={`Avatar ${idx}`}
                        className='w-24 h-24 rounded-full hover:scale-110 transition-all'
                        onClick={() => setRoomDetails(prev => ({ ...prev, svg }))}
                    />
                ))}
            </div>
            <div className='flex justify-end ml-auto px-10'>
                <button
                    onClick={generateAvatars}
                    className='bg-[#673ab7] text-white font-bold py-2 rounded-lg w-fit px-4 hover:bg-[#ea4335] transition duration-300 cursor-pointer flex items-center gap-x-2'
                >
                    <TfiReload size={20} /> <span>Load more avatar...</span>
                </button>
            </div>
        </div>
    );
};

export default GroupIcons;
