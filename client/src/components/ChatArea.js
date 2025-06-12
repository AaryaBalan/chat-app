import React, { useState } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import { FaInfo } from "react-icons/fa6";
import UserInfo from './UserInfo';

const ChatArea = ({
    setUnseen,
    showUserInfo,
    setShowUserInfo,
    setLatestMessage,
    setUserList,
    chatPerson,
    socketRef,
    onlineUsers
}) => {

    const [latestSelfMessage, setLatestSelfMessage] = useState({})
    const [isReply, setIsReply] = useState(false)
    const [replyMessage, setReplyMessage] = useState("")

    const handleLatestSelfMessage = (_id, message, time, replyMessage) => {
        setLatestSelfMessage({ _id, message, time, replyMessage })
    }
    return (
        <>
            <div className='h-full w-full flex flex-col justify-between text-white'>
                <div className='bg-[#673ab7] px-5 py-2 flex items-center gap-x-5 rounded-t-2xl justify-between'>
                    <div className='flex items-center gap-x-5'>
                        <div className='relative'>
                            <div
                                className="w-12 h-12 md:w-16 md:h-16"
                                dangerouslySetInnerHTML={{ __html: chatPerson?.profileImage }}
                            />
                            <div className={`absolute -right-1 bottom-0.5 rounded-full  ${onlineUsers.includes(chatPerson._id) ? "w-4 h-4 bg-[#1cd14f]" : ""}`}></div>
                        </div>
                        <h2 className="text-white text-base md:text-lg font-semibold truncate uppercase">{chatPerson?.username}</h2>
                    </div>
                    <div className='bg-[#fbbc05] w-7 h-7 flex items-center justify-center rounded-full cursor-pointer' onClick={() => setShowUserInfo(prev => !prev)}><FaInfo size={20} color='black' /></div>
                </div>
                {
                    !showUserInfo ?
                        <div className='h-full bg-[#131324] flex flex-col overflow-auto rounded-b-2xl'>
                            <ChatMessage
                                setIsReply={setIsReply}
                                setReplyMessage={setReplyMessage}
                                isReply={isReply}
                                replyMessage={replyMessage}
                                chatPerson={chatPerson}
                                socketRef={socketRef}
                                latestSelfMessage={latestSelfMessage}
                            />
                            <ChatInput
                                setUnseen={setUnseen}
                                setIsReply={setIsReply}
                                isReply={isReply}
                                replyMessage={replyMessage}
                                setReplyMessage={setReplyMessage}
                                setLatestMessage={setLatestMessage}
                                setUserList={setUserList}
                                chatPerson={chatPerson}
                                socketRef={socketRef}
                                handleLatestSelfMessage={handleLatestSelfMessage}
                            />
                        </div> :
                        <div className='h-full bg-[#131324] flex flex-col items-center justify-center overflow-auto rounded-b-2xl'>
                            <UserInfo user={chatPerson} />
                        </div>
                }
            </div>
        </>
    )
}

export default ChatArea