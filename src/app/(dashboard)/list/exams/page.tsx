import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import prisma from '@/lib/prisma'
import { ITEMS_PER_PAGE } from '@/lib/settings'
import { currentUserId, role } from '@/lib/utils'
import { Class, Exam, Prisma, Subject, Teacher } from '@prisma/client'
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
        className: "sm:table-cell hidden",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "sm:table-cell hidden",
    },
    {
        header: "Date",
        accessor: "date",
        className: "sm:table-cell hidden",
    },
    ...((role === "admin" || role === 'teacher')
        ? [{
            header: "Actions",
            accessor: "actions",
        }]
        : []
    )
]
type ExamList = Exam & {
    lesson: {
        subject: Subject;
        class: Class;
        teacher: Teacher;
    };
};
const renderRow = (item: ExamList) => (
    <tr
        key={item.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight'
    >
        <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
        <td className="hidden sm:table-cell text-xs">{item.lesson.class.name}</td>
        <td className="hidden sm:table-cell text-xs">{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
        <td className="hidden md:table-cell">
            {new Intl.DateTimeFormat("en-US").format(item.startTime)}
        </td>
        <td>
            <div className='flex items-center gap-2'>
                {
                    (role === 'admin' || role === 'teacher') && (
                        <>
                            <FormModal
                                table='exam'
                                type='update'
                                data={item}
                            />
                            <FormModal
                                table='exam'
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

const ExamsListPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined }
}
) => {
    const { page, ...queryParams } = searchParams
    const p = page ? parseInt(page) : 1
    const filter: Prisma.ExamWhereInput = {};
    filter.lesson = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "classId":
                        filter.lesson.classId = parseInt(value);
                        break;
                    case "teacherId":
                        filter.lesson.teacherId = value;
                        break;
                    case "search":
                        filter.lesson.OR = [
                            { subject: { name: { contains: value, mode: 'insensitive' } } },
                            { class: { name: { contains: value, mode: 'insensitive' } } },
                            { teacher: { name: { contains: value, mode: 'insensitive' } } },
                            { teacher: { surname: { contains: value, mode: 'insensitive' } } }
                        ]
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // ROLE CONDITIONS

    switch (role) {
        case 'admin':
            break;
        case 'teacher':
            filter.lesson.teacherId = currentUserId!
            break;
        case 'student':
            filter.lesson.class = {
                students: {
                    some: {
                        id: currentUserId!
                    }
                }
            }
            break;
        case 'parent':
            filter.lesson.class = {
                students: {
                    some: {
                        parentId: currentUserId!
                    }
                }
            }
            break;
        default:
            break;
    }
    const [data, count] = await prisma.$transaction([
        prisma.exam.findMany({
            where: filter,
            include: {
                lesson: {
                    select: {
                        subject: { select: { name: true } },
                        teacher: { select: { name: true, surname: true } },
                        class: { select: { name: true } },
                    },
                },
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1),
        }),
        prisma.exam.count({ where: filter }),
    ]);
    return (
        <div className='bg-white rounded-md p-4 m-4 mt-0'>
            {/* TOP */}
            <div className='flex justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Exams</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter exam img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort exam img'
                                width={14}
                                height={14}
                            />
                        </button>
                        {
                            (role === 'admin' || role === 'teacher') && (
                                <FormModal
                                    table='exam'
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

export default ExamsListPage