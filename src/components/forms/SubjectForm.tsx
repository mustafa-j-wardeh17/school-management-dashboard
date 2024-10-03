'use client'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import InputField from '../InputField';
import Image from 'next/image';
import { subjectSchema } from '@/lib/formValidationSchema';
import { createSubject, deleteSubject, updateSubject } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


const SubjectForm = ({ setOpen, type, data }: {
    setOpen: Dispatch<SetStateAction<boolean>>,

    type: 'create' | 'update';
    data?: any
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<subjectSchema>({
        resolver: zodResolver(subjectSchema),
    });

    // use formstate 
    const [state, formAction] = useFormState(type === 'create'
        ? createSubject
        : updateSubject
        , {
            success: false, error: false
        })

    const onSubmit = handleSubmit((data) => {
        formAction(data)
    })

    const router = useRouter()
    useEffect(() => {
        if (state.success) {
            toast(`Subject has been ${type === 'create' ? 'created' : 'updated'}!`)
            setOpen(false)
            router.refresh()
        }
    }, [state])
    return (
        <form
            onSubmit={onSubmit}
            className='flex flex-col gap-8'
        >
            <h1 className='text-xl font-semibold'>{type === 'create' ? 'Create a new subject' : 'Update the subject'} </h1>
            <div className='flex flex-wrap gap-4 justify-between'>

                <InputField
                    label='Subject name'
                    name='name'
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
                />

            </div>

            {state.error && <span className='text-red-500 text-xs'>Something went wrong!</span>}
            <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default SubjectForm