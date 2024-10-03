import React from 'react'
import FormModal from './FormModal';
import prisma from '@/lib/prisma';
import { teachersData } from '@/lib/data';

export interface FormContainerProps {
    table: "teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam" | "assignment" | "result" | "attendance" | "event" | "announcement";
    type: "create" | "update" | "delete";
    data?: any;
    id?: string | number
}
const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {

    let relatedData = {}

    if (type !== 'delete') {
        switch (table) {
            case "subject":
                const subjectTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                });
                relatedData = { teachers: subjectTeachers };
                break;
            case "class":
                const classGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });
                const classTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                });
                relatedData = { teachers: classTeachers, grades: classGrades };
                break;
            case "student":

                break;

            default:
                break;
        }
    }
    return (
        <FormModal
            table={table}
            type={type}
            data={data}
            id={id}
            relatedData={relatedData}
        />
    )
}

export default FormContainer