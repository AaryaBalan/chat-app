import React from 'react'
import robot from '../assets/robot.gif'

const DefaultChat = () => {
    return (
        <div className='bg-[#131324] w-full h-full flex flex-col justify-center items-center'>
            <div className='text-xl font-bold border-2 bg-[#34a8533f] border-[#34a853] px-3 py-1 rounded text-white mt-7'>Start the converstion</div>
            <img src={robot} alt="" className='bg-transparent w-[80%]' />
        </div>
    )
}

export default DefaultChat