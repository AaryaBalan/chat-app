import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import moment from 'moment'

const ChatMessage = ({ latestSelfMessage, chatPerson, socketRef }) => {
    const [messages, setMessages] = useState([]);
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
        const handleReceive = (data) => {
            setMessages(prev => [...prev, { self: false, message: data, time: new Date() }]);
        };
        socketRef.current.on('recieveMessage', handleReceive);
        return () => {
            socketRef.current.off('recieveMessage', handleReceive);
        };
    }, []);

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
                                    ? 'bg-[#34a853] rounded-t-2xl rounded-l-2xl'
                                    : 'bg-[#673ab7] rounded-t-2xl rounded-r-2xl'
                                    } flex flex-col gap-y-2`}
                            >
                                {msg.message} <br />
                                <span className='self-end text-xs'>{moment(msg.time).calendar()}</span>
                            </div>
                        </div>
                    );
                })}
                <div ref={scroll}></div>
            </div>
        </div>
    );
};

export default ChatMessage;
