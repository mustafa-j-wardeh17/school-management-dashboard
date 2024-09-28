import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { announcementsData, role } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const columns = [
    {
        header: "Title",
        accessor: "subjectName"
    },
    {
        header: "Class",
        accessor: "class",
        className: "sm:table-cell hidden",
    },
    {
        header: "Date",
        accessor: "date",
        className: "sm:table-cell hidden",
    },
    {
        header: "Actions",
        accessor: "actions",
    },
]
export type Announcement = {
    id: number;
    title: string;
    class: string;
    date: string
}
const AnnouncementsListPage = () => {
    const renderRow = (item: Announcement) => (
        <tr
            key={item.id}
            className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight'
        >
            <td className='flex items-center gap-4 p-4'>

                <div className='flex flex-col'>
                    <h3 className='font-semibold'>{item.title}</h3>
                </div>
            </td>
            <td className="hidden sm:table-cell text-xs">{item.class}</td>
            <td className="hidden sm:table-cell text-xs">{item.date}</td>
            <td>
                <div className='flex items-center gap-2'>
                    <Link href={`/list/announcements/${item.id}`}>
                        <button className='w-7 h-7 rounded-full flex items-center justify-center bg-mSky'>
                            <Image
                                src={'/edit.png'}
                                alt={`${item.id} announcement`}
                                width={16}
                                height={16}
                            />
                        </button>
                    </Link>
                    {
                        role === 'admin' && (
                            <button className='w-7 h-7 rounded-full flex items-center justify-center bg-mPurple'>
                                <Image
                                    src={'/delete.png'}
                                    alt={`${item.id} announcement delete`}
                                    width={16}
                                    height={16}
                                />
                            </button>
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
                <h1 className='hidden md:block text-lg font-semibold'>All Announcements</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter announcement img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort announcement img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/plus.png'}
                                alt='add announcement img'
                                width={14}
                                height={14}
                            />
                        </button>
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table
                columns={columns}
                renderRow={renderRow}
                data={announcementsData}
            />
            {/* PAGINATION */}
            <Pagination />
        </div>
    )
}

export default AnnouncementsListPage