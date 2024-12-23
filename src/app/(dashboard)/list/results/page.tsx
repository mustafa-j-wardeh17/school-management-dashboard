import FormContainer from '@/components/FormContainer'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import prisma from '@/lib/prisma'
import { ITEMS_PER_PAGE } from '@/lib/settings'
import { auth } from '@clerk/nextjs/server'
import { Prisma } from '@prisma/client'
import Image from 'next/image'
import React from 'react'


export type ResultList = {
    id: number,
    title: string,
    studentName: string,
    studentSurName: string,
    teacherName: string,
    teacherSurName: string,
    score: string,
    className: string,
    startTime: Date,
    subject: string
}

const ResultsListPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined }
}
) => {
    const { sessionClaims, userId } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;

    const columns = [
        {
            header: "Subject",
            accessor: "subject"
        },
        {
            header: "Student",
            accessor: "student",
            className: "sm:table-cell hidden",
        },
        {
            header: "Score",
            accessor: "score",
            className: "sm:table-cell hidden",
        },
        {
            header: "Subject",
            accessor: "subject",
            className: "sm:table-cell hidden",
        },
        {
            header: "Teacher",
            accessor: "teacher",
            className: "sm:table-cell hidden",
        },

        {
            header: "Class",
            accessor: "class",
            className: "sm:table-cell hidden",
        },
        {
            header: "Date",
            accessor: "date",
            className: "table-cell",
        },
        ...((role === "admin" || role === 'teacher')
            ? [{
                header: "Actions",
                accessor: "actions",
            }]
            : []
        )
    ]

    const renderRow = (item: ResultList) => (
        <tr
            key={item?.id}
            className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight'
        >
            <td className='flex items-center gap-4 p-4'>

                <div className='flex flex-col'>
                    <h3 className='font-semibold'>{item?.title}</h3>
                </div>
            </td>
            <td className="hidden sm:table-cell text-xs">{item?.studentName + " " + item?.studentSurName}</td>
            <td className="hidden sm:table-cell text-xs">{item?.score}</td>
            <td className="hidden sm:table-cell text-xs">{item?.subject}</td>
            <td className="hidden sm:table-cell text-xs">{item?.teacherName + " " + item?.teacherSurName}</td>
            <td className="hidden sm:table-cell text-xs">{item?.className}</td>
            <td className="table-cell text-xs">
                {new Intl.DateTimeFormat('en-US').format(item?.startTime)}
            </td>
            <td>
                <div className='flex items-center gap-2'>
                    {
                        (role === 'admin' || role === 'teacher') && (
                            <>
                                <FormContainer
                                    table='result'
                                    type='update'
                                    data={item}
                                />
                                <FormContainer
                                    table='result'
                                    type='delete'
                                    id={item?.id}
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
    const filter: Prisma.ResultWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "studentId":
                        filter.studentId = value
                        break;
                    case "search":
                        filter.OR = [
                            { exam: { title: { contains: value, mode: 'insensitive' } } },
                            { assignment: { title: { contains: value, mode: 'insensitive' } } },
                            { student: { name: { contains: value, mode: 'insensitive' } } },
                            { student: { surname: { contains: value, mode: 'insensitive' } } },
                        ]
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // ROLE CONSDITIONS
    switch (role) {
        case "admin":
            break;
        case "teacher":
            filter.OR = [
                { exam: { lesson: { teacherId: currentUserId! } } },
                { assignment: { lesson: { teacherId: currentUserId! } } }
            ]
            break;
        case "student":
            filter.studentId = currentUserId!;
            break;
        case "parent":
            filter.student = { parentId: currentUserId! }
            break;
        default:
            break;
    }



    const [dataRes, count] = await prisma.$transaction([
        prisma.result.findMany({
            where: filter,
            include: {
                student: { select: { name: true, surname: true } },
                exam: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true, surname: true } },
                                subject: { select: { name: true } },
                            }
                        }
                    }
                },
                assignment: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true, surname: true } },
                                subject: { select: { name: true } },
                            }
                        }
                    }
                }
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1),
        }),
        prisma.result.count({ where: filter }),
    ]);


    const data = dataRes.map(item => {
        const assessment = item?.exam || item?.assignment
        if (!assessment) return null
        const isExam = "startTime" in assessment;
        return {
            id: item?.id,
            title: assessment.title,
            studentName: item?.student.name,
            studentSurName: item?.student.surname,
            teacherName: assessment.lesson.teacher.name,
            teacherSurName: assessment.lesson.teacher.surname,
            score: item?.score,
            className: assessment.lesson.class.name,
            startTime: isExam ? assessment.startTime : assessment.startDate,
            subject: isExam ? assessment.lesson.subject.name : assessment.lesson.subject.name
        }
    });
    return (
        <div className='bg-white rounded-md p-4 m-4 mt-0'>
            {/* TOP */}
            <div className='flex justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Results</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter result img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort result img'
                                width={14}
                                height={14}
                            />
                        </button>
                        {
                            (role === 'admin' || role === 'teacher') && (
                                <FormContainer
                                    table='result'
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

export default ResultsListPage