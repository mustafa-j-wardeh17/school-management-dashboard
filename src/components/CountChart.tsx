'use client'
import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';



const CountChart = ({ boys, girls }: { boys: number, girls: number }) => {
    const data = [
        {
            name: 'Total',
            count: boys + girls,
            fill: 'white',
        },
        {
            name: 'Girls',
            count: girls,
            fill: '#FAE27C',
        },
        {
            name: 'Boys',
            count: boys,
            fill: '#C3EBFA',
        },
    ];
    return (
        <ResponsiveContainer>
            <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
                <RadialBar
                    background
                    dataKey="count"
                />
            </RadialBarChart>
        </ResponsiveContainer>
    )
}

export default CountChart