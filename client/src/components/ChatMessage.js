import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import moment from 'moment'
import DefaultChat from './DefaultChat';

const ChatMessage = ({ latestSelfMessage, chatPerson, socketRef }) => {
    const [messages, setMessages] = useState([]);
    const [typingUserId, setTypingUserId] = useState(null)
    const scroll = useRef();

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
        setMessages(prev => [...prev, { self: true, message: latestSelfMessage.message, time: latestSelfMessage.time }])
    }, [latestSelfMessage])

    // listening for chat person messages
    useEffect(() => {
        const socket = socketRef.current
        const handleReceive = (data) => {
            if (data.sender._id === chatPerson._id) {
                setMessages(prev => [...prev, { self: false, message: data.message, time: new Date() }]);
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
                // Auto-hide typing after 2s
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
        scroll.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="h-[90%] px-5 pt-5 overflow-auto">
            <div className="flex flex-col gap-y-3">
                {messages.map((msg, index) => {
                    const isSelf = msg.self;
                    return (
                        <div
                            key={index}
                            className={`flex items-end gap-x-2 ${isSelf ? 'justify-start flex-row-reverse' : 'justify-start'}`}
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
                                {msg.message} <br />
                                <span className='self-end text-xs'>{moment(msg.time).calendar()}</span>
                            </div>
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
                    messages?.length == 0 ? <DefaultChat /> : ''
                }
                <div ref={scroll}></div>
            </div>
        </div>
    );
};

export default ChatMessage;
