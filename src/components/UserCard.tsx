import prisma from '@/lib/prisma'
import Image from 'next/image'
import React from 'react'

const UserCard = async ({ type }: { type: 'admin' | 'teacher' | 'student' | 'parent' }) => {

    const modelMap: Record<typeof type, any> = {
        admin: prisma.admin,
        teacher: prisma.teacher,
        student: prisma.student,
        parent: prisma.parent,
    }
    const count = await modelMap[type].count()
    return (
        <div className='rounded-2xl odd:bg-mPurple even:bg-mYellow p-4 flex-1 min-w-[130px]'>
            <div className='flex justify-between items-center'>
                <span className='text-[10px] bg-white px-2 py-1 rounded-full text-green-600'>2024/4/25</span>
                <Image
                    src={'/more.png'}
                    alt='more img'
                    width={20}
                    height={20}
                />
            </div>
            <h1 className='text-2xl font-semibold my-4'>{count}</h1>
            <h1 className='capitalize text-sm font-medium text-gray-500'>{type}</h1>
        </div>
    )
}

export default UserCard