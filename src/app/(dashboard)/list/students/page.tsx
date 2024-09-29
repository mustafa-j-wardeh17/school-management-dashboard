import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { role, studentsData } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const columns = [
    {
        header: "Info",
        accessor: "info"
    },
    {
        header: "Student ID",
        accessor: "studentId",
        className: "hidden md:table-cell",
    },
    {
        header: "Grade",
        accessor: "grade",
        className: "hidden md:table-cell",
    },
    {
        header: "Phone",
        accessor: "phone",
        className: "hidden lg:table-cell",
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
export type Student = {
    id: number;
    name: string;
    photo: string;
    class: string;
    email?: string;
    studentId: string;
    grade: number;
    phone?: string;
    address: string;
}
const StudentsListPage = () => {
    const renderRow = (item: Student) => (
        <tr
            key={item.id}
            className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight'
        >
            <td className='flex items-center gap-4 p-4'>
                <Image
                    src={item.photo}
                    alt={`photo for ${item.id}`}
                    width={40}
                    height={40}
                    className='md:hidden xl:block w-10 h-10 rounded-full object-cover'
                />
                <div className='flex flex-col'>
                    <h3 className='font-semibold'>{item.name}</h3>
                    <p className='text-xs text-gray-500'>{item?.class}</p>
                </div>
            </td>
            <td className="hidden md:table-cell text-xs">{item.studentId}</td>
            <td className="hidden md:table-cell text-xs">{item.grade}</td>
            <td className="hidden lg:table-cell text-xs">{item.phone}</td>
            <td className="hidden lg:table-cell text-xs">{item.address}</td>
            <td>
                <div className='flex items-center gap-2'>
                    <Link href={`/list/students/${item.id}`}>
                        <button className='w-7 h-7 rounded-full flex items-center justify-center bg-mSky'>
                            <Image
                                src={'/view.png'}
                                alt={`${item.id} student`}
                                width={16}
                                height={16}
                            />
                        </button>
                    </Link>
                    {
                        role === 'admin' && (
                            <FormModal
                                table='student'
                                type='delete'
                                id={item.id}
                            />
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
                <h1 className='hidden md:block text-lg font-semibold'>All Student</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter student img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort student img'
                                width={14}
                                height={14}
                            />
                        </button>
                        {
                            role === 'admin' && (
                                <FormModal
                                    table='student'
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
                data={studentsData}
            />
            {/* PAGINATION */}
            <Pagination />
        </div>
    )
}

export default StudentsListPage