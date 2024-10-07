import FormContainer from '@/components/FormContainer'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import prisma from '@/lib/prisma'
import { ITEMS_PER_PAGE } from '@/lib/settings'
import { auth } from '@clerk/nextjs/server'
import { Announcement, Class, Prisma } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

export type AnnouncementList = Announcement & { class: Class }

const AnnouncementsListPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined }
}) => {

    const { sessionClaims, userId } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;



    const columns = [
        {
            header: "Title",
            accessor: "subjectName"
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
        ...(role === "admin"
            ? [{
                header: "Actions",
                accessor: "actions",
            }]
            : []
        )
    ]

    const renderRow = (item: AnnouncementList) => (
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
            <td className="hidden sm:table-cell text-xs">
                {new Intl.DateTimeFormat('en-US').format(item.date)}
            </td>
            <td>
                <div className='flex items-center gap-2'>
                    {
                        role === 'admin' && (
                            <>
                                <FormContainer
                                    table='announcement'
                                    type='update'
                                    data={item}
                                />
                                <FormContainer
                                    table='announcement'
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
    const filter: Prisma.AnnouncementWhereInput = {}
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
    // ROLE CONDITIONS
    switch (role) {
        case 'admin':
            break;
        case 'teacher':
            filter.OR = [
                { classId: null },
                { class: { lessons: { some: { teacherId: currentUserId! } } } },
            ]
            break;
        case 'student':
            filter.OR = [
                { classId: null },
                { class: { students: { some: { id: currentUserId! } } } },
            ]
            break;
        case 'parent':
            filter.OR = [
                { classId: null },
                { class: { students: { some: { parentId: currentUserId! } } } },
            ]
            break;
        default:
            break;
    }

    const [data, count] = await prisma.$transaction([
        prisma.announcement.findMany({
            where: filter,
            include: {
                class: { select: { name: true } }
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.announcement.count({
            where: filter,
        })
    ])
    return (
        <div className='bg-white rounded-md p-4 m-4 mt-0'>
            {/* TOP */}
            <div className='flex justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Announcements</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter announcement img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort announcement img'
                                width={14}
                                height={14}
                            />
                        </button>
                        {
                            role === 'admin' && (
                                <FormContainer
                                    table='announcement'
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

export default AnnouncementsListPage