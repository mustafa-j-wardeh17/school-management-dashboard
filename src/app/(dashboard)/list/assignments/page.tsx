import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import prisma from '@/lib/prisma'
import { ITEMS_PER_PAGE } from '@/lib/settings'
import { auth } from '@clerk/nextjs/server'
import { Assignment, Class, Prisma, Subject, Teacher } from '@prisma/client'
import Image from 'next/image'
import React from 'react'



const AssignmentsListPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined }
}
) => {

    const { sessionClaims, userId } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;


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
            header: "Due Date",
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

    type AssignmentList = Assignment & {
        lesson: {
            subject: Subject;
            class: Class;
            teacher: Teacher;
        };
    };
    const renderRow = (item: AssignmentList) => (
        <tr
            key={item.id}
            className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight'
        >
            <td className='flex items-center gap-4 p-4'>

                <div className='flex flex-col'>
                    <h3 className='font-semibold'>{item.lesson.subject.name}</h3>
                </div>
            </td>
            <td className="hidden sm:table-cell text-xs">{item.lesson.class.name}</td>
            <td className="hidden md:table-cell">
                {item.lesson.teacher.name + " " + item.lesson.teacher.surname}
            </td>
            <td className="hidden sm:table-cell text-xs">
                {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
            </td>
            <td>
                <div className='flex items-center gap-2'>
                    {
                        (role === 'admin' || role === 'teacher') && (
                            <>
                                <FormModal
                                    table='assignment'
                                    type='update'
                                    data={item}
                                />
                                <FormModal
                                    table='assignment'
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
    const filter: Prisma.AssignmentWhereInput = {};
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
            filter.lesson.teacherId = currentUserId!;
            break;
        case 'student':
            filter.lesson.class = {
                students: {
                    some: {
                        id: currentUserId!
                    }
                }
            };
            break;
        case 'parent':
            filter.lesson.class = {
                students: {
                    some: {
                        parentId: currentUserId!
                    }
                }
            };
            break;
        default:
            break;
    }
    const [data, count] = await prisma.$transaction([
        prisma.assignment.findMany({
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
        prisma.assignment.count({ where: filter }),
    ]);
    return (
        <div className='bg-white rounded-md p-4 m-4 mt-0'>
            {/* TOP */}
            <div className='flex justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Assignments</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter assignment img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort assignment img'
                                width={14}
                                height={14}
                            />
                        </button>
                        {
                            role === 'admin' || role === 'teacher' && (
                                <FormModal
                                    table='assignment'
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

export default AssignmentsListPage