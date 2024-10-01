import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const Navbar = () => {
    return (
        <div className='flex items-center justify-end md:justify-between p-4'>
            {/* Search Side */}
            <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
                <Image
                    src={'/search.png'}
                    alt='search img'
                    width={14}
                    height={14}
                />
                <input
                    type="text"
                    placeholder='search...'
                    className='w-[200px] p-2 bg-transparent outline-none'
                />
            </div>
            {/* Icons And User */}
            <div className='flex items-center gap-6'>
                <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer' >
                    <Image
                        src={'/message.png'}
                        alt='message img'
                        width={20}
                        height={20}
                    />
                </div>
                <div className='bg-white relative rounded-full w-7 h-7 flex items-center justify-center cursor-pointer' >
                    <Image
                        src={'/announcement.png'}
                        alt='announcement img'
                        width={20}
                        height={20}
                    />
                    <div className=' absolute -top-2 -right-2 bg-purple-500 text-xs text-white w-4 h-4 flex items-center justify-center rounded-full '>
                        1
                    </div>
                </div>
                <div className='flex flex-col'>
                    <span className='text-xs leading-3 font-medium'>Mustafa Wardeh</span>
                    <span className='text-right text-[10px] text-gray-500'>Admin</span>
                </div>
                {/* <Image
                    src={'/avatar.png'}
                    alt='avatar img'
                    width={36}
                    height={36}
                    className='rounded-full'
                /> */}
                <UserButton />

            </div>
        </div>
    )
}

export default Navbar