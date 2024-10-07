"use server"

import { clerkClient } from "@clerk/nextjs/server";
import { AnnouncementSchema, AssignmentSchema, AttendanceSchema, ClassSchema, EventSchema, ExamSchema, LessonSchema, ParentSchema, ResultSchema, StudentSchema, SubjectSchema, TeacherSchema } from "./formValidationSchema"
import prisma from "./prisma"
type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (
    curentState: CurrentState,
    data: SubjectSchema
) => {
    try {
        await prisma.subject.create({
            data: {
                name: data.name,
                teachers: {
                    connect: data.teachers.map(teacherId => ({ id: teacherId }))
                }
            }
        })
        return {
            success: true,
            error: false
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: true
        }
    }
}
export const updateSubject = async (
    curentState: CurrentState,
    data: SubjectSchema
) => {
    try {
        await prisma.subject.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                teachers: {
                    set: data.teachers.map(teacherId => ({ id: teacherId }))
                }
            }
        })
        return {
            success: true,
            error: false
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: true
        }
    }
}
export const deleteSubject = async (
    curentState: CurrentState,
    data: FormData
) => {
    const id = data.get('id') as string
    try {
        await prisma.subject.delete({
            where: {
                id: parseInt(id)
            },
        })
        return {
            success: true,
            error: false
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: true
        }
    }
}
export const createLesson = async (
    curentState: CurrentState,
    data: LessonSchema
) => {
    try {


        await prisma.lesson.create({
            data: {
                name: data.name,
                day: data.day as "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY",  // Enum field
                startTime: data.startTime,
                endTime: data.endTime,
                classId: data.classId,
                subjectId: data.subjectId,
                teacherId: data.teacherId,
            },
        });
        return {
            success: true,
            error: false
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: true
        }
    }
}
export const updateLesson = async (
    curentState: CurrentState,
    data: LessonSchema
) => {
    try {
        await prisma.lesson.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                day: data.day as "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY",  // Enum field
                startTime: data.startTime,
                endTime: data.endTime,
                classId: data.classId,
                subjectId: data.subjectId,
                teacherId: data.teacherId,
            }
        })
        return {
            success: true,
            error: false
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: true
        }
    }
}
export const deleteLesson = async (
    curentState: CurrentState,
    data: FormData
) => {
    const id = data.get('id') as string
    try {
        await prisma.lesson.delete({
            where: {
                id: parseInt(id)
            },
        })
        return {
            success: true,
            error: false
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: true
        }
    }
}

