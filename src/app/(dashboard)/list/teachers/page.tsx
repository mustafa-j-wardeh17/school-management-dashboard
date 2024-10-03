import FormContainer from '@/components/FormContainer'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import prisma from '@/lib/prisma'
import { ITEMS_PER_PAGE } from '@/lib/settings'
import { role } from '@/lib/utils'
import { Class, Prisma, Subject, Teacher } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const columns = [
    {
        header: "Info",
        accessor: "info"
    },
    {
        header: "Teacher ID",
        accessor: "teacherId",
        className: "hidden xl:table-cell",
    },
    {
        header: "Subjects",
        accessor: "subjects",
        className: "hidden md:table-cell",
    },
    {
        header: "Classes",
        accessor: "classes",
        className: "hidden md:table-cell",
    },
    {
        header: "Phone",
        accessor: "phone",
        className: "hidden lg:table-cell",
    },
    {
        header: "Address",
        accessor: "address",
        className: "hidden xl:table-cell",
    },
    ...((role === "admin")
        ? [{
            header: "Actions",
            accessor: "actions",
        }]
        : []
    )
]
type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] }

const renderRow = (item: TeacherList) => (
    <tr
        key={item.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight'
    >
        <td className='flex items-center gap-4 p-4'>
            <Image
                src={item.img || '/noAvatar.png'}
                alt={`photo for ${item.id}`}
                width={40}
                height={40}
                className='md:hidden xl:block w-10 h-10 rounded-full object-cover'
            />
            <div className='flex flex-col'>
                <h3 className='font-semibold'>{item.name}</h3>
                <p className='text-xs text-gray-500'>{item?.email}</p>
            </div>
        </td>
        <td className="hidden xl:table-cell text-xs">{item.username}</td>
        <td className="hidden md:table-cell text-xs">{item.subjects.map(subject => subject.name).join(",")}</td>
        <td className="hidden md:table-cell text-xs">{item.classes.map(classItem => classItem.name).join(",")}</td>
        <td className="hidden lg:table-cell text-xs">{item.phone}</td>
        <td className="hidden xl:table-cell text-xs">{item.address}</td>
        <td>
            <div className='flex items-center gap-2'>
                <Link href={`/list/teachers/${item.id}`}>
                    <button className='w-7 h-7 rounded-full flex items-center justify-center bg-mSky'>
                        <Image
                            src={'/view.png'}
                            alt={`${item.id} teacher`}
                            width={16}
                            height={16}
                        />
                    </button>
                </Link>
                {
                    role === 'admin' && (
                        <FormContainer
                            table='teacher'
                            type='delete'
                            id={item.id}
                        />
                    )
                }
            </div>
        </td>
    </tr>
)
const TeacherListPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const { page, ...queryParams } = searchParams
    const p = page ? parseInt(page) : 1

    //------------------------------------
    //--------------1st Way---------------
    //------------------------------------
    // const data = await prisma.teacher.findMany({
    //     include: {
    //         subjects: true,
    //         classes: true
    //     },
    //     take: ITEMS_PER_PAGE,
    //     skip: ITEMS_PER_PAGE * (p - 1)
    // })

    // Total number of teachers in schema
    // const count = await prisma.teacher.count()

    // we have another way to fetching data and count in single function
    //------------------------------------
    //--------------2nd Way---------------
    //------------------------------------

    const filter: Prisma.TeacherWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "classId":
                        filter.lessons = {
                            some: {
                                classId: parseInt(value),
                            },
                        };
                        break;
                    case "search":
                        // using contains to filter by containg value in name
                        filter.name = { contains: value, mode: 'insensitive' };
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.teacher.findMany({
            where: filter,
            include: {
                classes: true,
                subjects: true,
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.teacher.count({
            where: filter
        })
    ])
    return (
        <div className='bg-white rounded-md p-4 m-4 mt-0'>
            {/* TOP */}
            <div className='flex justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Teachers</h1>
                <div className='flex md:flex-row flex-col items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/filter.png'}
                                alt='filter teacher img'
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className='w-8 h-8 rounded-full bg-mYellow flex items-center justify-center'>
                            <Image
                                src={'/sort.png'}
                                alt='sort teacher img'
                                width={14}
                                height={14}
                            />
                        </button>
                        {
                            role === 'admin' && (
                                <FormContainer
                                    table='teacher'
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

export default TeacherListPage