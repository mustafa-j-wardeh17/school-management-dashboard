import FormContainer from '@/components/FormContainer'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import prisma from '@/lib/prisma'
import { ITEMS_PER_PAGE } from '@/lib/settings'
import { auth } from '@clerk/nextjs/server'
import { Parent, Prisma, Student } from '@prisma/client'
import Image from 'next/image'
import React from 'react'


const ParentsListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const { sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const columns = [
        {
            header: "Info",
            accessor: "info"
        },
        {
            header: "Student Names",
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
        ...(role === 'admin' ?
            [
                {
                    header: "Actions",
                    accessor: "actions",
                }
            ]
            : []
        )
    ]

    type ParentList = Parent & { students: Student[] };
    const renderRow = (item: ParentList) => (
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
            <td className="hidden sm:table-cell text-xs">
                {item.students.map((student) => student.name).join(", ")}
            </td>
            <td className="hidden md:table-cell text-xs">{item.phone}</td>
            <td className="hidden lg:table-cell text-xs">{item.address}</td>
            <td>
                <div className='flex items-center gap-2'>

                    {
                        role === 'admin' && (
                            <>
                                <FormContainer
                                    table='parent'
                                    type='update'
                                    data={item}
                                />
                                <FormContainer
                                    table='parent'
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

    const { page, ...queryParams } = searchParams
    const p = page ? parseInt(page) : 1
    const filter: Prisma.ParentWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined) {
                switch (key) {
                    case "search":
                        filter.name = { contains: value, mode: 'insensitive' }
                        break
                    default:
                        break
                }
            }
        }
    }
    const [data, count] = await prisma.$transaction([
        prisma.parent.findMany({
            where: filter,
            include: {
                students: true
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.parent.count({
            where: filter,
        })
    ])
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
                        {
                            role === 'admin' && (
                                <FormContainer
                                    table='parent'
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
                data={data}
            />
            {/* PAGINATION */}
            <Pagination
                page={p}
                count={count}
            />
        </div>
    )
}

export default ParentsListPage