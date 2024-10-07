'use client'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { AttendanceSchema, attendanceSchema } from '@/lib/formValidationSchema';
import { useFormState } from 'react-dom';
import { createAttendance, updateAttendance } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Attendance } from '@prisma/client';



const AttendanceForm = ({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AttendanceSchema>({
        resolver: zodResolver(attendanceSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createAttendance : updateAttendance,
        {
            success: false,
            error: false,
        }
    );

    const onSubmit = handleSubmit((data) => {
        formAction(data);
    });

    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            toast(`Attendance has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen]);

    const { lessons, students } = relatedData;
    return (
        <form
            onSubmit={onSubmit}
            className='flex flex-col gap-8'
        >
            <h1 className='text-xl font-semibold'>{type === 'create' ? 'Create a new attendance' : 'Update the attendance'}</h1>
            <div className='flex flex-wrap gap-4 justify-between'>

                <InputField
                    label='Date'
                    name='date'
                    defaultValue={data?.date}
                    register={register}
                    error={errors.date}
                    type='date'
                />
                {data && (
                    <InputField
                        label="Id"
                        name="id"
                        defaultValue={data?.id}
                        register={register}
                        error={errors?.id}
                        hidden
                    />
                )}

                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Lesson</label>
                    <select
                        defaultValue={data?.lessonId}
                        {...register('lessonId')}
                        className='ring-[1.5px] ring-gray-100 p-2 rounded-md text-sm w-full'
                    >
                        {
                            lessons.map((lesson: { id: number, name: string }) => (
                                <option
                                    key={lesson.id}
                                    value={lesson.id}
                                >
                                    {lesson.name}
                                </option>
                            ))
                        }
                    </select>
                    {
                        errors.lessonId?.message &&
                        <p className='text-red-400 text-xs'>
                            {errors.lessonId?.message.toString()}
                        </p>
                    }

                    <div className='flex flex-col gap-2 w-full md:w-1/4'>
                        <label className='text-xs text-gray-500'>Student</label>
                        <select
                            defaultValue={data?.studentId}
                            {...register('studentId')}
                            className='ring-[1.5px] ring-gray-100 p-2 rounded-md text-sm w-full'
                        >
                            {
                                students.map((student: { id: string, name: string, surname: string }) => (
                                    <option
                                        key={student.id}
                                        value={student.id}
                                    >
                                        {student.name + " " + student.surname}
                                    </option>
                                ))
                            }
                        </select>
                        {
                            errors.studentId?.message &&
                            <p className='text-red-400 text-xs'>
                                {errors.studentId?.message.toString()}
                            </p>
                        }
                    </div>


                </div>
            </div>


            <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default AttendanceForm