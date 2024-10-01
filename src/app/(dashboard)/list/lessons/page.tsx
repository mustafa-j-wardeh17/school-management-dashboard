import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import prisma from '@/lib/prisma'
import { ITEMS_PER_PAGE } from '@/lib/settings'
import { role } from '@/lib/utils'
import { Class, Lesson, Prisma, Subject, Teacher } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

const columns = [
    {
        header: "Subject Name",
        accessor: "subjectName"
    },
    {
        header: "Class",
        accessor: "class",
        className: "table-cell",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "sm:table-cell hidden",
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
type LessonList = Lesson & { subject: Subject } & { teacher: Teacher } & { class: Class }
const renderRow = (item: LessonList) => (
    <tr
        key={item.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight'
    >
        <td className='flex items-center gap-4 p-4'>

            <div className='flex flex-col'>
                <h3 className='font-semibold'>{item.subject.name}</h3>
            </div>
        </td>
        <td className="table-cell text-xs">{item.class.name}</td>
        <td className="hidden sm:table-cell text-xs">{item.teacher.name + " " + item.teacher.surname}</td>
        <td>
            <div className='flex items-center gap-2'>
                {
                    role === 'admin' && (
                        <>
                            <FormModal
                                table='lesson'
                                type='update'
                                data={item}
                            />
                            <FormModal
                                table='lesson'
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
const LessonListPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined }
}
) => {
    const { page, ...queryParams } = searchParams
    const p = page ? parseInt(page) : 1
    const filter: Prisma.LessonWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined) {
                switch (key) {
                    case "search":
                        filter.OR = [
                            { subject: { name: { contains: value, mode: 'insensitive' } } },
                            { teacher: { name: { contains: value, mode: 'insensitive' } } }
                        ]
                        break
                    case "subjectId":
                        filter.subjectId = parseInt(value)
                        break
                    case "classId":
                        filter.classId = parseInt(value)
                        break
                    case "teacherId":
                        filter.teacherId = value
                        break
                    default:
                        break
                }
            }
        }
    }
    const [data, count] = await prisma.$transaction([
        prisma.lesson.findMany({
            where: filter,
            include: {
                subject: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
                class: { select: { name: true } }
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.lesson.count({
            where: filter,
        })
    ])
    return (
        <div className='bg-white rounded-md p-4 m-4 mt-0'>
            {/* TOP */}
            <div className='flex justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Lessons</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter Lesson img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort Lesson img'
                                width={14}
                                height={14}
                            />
                        </button>
                        {
                            role === 'admin' && (
                                <FormModal
                                    table='lesson'
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

export default LessonListPage