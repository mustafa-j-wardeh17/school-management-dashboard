import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { classesData, role } from '@/lib/data'
import prisma from '@/lib/prisma'
import { ITEMS_PER_PAGE } from '@/lib/settings'
import { Class, Grade, Prisma, Teacher } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

const columns = [
    {
        header: "Class Name",
        accessor: "className"
    },
    {
        header: "Capacity",
        accessor: "capacity",
        className: "hidden sm:table-cell",
    },
    {
        header: "Grade",
        accessor: "grade",
        className: "table-cell",
    },
    {
        header: "Supervisor",
        accessor: "supervisor",
        className: "hidden md:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },
]
type ClassList = Class & { supervisor: Teacher } & { grade: Grade }
const renderRow = (item: ClassList) => (
    <tr
        key={item.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight'
    >
        <td className='flex items-center gap-4 p-4'>

            <div className='flex flex-col'>
                <h3 className='font-semibold'>{item.name}</h3>
            </div>
        </td>
        <td className="hidden sm:table-cell text-xs">{item.capacity}</td>
        <td className="table-cell text-xs">{item.grade.level}</td>
        <td className="hidden md:table-cell text-xs">{item.supervisor.name + " " + item.supervisor.surname}</td>
        <td>
            <div className='flex items-center gap-2'>
                {
                    role === 'admin' && (
                        <>
                            <FormModal
                                table='class'
                                type='update'
                                data={item}
                            />
                            <FormModal
                                table='class'
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
const ClassesListPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const { page, ...queryParams } = searchParams
    const p = page ? parseInt(page) : 1

    const filter: Prisma.ClassWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined) {
                switch (key) {
                    case 'supervisorId':
                        filter.supervisorId = value
                        break;
                    case 'search':
                        filter.name = { contains: value, mode: 'insensitive' }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.class.findMany({
            where: filter,
            include: {
                supervisor: true,
                grade: true
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.class.count({
            where: filter
        })
    ])
    return (
        <div className='bg-white rounded-md p-4 m-4 mt-0'>
            {/* TOP */}
            <div className='flex justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Classes</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter class img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort class img'
                                width={14}
                                height={14}
                            />
                        </button>
                        {
                            role === 'admin' && (
                                <FormModal
                                    table='class'
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

export default ClassesListPage