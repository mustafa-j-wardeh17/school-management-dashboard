'use client'
import { deleteAssignment, deleteClass, deleteExam, deleteStudent, deleteSubject, deleteTeacher } from '@/lib/actions';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import { FormContainerProps } from './FormContainer';


const deleteActionMap = {
    subject: deleteSubject,
    class: deleteClass,
    teacher: deleteTeacher,
    student: deleteStudent,
    parent: deleteSubject,
    lesson: deleteSubject,
    exam: deleteExam,
    assignment: deleteAssignment,
    result: deleteSubject,
    attendance: deleteSubject,
    event: deleteSubject,
    announcement: deleteSubject,
}

// This Loading Method is slow For client Components
// import TeacherForm from './forms/TeacherForm';
// import StudentForm from './forms/StudentForm';

// Using dynamic import to use render the component when need it not load all component when page loaded

const TeacherForm = dynamic(() => import('./forms/TeacherForm'), {
    loading: () => <h1>Loading...</h1>
})
const StudentForm = dynamic(() => import('./forms/StudentForm'), {
    loading: () => <h1>Loading...</h1>
})
const ParentForm = dynamic(() => import('./forms/ParentForm'), {
    loading: () => <h1>Loading...</h1>
})
const SubjectForm = dynamic(() => import('./forms/SubjectForm'), {
    loading: () => <h1>Loading...</h1>
})
const ClassForm = dynamic(() => import('./forms/ClassForm'), {
    loading: () => <h1>Loading...</h1>
})
const LessonForm = dynamic(() => import('./forms/LessonForm'), {
    loading: () => <h1>Loading...</h1>
})
const ExamForm = dynamic(() => import('./forms/ExamForm'), {
    loading: () => <h1>Loading...</h1>
})
const AssignmentForm = dynamic(() => import('./forms/AssignmentForm'), {
    loading: () => <h1>Loading...</h1>
})
const ResultForm = dynamic(() => import('./forms/ResultForm'), {
    loading: () => <h1>Loading...</h1>
})
const AttendanceForm = dynamic(() => import('./forms/AttendanceForm'), {
    loading: () => <h1>Loading...</h1>
})
const EventForm = dynamic(() => import('./forms/EventForm'), {
    loading: () => <h1>Loading...</h1>
})
const AnnouncementForm = dynamic(() => import('./forms/AnnouncementForm'), {
    loading: () => <h1>Loading...</h1>
})

const forms: {
    [key: string]: (
        setOpen: Dispatch<SetStateAction<boolean>>,
        type: "create" | "update",
        data?: any,
        relatedData?: any
    ) => JSX.Element
} = {
    teacher: (setOpen, type, data, relatedData) => <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    student: (setOpen, type, data, relatedData) => <StudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    // parent: (setOpen, type, data, relatedData) => <ParentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    subject: (setOpen, type, data, relatedData) => <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    class: (setOpen, type, data, relatedData) => <ClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    // lesson: (setOpen, type, data, relatedData) => <LessonForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    exam: (setOpen, type, data, relatedData) => <ExamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    assignment: (setOpen, type, data, relatedData) => <AssignmentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    // result: (setOpen, type, data, relatedData) => <ResultForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    // attendance: (setOpen, type, data, relatedData) => <AttendanceForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    // event: (setOpen, type, data, relatedData) => <EventForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    // announcement: (setOpen, type, data, relatedData) => <AnnouncementForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
}




const FormModal = ({ table, type, data, id, relatedData }: FormContainerProps & { relatedData?: any }) => {
    const [open, setOpen] = useState(false)
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7"
    const bgColor = type === "create"
        ? "bg-mYellow"
        : type === "update"
            ? "bg-mSky"
            : "bg-mPurple"
    const Form = () => {

        const [state, formAction] = useFormState(deleteActionMap[table], {
            success: false,
            error: false
        })
        const router = useRouter()

        useEffect(() => {
            if (state.success) {
                toast(`${table} has been deleted!`);
                setOpen(false);
                router.refresh();
            }
        }, [state, router]);

        console.log(id)
        return type === 'delete' && id ? (
            <form
                action={formAction}
                className='p-4 flex flex-col gap-4'
            >
                <input hidden type='text | number' name='id' value={id} />
                <span className='text-center font-medium'>All data will be lost. Are you sure you want to delete this {table}?</span>
                <button className='bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center'>Delete</button>
            </form>
        ) :
            type === "create" || type === "update" ? (
                // for each table there are different form so creating a object with table name will solve the repeating of if else here
                forms[table](setOpen, type, data, relatedData)
            ) : (
                'Form not found!'
            )
    }
    return (
        <>

            <button
                className={`${size} ${bgColor} flex items-center justify-center rounded-full`}
                onClick={() => setOpen(true)}
            >
                <Image
                    src={`/${type}.png`}
                    alt={`${type} image`}
                    width={16}
                    height={16}
                />
            </button>
            {
                open && (
                    <div className='w-screen h-screen absolute left-0 top-0 inset-0 bg-black/60 bg-opacity-45 z-50 flex items-center justify-center'>
                        <div className='relative p-4 rounded-md bg-white w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
                            <div
                                className='absolute top-4 right-4 cursor-pointer'
                                onClick={() => setOpen(false)}
                            >
                                <Image
                                    src={'/close.png'}
                                    alt='close image'
                                    width={14}
                                    height={14}
                                />
                            </div>
                            <Form />
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default FormModal