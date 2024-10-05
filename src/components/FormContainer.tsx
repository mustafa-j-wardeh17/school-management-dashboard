import React from 'react'
import FormModal from './FormModal';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export interface FormContainerProps {
    table: "teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam" | "assignment" | "result" | "attendance" | "event" | "announcement";
    type: "create" | "update" | "delete";
    data?: any;
    id?: string | number
}
const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;
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
            case "teacher":
                const teacherSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { subjects: teacherSubjects };
                break;
            case "student":
                const studentGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });
                const studentClasses = await prisma.class.findMany({
                    include: { _count: { select: { students: true } } },
                });
                relatedData = { classes: studentClasses, grades: studentGrades };
                break;
            case "parent":
                const parentStudents = await prisma.parent.findMany({
                    select: { id: true, name: true, surname: true },
                });
                relatedData = { students: parentStudents };
                break;
            case "exam":
                const examLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
                    },
                    select: { id: true, name: true },
                });
                relatedData = { lessons: examLessons || [] };
                break;
            case "assignment":
                const assignmentLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
                    },
                    select: { id: true, name: true },
                });
                relatedData = { lessons: assignmentLessons || [] };
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