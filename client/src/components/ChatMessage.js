import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatMessage = ({ chatPerson }) => {
    const [messages, setMessages] = useState([]);

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
        getAllMessage();
    }, [chatPerson]);

    return (
        <div className="h-[90%] m-5 overflow-auto">
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
                                    }`}
                            >
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChatMessage;
