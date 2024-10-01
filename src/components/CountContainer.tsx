import Image from 'next/image'
import React from 'react'
import CountChart from './CountChart'
import prisma from '@/lib/prisma'

const CountContainer = async () => {

    const girls = await prisma.student.count({
        where: {
            sex: 'FEMALE'
        }
    }) || 0
    const boys = await prisma.student.count({
        where: {
            sex: 'MALE'
        }
    }) || 0
    return (
        <div className='bg-white rounded-xl w-full h-full p-4'>

            {/* TITLE */}
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Students</h1>
                <Image
                    src={'/moreDark.png'}
                    alt='more dark img'
                    width={20}
                    height={20}
                />
            </div>

            {/* CHART */}
            <div className='relative w-full h-[75%]'>
                <CountChart
                    boys={boys}
                    girls={girls}
                />
                <Image
                    src={'/maleFemale.png'}
                    alt='sex type'
                    width={50}
                    height={50}
                    className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                />
            </div>

            {/* BOTTOM */}
            <div className='flex justify-center gap-16'>
                <div className='flex flex-col gap-1'>
                    <div className='bg-mSky rounded-full w-5 h-5' />
                    <h1 className='font-bold'>{boys}</h1>
                    <h2 className='text-xs text-gray-300'>Boys ({((boys / (boys + girls)) * 100).toFixed(0)}%)</h2>
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='bg-mYellow rounded-full w-5 h-5' />
                    <h1 className='font-bold'>{girls}</h1>
                    <h2 className='text-xs text-gray-300'>Girls ({((girls / (boys + girls)) * 100).toFixed(0)}%)</h2>
                </div>
            </div>
        </div>
    )
}

export default CountContainer