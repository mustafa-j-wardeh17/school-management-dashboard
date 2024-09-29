'use client'
import Image from 'next/image';
import React, { useState } from 'react'
import TeacherForm from './forms/TeacherForm';
interface FormModalProps {
    table: "teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam" | "assignment" | "result" | "attendance" | "event" | "announcement";
    type: "create" | "update" | "delete";
    data?: any;
    id?: number
}
const FormModal = ({ table, type, data, id }: FormModalProps) => {
    const [open, setOpen] = useState(false)
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7"
    const bgColor = type === "create"
        ? "bg-mYellow"
        : type === "update"
            ? "bg-mSky"
            : "bg-mPurple"
    const Form = () => {
        return type === 'delete' && id ? (
            <form
                action=""
                className='p-4 flex flex-col gap-4'
            >
                <span className='text-center font-medium'>All data will be lost. Are you sure you want to delete this {table}?</span>
                <button className='bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center'>Delete</button>
            </form>
        ) : (
            <TeacherForm type='update' />
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