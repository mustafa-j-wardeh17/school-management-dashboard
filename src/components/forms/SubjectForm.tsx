'use client'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { SubjectSchema, subjectSchema } from '@/lib/formValidationSchema';
import { createSubject, updateSubject } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


const SubjectForm = ({ setOpen, type, data, relatedData }: {
    setOpen: Dispatch<SetStateAction<boolean>>,
    relatedData?: any;
    type: 'create' | 'update';
    data?: any
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SubjectSchema>({
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

    const { teachers } = relatedData;
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
                {data && <InputField
                    label='Id'
                    name='id'
                    defaultValue={data?.id}
                    register={register}
                    error={errors.id}
                    hidden
                />}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Teachers</label>
                    <select
                        multiple
                        className="ring-[1.5px] text-xs ring-gray-300 p-2 rounded-md w-full"
                        {...register("teachers")}
                        defaultValue={data?.teachers}
                    >
                        {teachers.map(
                            (teacher: { id: string; name: string; surname: string }) => (
                                <option value={teacher.id} key={teacher.id}>
                                    {teacher.name + " " + teacher.surname}
                                </option>
                            )
                        )}
                    </select>
                    {errors.teachers?.message && (
                        <p className="text-xs text-red-400">
                            {errors.teachers.message.toString()}
                        </p>
                    )}
                </div>
            </div>

            {state.error && <span className='text-red-500 text-xs'>Something went wrong!</span>}
            <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default SubjectForm