import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { parentsData, role } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const columns = [
    {
        header: "Info",
        accessor: "info"
    },
    {
        header: "Student Name",
        accessor: "students",
        className: "hidden sm:table-cell",
    },
    {
        header: "Phone",
        accessor: "phone",
        className: "hidden md:table-cell",
    },
    {
        header: "Address",
        accessor: "address",
        className: "hidden lg:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },
]
export type Parent = {
    id: number;
    name: string;
    email?: string;
    students: string[];
    phone?: string;
    address: string;
}
const ParentsListPage = () => {
    const renderRow = (item: Parent) => (
        <tr
            key={item.id}
            className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight'
        >
            <td className='flex items-center gap-4 p-4'>
                <div className='flex flex-col'>
                    <h3 className='font-semibold'>{item.name}</h3>
                    <p className='text-xs text-gray-500'>{item?.email}</p>
                </div>
            </td>
            <td className="hidden sm:table-cell text-xs">{item.students.join(", ")}</td>
            <td className="hidden md:table-cell text-xs">{item.phone}</td>
            <td className="hidden lg:table-cell text-xs">{item.address}</td>
            <td>
                <div className='flex items-center gap-2'>
                    <Link href={`/list/parents/${item.id}`}>
                        <button className='w-7 h-7 rounded-full flex items-center justify-center bg-mSky'>
                            <Image
                                src={'/view.png'}
                                alt={`${item.id} parent`}
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
                                    alt={`${item.id} parent delete`}
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
                <h1 className='hidden md:block text-lg font-semibold'>All Parents</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter parents img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort parents img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/plus.png'}
                                alt='add parents img'
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
                data={parentsData}
            />
            {/* PAGINATION */}
            <Pagination />
        </div>
    )
}

export default ParentsListPage