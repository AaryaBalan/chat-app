import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import moment from 'moment'
import DefaultChat from './DefaultChat';
import { FaReply, FaChevronDown } from "react-icons/fa";
import {formatMessage} from '../utilities/utility'


const ChatMessage = ({
    setIsReply,
    setReplyMessage,
    latestSelfMessage,
    chatPerson,
    socketRef
}) => {

    const [messages, setMessages] = useState([]);
    const [typingUserId, setTypingUserId] = useState(null)
    const [highlightMessageId, setHighlightMessageId] = useState('')
    const [activeReplyMessageId, setActiveReplyMessageId] = useState(null)
    const scroll = useRef();
    const scrollButton = useRef()

    // get all message related to the current person and chat person
    useEffect(() => {
        const getAllMessage = async () => {
            try {
                const { data } = await axios.post('http://localhost:5000/message/all', {
                    sender: JSON.parse(localStorage.getItem('user'))._id,
                    reciever: chatPerson._id
                });
                setMessages(data);
            } catch (err) {
                console.log(err);
            }
        };
        if (chatPerson) {
            getAllMessage();
        }
    }, [chatPerson]);

    // pushes the latest message from the sender to messages state
    useEffect(() => {
        setMessages(prev => [...prev, {
            _id: latestSelfMessage._id,
            self: true,
            message: latestSelfMessage.message,
            time: latestSelfMessage.time,
            replyMessage: latestSelfMessage.replyMessage
        }])
    }, [latestSelfMessage])

    // listening for chat person messages
    useEffect(() => {
        const socket = socketRef.current
        const handleReceive = (data) => {
            if (data.sender._id === chatPerson._id) {
                setMessages(prev => [...prev, {
                    self: false,
                    message: data.message,
                    _id: data._id,
                    time: new Date(),
                    replyMessage: data.replyMessage,
                    sender: data.sender?._id
                }]);
            }
        };
        socket.on('recieveMessage', handleReceive);
        return () => {
            socket.off('recieveMessage', handleReceive);
        };
    }, [socketRef, chatPerson._id]);

    //listening typing
    useEffect(() => {
        const socket = socketRef.current
        const handleTyping = ({ typingUser, waitingUser }) => {
            const currentUserId = JSON.parse(localStorage.getItem("user"))._id;
            if (waitingUser === currentUserId && typingUser === chatPerson._id) {
                setTypingUserId(typingUser);
                setTimeout(() => {
                    setTypingUserId(null);
                }, 3000);
            }
        };
        socket.on('typing', handleTyping);
        return () => {
            socket.off('typing', handleTyping);
        };
    }, [socketRef, chatPerson]);


    // scroll down function
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: 'instant' });
    }, [messages]);

    const handleReply = (msg) => {
        setIsReply(true)
        setReplyMessage(msg)
    }

    // highlight message for user
    const handleHighlightMessage = (msgId) => {
        setHighlightMessageId(msgId)
        window.location.href = `/#${msgId}`
        setTimeout(() => {
            setHighlightMessageId('')
        }, 1500)
    }

    // show reply button for the messages when user clicked and hides after certain time
    const handleReplyOption = (msgId) => {
        setActiveReplyMessageId(msgId)
        setTimeout(() => {
            setActiveReplyMessageId(null)
        }, 2000)
    }

    return (
        <div className="h-full px-1 pt-5 overflow-auto overflow-x-hidden">
            <div className="flex flex-col relative">
                {messages.map((msg, index) => {
                    const isSelf = msg.self;
                    return (
                        <div
                            onClick={() => handleReplyOption(msg._id)}
                            id={msg._id}
                            key={index}
                            className={`px-3 py-3 flex items-end gap-x-2 ${isSelf ? 'justify-start flex-row-reverse' : 'justify-start'} ${highlightMessageId === msg._id ? 'bg-gray-800 rounded-md' : ""} group`}
                        >
                            <div
                                className="w-10 h-10"
                                dangerouslySetInnerHTML={{ __html: isSelf ? JSON.parse(localStorage.getItem("user")).profileImage : chatPerson.profileImage }}
                            />
                            <div
                                className={`max-w-md text-white font-medium w-fit px-3 py-2 ${isSelf
                                    ? 'border border-[#34a853] bg-[#34a85354] rounded-t-2xl rounded-l-2xl'
                                    : 'border border-[#673ab7] bg-[#683ab765] rounded-t-2xl rounded-r-2xl'
                                    } flex flex-col gap-y-2`}
                            >
                                <div onClick={() => handleHighlightMessage(msg.replyMessage?._id)} className={`${msg.replyMessage?.message ? 'block' : "hidden"} ${isSelf ? "bg-[#34a853]" : "bg-[#673ab7]"} -mt-0.5 -mx-1.5 rounded-t-xl px-2 py-1 cursor-pointer text-sm break-words`}>
                                    <span className={`${isSelf ? "text-[hsl(136,53%,20%)]" : "text-[hsl(262,52%,20%)]"} break-words`}>
                                        {msg.replyMessage?.sender === JSON.parse(localStorage.getItem("user"))?._id
                                            ? "You"
                                            : chatPerson?.username}
                                    </span>
                                    <br />
                                    {formatMessage(msg.replyMessage?.message)}
                                </div>

                                <div className='break-words'>{formatMessage(msg.message)}</div>
                                <span className={`self-end text-xs font-extrabold ${isSelf ? "text-[#34a853]" : "text-[#673ab7]"}`}>{moment(msg.time).calendar()}</span>
                            </div>
                            <div className={`group-hover:block self-center cursor-pointer ${msg._id === activeReplyMessageId ? "block" : "hidden"}`} onClick={() => handleReply(msg)}><FaReply size={17} /></div>
                        </div>
                    );
                })}
                {
                    typingUserId === chatPerson._id &&
                    <div className='flex items-end gap-x-2 transition-all delay-3000'>
                        <div
                            className="w-10 h-10"
                            dangerouslySetInnerHTML={{ __html: chatPerson.profileImage }}
                        />
                        <div className='max-w-md text-white font-medium w-fit px-3 py-2 bg-[#673ab7] rounded-t-2xl rounded-r-2xl'>
                            <span className='dotSpan'>.</span><span className='dotSpan'>.</span><span className='dotSpan'>.</span>
                        </div>
                    </div>
                }
                {
                    messages?.length === 0 ? <DefaultChat /> : ''
                }
                <div ref={scrollButton} onClick={() => scroll.current?.scrollIntoView({ behavior: 'instant' })} className='fixed bottom-42 self-center bg-[#fbbd0563] border-1 border-[#fbbc05] w-7 h-7  flex items-center justify-center rounded-full cursor-pointer'><FaChevronDown size={20} /></div>
                <div ref={scroll}></div>
            </div>
        </div>
    );
};

export default ChatMessage;
