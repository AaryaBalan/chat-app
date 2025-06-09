import React, { useEffect, useState } from 'react';

const Contact = ({ setShowUserInfo, latestMessage, setLatestMessage, socketRef, setUserList, userList, currentUser, handleChatPerson, chatPerson, onlineUsers }) => {

    const [unreadMessage, setUnreadMessage] = useState([])

    function handleChatChange(user) {
        console.log(321, user)
        handleChatPerson(user)
        setShowUserInfo(false)
        if (user._id in unreadMessage) {
            delete unreadMessage[user._id]
        }
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
        const handleRecieveMessage = (data) => {
            setUserList(prev => {
                const filtered = prev.filter(user => user._id !== data.sender._id)
                return [data.sender, ...filtered]
            })
            setLatestMessage(data)
            setUnreadMessage(prev => ({
                ...prev,
                [data.sender._id]: (prev[data.sender._id] || 0) + 1
            }))
        }
        socket.on('recieveMessage', handleRecieveMessage)
        return () => {
            socket.off('recieveMessage', handleRecieveMessage)
        }
    }, [socketRef, latestMessage, setLatestMessage, setUserList])

    return (
        <div className="flex flex-col gap-y-5 h-full w-full">
            {/* Scrollable Contact List */}
            <div className="flex flex-col gap-y-2 overflow-y-auto h-[100vh] md:h-[100vh] pr-2 text-white">
                {userList.map((user, index) => (
                    <div
                        onClick={() => handleChatChange(user)}
                        key={index}
                        className={`cursor-pointer bg-[#131324] p-4 rounded-lg flex items-center gap-4 w-full border-1 hover:border-1 hover:border-[#ea4335] hover:bg-[#ea44354d] transition justify-between ${chatPerson?._id === user?._id ? "bg-[#ea44354d] border-[#ea4335]" : "border-black"}`}
                    >
                        <div className='flex items-center gap-4 truncate'>
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
                                    <div className='truncate text-sm'>{user?.lastMessage}</div>
                                }
                            </div>
                        </div>
                        <div className={`bg-[#1cd14f] w-6 h-6 rounded-full flex items-center justify-center text-black shrink-0 ${user._id in unreadMessage ? 'block' : 'hidden'}`}>{unreadMessage[user._id] < 10 ? unreadMessage[user._id] : '9+'}</div>
                    </div>
                ))}
            </div>

            {/* Current User Display */}
            <div className="mt-4 bg-[#fbbd0563] border-1 border-[#fbbc05] p-4 rounded-lg flex items-center gap-4 w-full shrink-0">
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
