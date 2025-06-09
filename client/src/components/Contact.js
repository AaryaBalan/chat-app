import React, { useEffect, useState } from 'react';

const Contact = ({ latestMessage, setLatestMessage, socketRef, setUserList, userList, currentUser, handleChatPerson, chatPerson, onlineUsers }) => {
    console.log(latestMessage)

    function handleChatChange(user) {
        handleChatPerson(user)
    }
    const [typingUserId, setTypingUserId] = useState(undefined)

    useEffect(() => {
        if (!socketRef.current) return;
        const socket = socketRef.current;
        const handleTyping = ({ typingUser, waitingUser }) => {
            setTypingUserId(typingUser);
            setTimeout(() => {
                setTypingUserId(null);
            }, 3000);
        };
        socket.on('typing', handleTyping);
        return () => {
            socket.off('typing', handleTyping);
        };
    }, [socketRef]);

    useEffect(() => {
        if (!socketRef.current) return;
        const socket = socketRef.current
        socket.on('recieveMessage', data => {
            console.log(data)
            setUserList(prev => {
                const filtered = prev.filter(user => user._id !== data.sender._id)
                return [data.sender, ...filtered]
            })
            console.log('d', data)
            setLatestMessage(data)
        })
    }, [socketRef, latestMessage, setLatestMessage, setUserList])



    return (
        <div className="flex flex-col gap-y-5 h-full w-full">
            {/* Scrollable Contact List */}
            <div className="flex flex-col gap-y-4 overflow-y-auto h-[100vh] md:h-[100vh] pr-2 text-white">
                {userList.map((user, index) => (
                    <div
                        onClick={() => handleChatChange(user)}
                        key={index}
                        className={`cursor-pointer bg-[#202123] p-4 rounded-lg flex items-center gap-4 w-full hover:bg-[#fbbc05] hover:text-black transition ${chatPerson?._id === user?._id ? "bg-[#fbbc05] text-black" : ""}`}
                    >
                        <div className='relative'>
                            <div
                                className="w-12 h-12 md:w-16 md:h-16"
                                dangerouslySetInnerHTML={{ __html: user.profileImage }}
                            />
                            <div className={`absolute -right-1 bottom-0.5 rounded-full  ${onlineUsers.includes(user._id) ? "w-4 h-4 bg-[#1cd14f]" : ""}`}></div>
                        </div>
                        <div className='truncate'>
                            <h2 className="text-base md:text-lg font-semibold truncate text-inherit">{user.username}</h2>
                            {/* <div className='text-[#1cd14f]'>{typingUserId === user._id && "Typing..."}</div> */}
                            {typingUserId === user._id ?
                                <div className='text-[#1cd14f] flex gap-x-2'>
                                    <span className='dotSpan'>a</span><span className='dotSpan'>b</span><span className='dotSpan'>c</span>
                                </div> :
                                <div>{user?.lastMessage}</div>
                            }
                        </div>
                    </div>
                ))}
            </div>

            {/* Current User Display */}
            <div className="mt-4 bg-[#ea4335] p-4 rounded-lg flex items-center gap-4 w-full shrink-0">
                <div
                    className="w-12 h-12 md:w-16 md:h-16"
                    dangerouslySetInnerHTML={{ __html: currentUser?.profileImage }}
                />
                <h2 className="text-white text-base md:text-lg font-semibold truncate">{currentUser?.username}</h2>
            </div>
        </div >
    );
};

export default Contact;
