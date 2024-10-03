import FormContainer from '@/components/FormContainer'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { role } from '@/lib/data'
import prisma from '@/lib/prisma'
import { ITEMS_PER_PAGE } from '@/lib/settings'
import { Prisma, Subject, Teacher } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

const columns = [
    {
        header: "Subject Name",
        accessor: "subjectName"
    },
    {
        header: "Teachers",
        accessor: "teachers",
        className: "hidden sm:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },
]

type SubjectList = Subject & { teachers: Teacher[] }
const renderRow = (item: SubjectList) => (
    <tr
        key={item.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight'
    >
        <td className='flex items-center gap-4 p-4'>

            <div className='flex flex-col'>
                <h3 className='font-semibold'>{item.name}</h3>
            </div>
        </td>
        <td className="hidden sm:table-cell text-xs">{item.teachers.map(teacher => teacher.name).join(", ")}</td>
        <td>
            <div className='flex items-center gap-2'>
                {
                    role === 'admin' && (
                        <>
                            <FormContainer
                                table='subject'
                                type='update'
                                data={item}
                            />
                            <FormContainer
                                table='subject'
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
const SubjectsListPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined }
}) => {

    const p = searchParams.page ? parseInt(searchParams.page) : 1
    const { ...queryParams } = searchParams

    const filter: Prisma.SubjectWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined) {
                switch (key) {
                    case 'search':
                        filter.name = { contains: value, mode: "insensitive" }
                        break;
                    default:
                        break;
                }
            }
        }
    }
    const [data, count] = await prisma.$transaction([
        prisma.subject.findMany({
            where: filter,
            include: {
                teachers: true
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.subject.count({ where: filter })
    ])
    return (
        <div className='bg-white rounded-md p-4 m-4 mt-0'>
            {/* TOP */}
            <div className='flex justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Subjects</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter subject img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort subject img'
                                width={14}
                                height={14}
                            />
                        </button>
                        {
                            role === 'admin' && (
                                <FormContainer
                                    table='subject'
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

export default SubjectsListPage