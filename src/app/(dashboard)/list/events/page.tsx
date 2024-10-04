import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import prisma from '@/lib/prisma'
import { ITEMS_PER_PAGE } from '@/lib/settings'
import { auth } from '@clerk/nextjs/server'
import { Class, Event, Prisma } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

export type EventList = Event & {
    class: Class
}
const LessonListPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined }
}
) => {

    const { sessionClaims, userId } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;


    const columns = [
        {
            header: "Title",
            accessor: "title"
        },
        {
            header: "Class",
            accessor: "class",
            className: "sm:table-cell hidden",
        },
        {
            header: "Date",
            accessor: "date",
            className: "sm:table-cell hidden",
        },
        {
            header: "Start Time",
            accessor: "startTime",
            className: "md:table-cell hidden",
        },
        {
            header: "End Time",
            accessor: "endTime",
            className: "md:table-cell hidden",
        },

        ...(role === "admin"
            ? [{
                header: "Actions",
                accessor: "actions",
            }]
            : []
        )
    ]

    const renderRow = (item: EventList) => (
        <tr
            key={item.id}
            className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight'
        >
            <td className='flex items-center gap-4 p-4'>

                <div className='flex flex-col'>
                    <h3 className='font-semibold'>{item.title}</h3>
                </div>
            </td>
            <td className="hidden sm:table-cell text-xs">{item.class?.name || "-"}</td>
            <td className="sm:table-cell hidden  text-xs">
                {new Intl.DateTimeFormat("en-US").format(item.startTime)}
            </td>
            <td className="hidden md:table-cell text-xs">
                {new Date(item.startTime).toLocaleTimeString("en-US", {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false // If you want 12-hour format, use false for 24-hour format
                })}
            </td>
            <td className="hidden md:table-cell text-xs">
                {new Date(item.endTime).toLocaleTimeString("en-US", {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false // If you want 12-hour format, use false for 24-hour format
                })}
            </td>
            <td>
                <div className='flex items-center gap-2'>
                    {
                        role === 'admin' && (
                            <>
                                <FormModal
                                    table='event'
                                    type='update'
                                    data={item}
                                />
                                <FormModal
                                    table='event'
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
    const filter: Prisma.EventWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined) {
                switch (key) {
                    case "search":
                        filter.OR = [
                            { title: { contains: value, mode: 'insensitive' } },
                            { class: { name: { contains: value, mode: 'insensitive' } } }
                        ]
                        break
                    default:
                        break
                }
            }
        }
    }
    // --------------------------------------------------------------------
    // --------------------------- First Way ------------------------------
    // --------------------------------------------------------------------
    // ROLE CONDITIONS
    // switch (role) {
    //     case 'admin':
    //         break;
    //     case 'teacher':
    //         filter.OR = [
    //             { classId: null },
    //             { class: { lessons: { some: { teacherId: currentUserId! } } } },
    //         ]
    //         break;
    //     case 'student':
    //         filter.OR = [
    //             { classId: null },
    //             { class: { students: { some: { id: currentUserId! } } } },
    //         ]
    //         break;
    //     case 'parent':
    //         filter.OR = [
    //             { classId: null },
    //             { class: { students: { some: { parentId: currentUserId! } } } },
    //         ]
    //         break;
    //     default:
    //         break;
    // }

    // --------------------------------------------------------------------
    // --------------------------- Second Way------------------------------
    // --------------------------------------------------------------------

    // ROLE CONDITIONS

    const roleConditions = {
        teacher: { lessons: { some: { teacherId: currentUserId! } } },
        student: { students: { some: { id: currentUserId! } } },
        parent: { students: { some: { parentId: currentUserId! } } },
    };

    filter.OR = [
        { classId: null },
        {
            class: roleConditions[role as keyof typeof roleConditions] || {},
        },
    ];

    const [data, count] = await prisma.$transaction([
        prisma.event.findMany({
            where: filter,
            include: {
                class: { select: { name: true } }
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.event.count({
            where: filter,
        })
    ])
    return (
        <div className='bg-white rounded-md p-4 m-4 mt-0'>
            {/* TOP */}
            <div className='flex justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Events</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter event img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort event img'
                                width={14}
                                height={14}
                            />
                        </button>
                        {
                            role === 'admin' && (
                                <FormModal
                                    table='event'
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
                count={count}
                page={p}
            />
        </div>
    )
}

export default LessonListPage