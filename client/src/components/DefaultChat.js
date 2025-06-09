import React from 'react'
import robot from '../assets/robot.gif'

const DefaultChat = () => {
    return (
        <>
            <div className='bg-[#202123] h-full w-full flex flex-col justify-end items-end text-white'>
                <h1 className='self-center text-3xl font-bold tracking-widest'>Start Conversation</h1>
                <img src={robot} alt="start chat" className='' />
            </div>
        </>
    )
}

export default DefaultChat