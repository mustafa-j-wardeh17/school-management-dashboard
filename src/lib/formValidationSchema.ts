import * as z from 'zod';


export const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    name: z
        .string()
        .min(1, { message: 'Subject name is required!' }),
    teachers: z.array(z.string()),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: "Subject name is required!" }),
    capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
    gradeId: z.coerce.number().min(1, { message: "Grade name is required!" }),
    supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;


export const lessonSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: "Subject name is required!" }),
    day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]),
    startTime: z.coerce.date({ message: "Start Time is required!" }),
    endTime: z.coerce.date({ message: "End Time is required!" }),
    classId: z.coerce.number().min(1, { message: "Class name is required!" }),
    subjectId: z.coerce.number().min(1, { message: "Subject name is required!" }),
    teacherId: z.coerce.string().min(1, { message: "Grade name is required!" }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

export const teacherSchema = z.object({
    id: z.string().optional(),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long!" })
        .max(20, { message: "Username must be at most 20 characters long!" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long!" })
        .optional() //optional when edit the teacher
        .or(z.literal("")),
    name: z.string().min(1, { message: "First name is required!" }),
    surname: z.string().min(1, { message: "Last name is required!" }),
    email: z
        .string()
        .email({ message: "Invalid email address!" })
        .optional()
        .or(z.literal("")), //mean that it can be empty string
    phone: z.string().optional(),
    address: z.string(),
    img: z.string().optional(),
    bloodType: z.string().min(1, { message: "Blood Type is required!" }),
    birthday: z.coerce.date({ message: "Birthday is required!" }),
    sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
    subjects: z.array(z.string()).optional(), // subject ids
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
    id: z.string().optional(),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long!" })
        .max(20, { message: "Username must be at most 20 characters long!" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long!" })
        .optional() //optional when edit the teacher
        .or(z.literal("")),
    name: z.string().min(1, { message: "First name is required!" }),
    surname: z.string().min(1, { message: "Last name is required!" }),
    email: z
        .string()
        .email({ message: "Invalid email address!" })
        .optional()
        .or(z.literal("")), //mean that it can be empty string
    phone: z.string().optional(),
    address: z.string(),
    img: z.string().optional(),
    bloodType: z.string().min(1, { message: "Blood Type is required!" }),
    birthday: z.coerce.date({ message: "Birthday is required!" }),
    sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
    gradeId: z.coerce.number().min(1, { message: "Grade is required!" }), // subject ids
    classId: z.coerce.number().min(1, { message: "Class is required!" }), // subject ids
    parentId: z.string().min(1, { message: "Parent Id is required!" }), // subject ids
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const parentSchema = z.object({
    id: z.string().optional(),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long!" })
        .max(20, { message: "Username must be at most 20 characters long!" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long!" })
        .optional() //optional when edit the teacher
        .or(z.literal("")),
    name: z.string().min(1, { message: "First name is required!" }),
    surname: z.string().min(1, { message: "Last name is required!" }),
    email: z
        .string()
        .email({ message: "Invalid email address!" })
        .optional()
        .or(z.literal("")), //mean that it can be empty string
    phone: z.string(),
    address: z.string(),
    students: z.array(z.string()).optional(), // children ids

});

export type ParentSchema = z.infer<typeof parentSchema>;

export const examSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Exam title is required!" }),
    startTime: z.coerce.date({ message: "Start time is required!" }),
    endTime: z.coerce.date({ message: "End time is required!" }),
    lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;


export const assignmentSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Assignment Title is required!" }),
    startDate: z.coerce.date({ message: "Start time is required!" }),
    endDate: z.coerce.date({ message: "End time is required!" }),
    lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;


export const resultSchema = z.object({
    id: z.coerce.number().optional(),
    score: z.coerce.number(),
    studentId: z.coerce.string({ message: "Student is required!" }),
    assignmentId: z.coerce.number().optional(),
    examId: z.coerce.number().optional(),
});

export type ResultSchema = z.infer<typeof resultSchema>;

export const eventSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Event title is required!" }),
    description: z.string().min(1, { message: "Event description is required!" }),
    startTime: z.coerce.date({ message: "Start time is required!" }),
    endTime: z.coerce.date({ message: "End time is required!" }),
    classId: z.coerce.number(),
});

export type EventSchema = z.infer<typeof eventSchema>;



export const announcementSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Event title is required!" }),
    description: z.string().min(1, { message: "Event description is required!" }),
    date: z.coerce.date({ message: "Start time is required!" }),
    classId: z.coerce.number(),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;