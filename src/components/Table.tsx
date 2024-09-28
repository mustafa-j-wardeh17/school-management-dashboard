import { Teacher } from '@/app/(dashboard)/list/teachers/page';
import { Student } from '@/app/(dashboard)/list/students/page';
import React from 'react'
import { Parent } from '@/app/(dashboard)/list/parents/page';
import { Subject } from '@/app/(dashboard)/list/subjects/page';
import { Class } from '@/app/(dashboard)/list/classes/page';
import { Lesson } from '@/app/(dashboard)/list/lessons/page';
import { Exam } from '@/app/(dashboard)/list/exams/page';
import { Result } from '@/app/(dashboard)/list/results/page';
import { Event } from '@/app/(dashboard)/list/events/page';
import { Announcement } from '@/app/(dashboard)/list/announcements/page';

interface TableProps {
    columns: { header: string; accessor: string; className?: string }[];
    className?: string[];
    renderRow: (item: any) => React.ReactNode;
    data: Teacher[] | Student[] | Parent[] | Subject[] | Class[] | Lesson[] | Exam[] | Result[] | Event[] | Announcement[]
}
const Table = ({ columns, renderRow, data }: TableProps) => {
    return (
        <table className='w-full mt-4'>
            <thead>
                <tr className='text-left text-sm text-gray-500'>
                    {columns.map(col => (
                        <th
                            key={col.header}
                            className={`${col.className}`}
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {
                    data.map((item: Teacher | Student | Parent | Subject | Class | Lesson | Exam | Result | Event | Announcement) => renderRow(item))
                }
            </tbody>
        </table>
    )
}

export default Table