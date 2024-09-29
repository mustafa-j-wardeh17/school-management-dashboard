import React from 'react'
import { FieldError } from 'react-hook-form'

interface InputFieldProps {
    label: string,
    type?: string,
    register: any,
    name: string,
    defaultValue?: string,
    error?: FieldError,
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}
const InputField = ({
    label,
    type,
    register,
    name,
    defaultValue,
    error,
    inputProps
}: InputFieldProps) => {
    return (
        <div className='flex flex-col gap-2 w-full md:w-1/4'>
            <label className='text-xs text-gray-500'>{label}</label>
            <input
                type={type}
                defaultValue={defaultValue}
                {...register(name)}
                className='ring-[1.5px] ring-gray-100 p-2 rounded-md text-xs w-full'
                {...inputProps}
            />
            {
                error?.message &&
                <p className='text-red-400 text-xs'>
                    {error?.message.toString()}
                </p>
            }
        </div>
    )
}

export default InputField