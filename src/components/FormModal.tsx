'use client'
import Image from 'next/image';
import React from 'react'
interface FormModalProps {
    table: "teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam" | "assignment" | "result" | "attendance" | "event" | "announcement";
    type: "create" | "update" | "delete";
    data?: any;
    id?: number
}
const FormModal = ({ table, type, data, id }: FormModalProps) => {
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7"
    const bgColor = type === "create"
        ? "bg-mYellow"
        : type === "update"
            ? "bg-mSky"
            : "bg-mPurple"

    return (
        <>

            <button className={`${size} ${bgColor} flex items-center justify-center rounded-full`}>
                <Image
                    src={`/${type}.png`}
                    alt={`${type} image`}
                    width={16}
                    height={16}
                />
            </button>
        </>
    )
}

export default FormModal