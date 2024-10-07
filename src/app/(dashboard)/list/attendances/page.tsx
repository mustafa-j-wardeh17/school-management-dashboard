import FormContainer from '@/components/FormContainer'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import prisma from '@/lib/prisma'
import { ITEMS_PER_PAGE } from '@/lib/settings'
import { auth } from '@clerk/nextjs/server'
import { Attendance, Lesson, Prisma, Student } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

export type AttendanceList = Attendance & { student: Student } & { lesson: Lesson }

const AttendanceListPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined }
}) => {

    const { sessionClaims, userId } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;



    const columns = [
        {
            header: "Student",
            accessor: "studentName"
        },
        {
            header: "Lesson",
            accessor: "lesson",
            className: "sm:table-cell hidden",
        },
        {
            header: "Attendance",
            accessor: "attendance",
            className: "sm:table-cell hidden",
        },
        {
            header: "Date",
            accessor: "date",
            className: "sm:table-cell hidden",
        },
        ...(role === "admin"
            ? [{
                header: "Actions",
                accessor: "actions",
            }]
            : []
        )
    ]

    const renderRow = (item: AttendanceList) => (
        <tr
            key={item.id}
            className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight'
        >
            <td className='flex items-center gap-4 p-4'>

                <div className='flex flex-col'>
                    <h3 className='font-semibold'>{item.student?.name}</h3>
                </div>
            </td>
            <td className="hidden sm:table-cell text-xs">
                {item.lesson.name}
            </td>
            <td className="hidden sm:table-cell text-xs">{item.present ? 'true' : 'false'}</td>

            <td className="hidden sm:table-cell text-xs">
                {new Intl.DateTimeFormat('en-US').format(item.date)}
            </td>
            <td>
                <div className='flex items-center gap-2'>
                    {
                        role === 'admin' && (
                            <>
                                <FormContainer
                                    table='attendance'
                                    type='update'
                                    data={item}
                                />
                                <FormContainer
                                    table='attendance'
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
    const filter: Prisma.AttendanceWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined) {
                switch (key) {
                    case "search":
                        filter.OR = [
                            { student: { name: { contains: value, mode: 'insensitive' } } },
                            { lesson: { name: { contains: value, mode: 'insensitive' } } }
                        ]
                        break
                    default:
                        break
                }
            }
        }
    }
    // ROLE CONDITIONS
    switch (role) {
        case 'admin':
            break;
        case 'teacher':
            filter.OR = [
                { lesson: { teacherId: currentUserId! } },
            ]
            break;
        case 'student':
            filter.OR = [
                { studentId: currentUserId! },
            ]
            break;
        case 'parent':
            filter.OR = [
                { student: { parentId: currentUserId! } },
            ]
            break;
        default:
            break;
    }

    const [data, count] = await prisma.$transaction([
        prisma.attendance.findMany({
            where: filter,
            include: {
                student: { select: { name: true } },
                lesson: { select: { name: true } },
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.attendance.count({
            where: filter,
        })
    ])
    return (
        <div className='bg-white rounded-md p-4 m-4 mt-0'>
            {/* TOP */}
            <div className='flex justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Attendance</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter attendance img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort attendance img'
                                width={14}
                                height={14}
                            />
                        </button>
                        {
                            role === 'admin' && (
                                <FormContainer
                                    table='attendance'
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

export default AttendanceListPage