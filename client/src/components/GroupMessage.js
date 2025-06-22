import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment'
import { avatarTypes } from '../utilities/utility';
import { createAvatar } from '@dicebear/core';
import { FaInfo } from "react-icons/fa6";
import { FaReply } from "react-icons/fa";

const GroupMessage = ({
    room,
    groupMessages,
    setReplyMessage,
    socketRef
}) => {
    const [avatarSvg, setAvatarSvg] = useState('');
    const messagesEndRef = useRef(null);
    const [typingUsers, setTypingUsers] = useState([])
    console.log(typingUsers)

    // Auto scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [groupMessages]);

    useEffect(() => {
        if (!room) {
            return
        }
        const { avatar = {} } = room;
        const { svgId, type } = avatar;

        if (svgId && type && avatarTypes[type]) {
            const generatedAvatar = createAvatar(avatarTypes[type], {
                seed: svgId,
                rowColor: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                shape1Color: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                shape2Color: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                ringColor: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                backgroundColor: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
            });

            const svgString = generatedAvatar.toString();
            const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
            setAvatarSvg(svgDataUri);
        }
    }, [room]);

    useEffect(() => {
        const handleGroupTyping = (user) => {
            setTypingUsers((prev) => {
                const exists = prev.some(u => u.username === user.username);
                if (!exists) {
                    return [...prev, { username: user.username, profileImage: user.profileImage }];
                }
                return prev;
            });
            // Auto-remove user after 3 seconds
            setTimeout(() => {
                setTypingUsers(prev => prev.filter(u => u.username !== user.username));
            }, 3000);
        };


        socketRef.current.on('groupTyping', handleGroupTyping);

        return () => {
            socketRef.current.off('groupTyping', handleGroupTyping);
        };
    }, []);


    return (
        <div className="h-full px-1 overflow-auto overflow-x-hidden bg-[#0b0b16] rounded-t-2xl">
            <div className="bg-[#fbbc05] py-3 px-5 flex items-center gap-4 sticky top-0 z-10">
                <div>
                    {avatarSvg && <img src={avatarSvg} alt="Room Avatar" className="w-12 h-12 rounded-full" />}
                </div>
                <div className='flex justify-between w-full items-center'>
                    <div className='flex flex-col '>
                        <div className="font-bold">{room?.name}</div>
                        <div className='text-sm'>{room?.membersCount} members</div>
                    </div>
                    <div className='bg-[#4285f4] w-7 h-7 flex items-center justify-center rounded-full cursor-pointer'><FaInfo size={20} color='black' /></div>
                </div>
            </div>
            <div className="flex flex-col relative">


                {/* Messages would go here */}
                <div className='flex flex-col mt-5 px-2 gap-y-4'>

                    {
                        groupMessages.map((message, index) => {
                            return (
                                <div key={index}
                                    className={`flex items-end gap-x-2 justify-start group ${message.senderId._id === JSON.parse(localStorage.getItem('user'))._id ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div
                                        className="w-10 h-10"
                                        dangerouslySetInnerHTML={{ __html: message.senderId.profileImage }}
                                    />
                                    <div
                                        className={`max-w-md text-white font-medium w-fit px-3 py-2 rounded-t-2xl flex flex-col gap-y-2
                                            ${message.senderId._id === JSON.parse(localStorage.getItem('user'))._id ? 'rounded-l-2xl border-[#34a853] bg-[#34a85354]' : 'rounded-r-2xl border-[#4285f4] bg-[#4286f442]'} `}
                                    >
                                        {/* sender name */}
                                        <div className='text-xs'>{message.senderId._id === JSON.parse(localStorage.getItem('user'))._id ? "" : message.senderId.username}</div>
                                        {/* reply info */}
                                        <div
                                            className={`${message.replyTo ? 'flex' : 'hidden'} 
                                            ${message?.senderId?._id === JSON.parse(localStorage.getItem('user'))._id ? "bg-[#34a853]" : "bg-[#4285f4]"} 
                                            -mt-0.5 -mx-1.5 rounded px-2 py-1 cursor-pointer text-sm break-words flex-col`}
                                        >
                                            <div className='text-[black] break-words text-sm font-extrabold'>{message?.replyTo?.senderId?._id === JSON.parse(localStorage.getItem('user'))._id ? 'You' : message?.replyTo?.senderId?.username}</div>
                                            <div className="text-[white] break-words text-xs">{message?.replyTo?.message}</div>
                                        </div>

                                        <div className="break-words text-sm">{message.message}<br /></div>
                                        <span
                                            className={`self-end text-xs font-extrabold ${message.senderId._id === JSON.parse(localStorage.getItem('user'))._id ? 'text-[#34a853]' : 'text-[#4285f4]'}`}
                                        >
                                            {moment(message.createdAt).calendar()}
                                        </span>
                                    </div>

                                    {/* Hover icon placeholder */}
                                    <div className="group-hover:block self-center cursor-pointer hidden">
                                        {/* Add an icon component or leave it hidden */}
                                        <span className="text-white text-sm" onClick={() => setReplyMessage(message)}><FaReply size={17} /></span>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {typingUsers.length > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-3">
                                {typingUsers.slice(0, 3).map((user, index) => (
                                    <div
                                        key={index}
                                        className="w-8 h-8 rounded-full border-2 border-[#0b0b16] overflow-hidden"
                                        dangerouslySetInnerHTML={{ __html: user.profileImage }}
                                    />
                                ))}
                            </div>
                            <div className="max-w-md text-white font-medium w-fit px-3 py-2 border border-[#4285f4] bg-[#4286f442] rounded-t-2xl rounded-r-2xl flex items-center text-xl">
                                <span className='dotSpan'>.</span>
                                <span className='dotSpan'>.</span>
                                <span className='dotSpan'>.</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef}></div>
                </div>
            </div>
        </div>
    );
};

export default GroupMessage;
