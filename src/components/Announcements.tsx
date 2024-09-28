import Image from 'next/image'
import React from 'react'

const Announcements = () => {
    return (
        <div className='bg-white rounded-xl w-full p-4'>
            {/* TITLE */}
            <div className='flex justify-between items-center'>
                <h1 className='text-xl font-semibold'>Announcements</h1>
                <span className='capitalize text-xs text-gray-400'>view all</span>
            </div>
            <div className='flex flex-col gap-4 mt-4'>
                <div className='bg-mSkyLight rounded-md p-4'>
                    <div className='flex items-center justify-between'>
                        <h2 className='font-medium'>Lorem ipsum dolor sit amet.</h2>
                        <span className='bg-white text-gray-400 p-1 rounded-md text-xs'>2025-01-01</span>
                    </div>
                    <p className='text-sm text-gray-400 mt-1'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati inventore voluptatem vero!</p>
                </div>
                <div className='bg-mPurpleLight rounded-md p-4'>
                    <div className='flex items-center justify-between'>
                        <h2 className='font-medium'>Lorem ipsum dolor sit amet.</h2>
                        <span className='bg-white text-gray-400 p-1 rounded-md text-xs'>2025-01-01</span>
                    </div>
                    <p className='text-sm text-gray-400 mt-1'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati inventore voluptatem vero!</p>
                </div>
                <div className='bg-mYellowLight rounded-md p-4'>
                    <div className='flex items-center justify-between'>
                        <h2 className='font-medium'>Lorem ipsum dolor sit amet.</h2>
                        <span className='bg-white text-gray-400 p-1 rounded-md text-xs'>2025-01-01</span>
                    </div>
                    <p className='text-sm text-gray-400 mt-1'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati inventore voluptatem vero!</p>
                </div>
            </div>

        </div>
    )
}

export default Announcements