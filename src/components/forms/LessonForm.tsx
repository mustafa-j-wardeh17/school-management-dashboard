'use client'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { lessonSchema, LessonSchema } from '@/lib/formValidationSchema';
import { useFormState } from 'react-dom';
import { createClass, createLesson, updateClass, updateLesson } from '@/lib/actions';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const LessonForm = ({
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
    } = useForm<LessonSchema>({
        resolver: zodResolver(lessonSchema),
    });
    const [state, formAction] = useFormState(
        type === "create" ? createLesson : updateLesson,
        {
            success: false,
            error: false,
        }
    );
    const onSubmit = handleSubmit((data) => {
        console.log(data);
        formAction(data);
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Lesson has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen]);
    const {
        subjects,
        teachers,
        classes
    } = relatedData;
    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new lesson" : "Update the lesson"}
            </h1>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Lesson name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Teacher</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("teacherId")}
                        defaultValue={data?.teacherId}
                    >
                        {teachers.map(
                            (teacher: { id: string; name: string; surname: string }) => (
                                <option
                                    value={teacher.id}
                                    key={teacher.id}
                                    selected={data && teacher.id === data.teacherId}
                                >
                                    {teacher.name + " " + teacher.surname}
                                </option>
                            )
                        )}
                    </select>
                    {errors.teacherId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.teacherId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Subject</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("subjectId")}
                        defaultValue={data?.subjectId}
                    >
                        {subjects.map(
                            (subject: { id: string; name: string; }) => (
                                <option
                                    value={subject.id}
                                    key={subject.id}
                                    selected={data && subject.id === data.subjectId}
                                >
                                    {subject.name}
                                </option>
                            )
                        )}
                    </select>
                    {errors.subjectId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.subjectId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Class</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("classId")}
                        defaultValue={data?.classId}
                    >
                        {classes.map(
                            (classItem: { id: string; name: string; }) => (
                                <option
                                    value={classItem.id}
                                    key={classItem.id}
                                    selected={data && classItem.id === data.classId}
                                >
                                    {classItem.name}
                                </option>
                            )
                        )}
                    </select>
                    {errors.classId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.classId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Day</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("day")}
                        defaultValue={data?.day}
                    >
                        {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].map(
                            (day) => (
                                <option
                                    value={day}
                                    key={day}
                                    selected={data && day === data.day}
                                >
                                    {day}
                                </option>
                            )
                        )}
                    </select>
                    {errors.day?.message && (
                        <p className="text-xs text-red-400">
                            {errors.day.message.toString()}
                        </p>
                    )}
                </div>
                <InputField
                    label="Start Time"
                    name="startTime"
                    defaultValue={data?.startTime.toISOString().slice(0, 16)}
                    register={register}
                    error={errors?.startTime}
                    type="datetime-local"
                />
                <InputField
                    label="End Date"
                    name="endTime"
                    defaultValue={data?.endTime.toISOString().slice(0, 16)} // Format the date correctly
                    register={register}
                    error={errors?.endTime}
                    type="datetime-local"
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
            </div>
            {state.error && (
                <span className="text-red-500">Something went wrong!</span>
            )}
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};
export default LessonForm