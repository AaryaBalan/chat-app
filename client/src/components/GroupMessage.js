import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { FaInfo } from "react-icons/fa6";
import { FaReply } from "react-icons/fa";
import BearAvatar from './BearAvatar';
import { getUserColor } from '../utilities/utility';

const GroupMessage = ({ room, groupMessages, setReplyMessage, socketRef }) => {
    const [typingUsers, setTypingUsers] = useState([]);
    const [highlightMessageId, setHighlightMessageId] = useState('')
    const messagesEndRef = useRef(null);
    const currentUserId = JSON.parse(localStorage.getItem('user'))._id;

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [groupMessages]);

    useEffect(() => {
        const handleGroupTyping = (user) => {
            setTypingUsers((prev) => {
                const exists = prev.some(u => u.username === user.username);
                if (!exists) {
                    return [...prev, { username: user.username, profileImage: user.profileImage }];
                }
                return prev;
            });

            setTimeout(() => {
                setTypingUsers(prev => prev.filter(u => u.username !== user.username));
            }, 3000);
        };

        socketRef.current.on('groupTyping', handleGroupTyping);
        return () => {
            socketRef.current.off('groupTyping', handleGroupTyping);
        };
    }, []);

    const goToReply = (messageId) => {
        window.location.href = `#${messageId}`
        setHighlightMessageId(messageId)
    }

    return (
        <div className="h-full px-1 overflow-auto overflow-x-hidden bg-[#131324] rounded-t-2xl">
            <div className="bg-[#fbbc05] py-3 px-5 flex items-center gap-4 sticky top-0 z-10">
                <BearAvatar seed={room.avatar.svgId} type={room.avatar.type} size={50} />
                <div className='flex justify-between w-full items-center'>
                    <div className='flex flex-col'>
                        <div className="font-bold">{room?.name}</div>
                        <div className='text-sm'>{room?.membersCount} members</div>
                    </div>
                    <div className='bg-[#4285f4] w-7 h-7 flex items-center justify-center rounded-full cursor-pointer'>
                        <FaInfo size={20} color='black' />
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <div className='flex flex-col mt-5 px-2 gap-y-4'>
                    {groupMessages.map((message, index) => {
                        const isOwn = message.senderId._id === currentUserId;
                        const userColor = isOwn ? '#34a853' : getUserColor(message.senderId._id);

                        return (
                            <div key={index}
                                id={message._id}
                                className={`flex items-end gap-x-2 justify-start group ${isOwn ? "flex-row-reverse" : "flex-row"} ${highlightMessageId === message._id ? 'bg-gray-800 rounded-md' : ""}`}
                            >
                                <div
                                    className="w-10 h-10"
                                    dangerouslySetInnerHTML={{ __html: message.senderId.profileImage }}
                                />
                                <div
                                    className={`max-w-md text-white font-medium w-fit px-3 py-2 rounded-t-2xl flex flex-col gap-y-2 ${isOwn ? 'rounded-l-2xl' : 'rounded-r-2xl'}`}
                                    style={{
                                        backgroundColor: isOwn ? '#34a85344' : '#0b0b16',
                                    }}
                                >
                                    <div className='text-xs' style={{ color: isOwn ? '#34a853' : userColor }}>
                                        {isOwn ? '' : message.senderId.username}
                                    </div>

                                    {message.replyTo && (
                                        <div onClick={() => goToReply(message.replyTo._id)}
                                            className="flex flex-col cursor-pointer -mt-0.5 -mx-1.5 rounded px-2 py-1"
                                            style={{
                                                backgroundColor: isOwn ? '#34a853' : userColor
                                            }}
                                        >
                                            <div className='text-[black] font-extrabold text-sm'>
                                                {message.replyTo.senderId._id === currentUserId ? 'You' : message.replyTo.senderId.username}
                                            </div>
                                            <div className="text-white text-xs">{message.replyTo.message}</div>
                                        </div>
                                    )}

                                    <div className="break-words text-sm">{message.message}<br /></div>

                                    <span
                                        className="self-end text-xs font-extrabold"
                                        style={{ color: userColor }}
                                    >
                                        {moment(message.createdAt).calendar()}
                                    </span>
                                </div>

                                <div className="group-hover:block self-center cursor-pointer hidden">
                                    <span className="text-white text-sm" onClick={() => setReplyMessage(message)}>
                                        <FaReply size={17} />
                                    </span>
                                </div>
                            </div>
                        );
                    })}

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
