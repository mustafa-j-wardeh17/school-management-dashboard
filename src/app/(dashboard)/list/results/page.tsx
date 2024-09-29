import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { resultsData, role } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const columns = [
    {
        header: "Subject",
        accessor: "subject"
    },
    {
        header: "Student",
        accessor: "student",
        className: "sm:table-cell hidden",
    },
    {
        header: "Score",
        accessor: "score",
        className: "sm:table-cell hidden",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "sm:table-cell hidden",
    },
    {
        header: "Class",
        accessor: "class",
        className: "sm:table-cell hidden",
    },
    {
        header: "Date",
        accessor: "date",
        className: "table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },
]
export type Result = {
    id: number;
    subject: string;
    class: string;
    teacher: string;
    student: string;
    score: number;
    date: string
    type: "exam" | "assignment"
}
const ResultsListPage = () => {
    const renderRow = (item: Result) => (
        <tr
            key={item.id}
            className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight'
        >
            <td className='flex items-center gap-4 p-4'>

                <div className='flex flex-col'>
                    <h3 className='font-semibold'>{item.subject}</h3>
                </div>
            </td>
            <td className="hidden sm:table-cell text-xs">{item.student}</td>
            <td className="hidden sm:table-cell text-xs">{item.score}</td>
            <td className="hidden sm:table-cell text-xs">{item.teacher}</td>
            <td className="hidden sm:table-cell text-xs">{item.class}</td>
            <td className="table-cell text-xs">{item.date}</td>
            <td>
                <div className='flex items-center gap-2'>
                    {
                        role === 'admin' && (
                            <>
                                <FormModal
                                    table='result'
                                    type='update'
                                    data={item}
                                />
                                <FormModal
                                    table='result'
                                    type='delete'
                                    id={item.id}
                                />
                            </>

                        )
                    }
                </div>
            </td>
        </tr>
    )
    return (
        <div className='bg-white rounded-md p-4 m-4 mt-0'>
            {/* TOP */}
            <div className='flex justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Results</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter result img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort result img'
                                width={14}
                                height={14}
                            />
                        </button>
                        {
                            role === 'admin' && (
                                <FormModal
                                    table='result'
                                    type='create'
                                />
                            )
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table
                columns={columns}
                renderRow={renderRow}
                data={resultsData}
            />
            {/* PAGINATION */}
            <Pagination />
        </div>
    )
}

export default ResultsListPage