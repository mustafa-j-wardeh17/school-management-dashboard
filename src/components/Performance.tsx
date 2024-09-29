'use client'
import Image from 'next/image';
import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Group A', value: 92, fill: '#C3EBFA' },
    { name: 'Group B', value: 8, fill: '#FAE27C' },
];
const Performance = () => {
    return (
        <div className='bg-white p-4 rounded-md h-80 relative'>
            <div className='flex w-full items-center justify-between'>
                <h1 className='text-xl font-semibold'>Performance</h1>
                <Image
                    src={'/moreDark.png'}
                    alt='more img'
                    width={16}
                    height={16}
                />
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        fill="#8884d8"
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
                <h1 className='text-3xl font-bold'>9.2</h1>
                <p className='text-xs text-gray-300'>of 10 max</p>
            </div>
            <h2 className='absolute bottom-16 text-center left-0 right-0 m-auto font-medium'>1st Semester - 2nd Semester</h2>
        </div>
    )
}

export default Performance