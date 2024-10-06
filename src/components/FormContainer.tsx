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
            case "lesson":
                const lessonSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                });
                const lessonTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                });
                const lessonClasses = await prisma.class.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { classes: lessonClasses, subjects: lessonSubjects, teachers: lessonTeachers };
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
            case "result":
                // Find exams associated with the teacher
                const resultExams = await prisma.exam.findMany({
                    where: {
                        ...(role === "teacher"
                            ? {
                                lesson: {
                                    teacherId: currentUserId!,
                                }
                            }
                            : {}
                        ),
                    },
                    select: { id: true, title: true },
                });

                // Find assignments associated with the teacher
                const resultAssignments = await prisma.assignment.findMany({
                    where: {
                        ...(role === "teacher"
                            ? {
                                lesson: {
                                    teacherId: currentUserId!,
                                }
                            }
                            : {}
                        ),
                    },
                    select: { id: true, title: true },
                });

                // Find students associated with the teacher's classes
                const resultStudents = await prisma.student.findMany({
                    where: {
                        ...(role === 'teacher'
                            ? {
                                class: {
                                    lessons: {
                                        some: {
                                            teacherId: currentUserId!,
                                        },
                                    },
                                }
                            }
                            : {}
                        )
                    },
                    select: { id: true, name: true, surname: true },
                });

                relatedData = { exams: resultExams, assignments: resultAssignments, students: resultStudents };
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