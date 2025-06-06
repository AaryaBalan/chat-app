import React from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

const ChatArea = ({ chatPerson }) => {
    // console.log(chatPerson)
    return (
        <>
            <div className='h-full w-full flex flex-col justify-between text-white'>
                <div className='bg-[#673ab7] px-5 py-2 flex items-center gap-x-5 rounded-t-2xl'>
                    <div
                        className="w-12 h-12 md:w-16 md:h-16"
                        dangerouslySetInnerHTML={{ __html: chatPerson?.profileImage }}
                    />
                    <h2 className="text-white text-base md:text-lg font-semibold truncate uppercase">{chatPerson?.username}</h2>
                </div>
                <div className='h-full bg-[#202123] flex flex-col overflow-auto rounded-2xl'>
                    <ChatMessage chatPerson={chatPerson} />
                    <ChatInput chatPerson={chatPerson} />
                </div>
            </div>
        </>
    )
}

export default ChatArea