export const createClass = async (
    currentState: CurrentState,
    data: ClassSchema
) => {
    try {
        await prisma.class.create({
            data,
        });

        // revalidatePath("/list/classes");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateClass = async (
    currentState: CurrentState,
    data: ClassSchema
) => {
    try {
        await prisma.class.update({
            where: {
                id: data.id,
            },
            data,
        });

        // revalidatePath("/list/classes");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteClass = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.class.delete({
            where: {
                id: parseInt(id),
            },
        });

        // revalidatePath("/list/classes");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};


export const createTeacher = async (
    currentState: CurrentState,
    data: TeacherSchema
) => {
    try {

        const user = await clerkClient.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "teacher" }

        })
        //create user to clerk
        await prisma.teacher.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                img: data.img || null,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                subjects: {
                    connect: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId),
                    })),
                },
            },
        });

        // revalidatePath("/list/teachers");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateTeacher = async (
    currentState: CurrentState,
    data: TeacherSchema
) => {
    if (!data.id) return {
        success: false,
        error: true
    }
    try {
        const user = await clerkClient.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname
        })
        //create user to clerk
        await prisma.teacher.update({
            where: {
                id: data.id
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                img: data.img || null,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                subjects: {
                    set: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId),
                    })),
                },
            },
        });
        return { success: true, error: false };

    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteTeacher = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        // delete user from clerk
        await clerkClient.users.deleteUser(id)

        await prisma.teacher.delete({
            where: {
                id: id,
            },
        });

        // revalidatePath("/list/teachers");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const createStudent = async (
    currentState: CurrentState,
    data: StudentSchema
) => {
    console.log(data);
    try {
        const classItem = await prisma.class.findUnique({
            where: { id: data.classId },
            include: { _count: { select: { students: true } } },
        });

        if (classItem && classItem.capacity === classItem._count.students) {
            return { success: false, error: true };
        }

        const user = await clerkClient.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "student" }
        });

        await prisma.student.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                img: data.img || null,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId,
            },
        });

        // revalidatePath("/list/students");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateStudent = async (
    currentState: CurrentState,
    data: StudentSchema
) => {
    if (!data.id) {
        return { success: false, error: true };
    }
    try {
        const user = await clerkClient.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
        });

        await prisma.student.update({
            where: {
                id: data.id,
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                img: data.img || null,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId,
            },
        });
        // revalidatePath("/list/students");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteStudent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await clerkClient.users.deleteUser(id);

        await prisma.student.delete({
            where: {
                id: id,
            },
        });

        // revalidatePath("/list/students");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const createParent = async (
    currentState: CurrentState,
    data: ParentSchema
) => {
    console.log(data);
    try {
        const user = await clerkClient.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "parent" }
        });

        await prisma.parent.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone,
                address: data.address,
                students: {
                    connect: data.students?.map(studentId => ({ id: studentId }))
                }
                ,
            },
        });

        // revalidatePath("/list/students");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateParent = async (
    currentState: CurrentState,
    data: ParentSchema
) => {
    if (!data.id) {
        return { success: false, error: true };
    }
    try {
        const user = await clerkClient.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
        });

        await prisma.parent.update({
            where: {
                id: data.id,
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone,
                address: data.address,
                students: {
                    set: data.students?.map(student => ({ id: student }))
                }
            },
        });
        // revalidatePath("/list/students");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteParent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await clerkClient.users.deleteUser(id);

        await prisma.parent.delete({
            where: {
                id
            },
        });

        // revalidatePath("/list/parents");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const createExam = async (
    currentState: CurrentState,
    data: ExamSchema
) => {
    try {

        await prisma.exam.create({
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateExam = async (
    currentState: CurrentState,
    data: ExamSchema
) => {

    try {

        await prisma.exam.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteExam = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    try {
        await prisma.exam.delete({
            where: {
                id: parseInt(id),
                // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const createAssignment = async (
    currentState: CurrentState,
    data: AssignmentSchema
) => {
    try {

        await prisma.assignment.create({
            data: {
                title: data.title,
                startDate: data.startDate,
                dueDate: data.endDate,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateAssignment = async (
    currentState: CurrentState,
    data: AssignmentSchema
) => {

    try {

        await prisma.assignment.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                startDate: data.startDate,
                dueDate: data.endDate,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteAssignment = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    try {
        await prisma.assignment.delete({
            where: {
                id: parseInt(id),
                // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const createResult = async (
    currentState: CurrentState,
    data: ResultSchema
) => {
    try {
        if (data.assignmentId) {
            await prisma.result.create({
                data: {
                    score: data.score,
                    studentId: data.studentId,
                    assignmentId: data.assignmentId,
                },
            });
        }
        else if (data.examId) {
            await prisma.result.create({
                data: {
                    score: data.score,
                    studentId: data.studentId,
                    examId: data.examId,
                },
            });
        } else {
            return { success: false, error: true };
        }


        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateResult = async (
    currentState: CurrentState,
    data: ResultSchema
) => {
    try {
        if (data.assignmentId) {
            await prisma.result.update({
                where: {
                    id: data.id
                },

                data: {
                    score: data.score,
                    studentId: data.studentId,
                    assignmentId: data.assignmentId,
                },
            });
        }
        else if (data.examId) {
            await prisma.result.update({
                where: {
                    id: data.id
                },
                data: {
                    score: data.score,
                    studentId: data.studentId,
                    examId: data.examId,
                },
            });
        } else {
            return { success: false, error: true };
        }
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteResult = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    try {
        await prisma.result.delete({
            where: {
                id: parseInt(id),
                // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const createEvent = async (
    currentState: CurrentState,
    data: EventSchema
) => {
    try {
        await prisma.event.create({
            data
        });
        // revalidatePath("/list/events");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateEvent = async (
    currentState: CurrentState,
    data: EventSchema
) => {
    try {

        await prisma.event.update({
            where: {
                id: data.id
            },
            data,
        });

        // revalidatePath("/list/events");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteEvent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    try {
        await prisma.event.delete({
            where: {
                id: parseInt(id),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const createAnnouncement = async (
    currentState: CurrentState,
    data: AnnouncementSchema
) => {
    try {
        await prisma.announcement.create({
            data
        });
        // revalidatePath("/list/events");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateAnnouncement = async (
    currentState: CurrentState,
    data: AnnouncementSchema
) => {
    try {

        await prisma.announcement.update({
            where: {
                id: data.id
            },
            data,
        });

        // revalidatePath("/list/events");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteAnnouncement = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    try {
        await prisma.announcement.delete({
            where: {
                id: parseInt(id),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}


export const createAttendance = async (
    currentState: CurrentState,
    data: AttendanceSchema
) => {
    try {
        await prisma.attendance.create({
            data
        });
        // revalidatePath("/list/events");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateAttendance = async (
    currentState: CurrentState,
    data: AttendanceSchema
) => {
    try {

        await prisma.attendance.update({
            where: {
                id: data.id
            },
            data
        });

        // revalidatePath("/list/events");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteAttendance = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    try {
        await prisma.attendance.delete({
            where: {
                id: parseInt(id),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}