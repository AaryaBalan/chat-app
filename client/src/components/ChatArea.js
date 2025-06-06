import React from 'react'

const ChatArea = ({ chatPerson }) => {
    console.log(chatPerson)
    return (
        <>
            <div className='h-full w-full flex flex-col justify-between text-white'>
                <div className='bg-[#673ab7] px-5 py-2 flex items-center gap-x-5'>
                    <div
                        className="w-12 h-12 md:w-16 md:h-16"
                        dangerouslySetInnerHTML={{ __html: chatPerson?.profileImage }}
                    />
                    <h2 className="text-white text-base md:text-lg font-semibold truncate uppercase">{chatPerson?.username}</h2>
                </div>
                <div className='h-full bg-[#202123]'></div>
            </div>
        </>
    )
}

export default ChatArea