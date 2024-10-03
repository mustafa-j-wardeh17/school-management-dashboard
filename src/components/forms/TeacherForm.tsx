'use client'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import Image from 'next/image';
import { teacherSchema, TeacherSchema } from '@/lib/formValidationSchema';
import { createTeacher, updateTeacher } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CldUploadWidget } from 'next-cloudinary';

const TeacherForm = ({ setOpen, type, data, relatedData }: {
    setOpen: Dispatch<SetStateAction<boolean>>,
    relatedData?: any;
    type: 'create' | 'update';
    data?: any
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TeacherSchema>({
        resolver: zodResolver(teacherSchema),
    });

    // use formstate 
    const [state, formAction] = useFormState(type === 'create'
        ? createTeacher
        : updateTeacher
        , {
            success: false, error: false
        }
    )

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

    const { subjects } = relatedData;
    return (
        <form
            onSubmit={onSubmit}
            className='flex flex-col gap-8'
        >
            <h1 className='text-xl font-semibold'>{type === 'create' ? 'Create a new teacher' : 'Update the teacher'}</h1>
            <span className='text-xs text-gray-400 font-medium'> Authentication Information</span>
            <div className='flex flex-wrap gap-4 justify-between'>

                <InputField
                    label='username'
                    name='username'
                    defaultValue={data?.username}
                    register={register}
                    error={errors.username}
                />
                <InputField
                    label='Email'
                    name='email'
                    type='email'
                    defaultValue={data?.email}
                    register={register}
                    error={errors.email}
                />
                <InputField
                    label='Password'
                    name='password'
                    type='password'
                    defaultValue={data?.password}
                    register={register}
                    error={errors.password}
                />
            </div>

            <span className='text-xs text-gray-400 font-medium'> Personal Information</span>
            <div className='flex flex-wrap gap-4 justify-between'>
                <InputField
                    label='First Name'
                    name='name'
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
                />
                <InputField
                    label='Last Name'
                    name='surname'
                    defaultValue={data?.surname}
                    register={register}
                    error={errors.surname}
                />
                <InputField
                    label='Phone'
                    name='phone'
                    defaultValue={data?.phone}
                    register={register}
                    error={errors.phone}
                />
                <InputField
                    label='Address'
                    name='address'
                    defaultValue={data?.address}
                    register={register}
                    error={errors.address}
                />
                <InputField
                    label='Blood Type'
                    name='bloodType'
                    defaultValue={data?.bloodType}
                    register={register}
                    error={errors.bloodType}
                />
                <InputField
                    label='Blood Type'
                    name='bloodType'
                    defaultValue={data?.bloodType}
                    register={register}
                    error={errors.bloodType}
                    type='date'
                />
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Sex</label>
                    <select
                        defaultValue={data?.sex}
                        {...register('sex')}
                        className='ring-[1.5px] ring-gray-100 p-2 rounded-md text-sm w-full'
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {
                        errors.sex?.message &&
                        <p className='text-red-400 text-xs'>
                            {errors.sex?.message.toString()}
                        </p>
                    }
                </div>
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Subject</label>
                    <select
                        defaultValue={data?.subjectId}
                        {...register('subjects')}
                        className='ring-[1.5px] ring-gray-100 p-2 rounded-md text-sm w-full'
                    >
                        {
                            subjects.map((subject: { id: number, name: string }) => (
                                <option value={subject.id}>{subject.name}</option>
                            ))
                        }

                    </select>
                    {
                        errors.subjects?.message &&
                        <p className='text-red-400 text-xs'>
                            {errors.subjects?.message.toString()}
                        </p>
                    }
                </div>

                <CldUploadWidget uploadPreset="<Your Upload Preset>">
                    {({ open }) => {
                        return (
                            <div
                                className='text-xs cursor-pointer text-gray-500 flex items-center gap-2 '
                                onClick={() => open()}                            >
                                <Image
                                    src={'/upload.png'}
                                    alt='upload image'
                                    width={28}
                                    height={28}
                                />
                                <span>Upload a photo</span>
                            </div>
                        );
                    }}
                </CldUploadWidget>


            </div>

            <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default TeacherForm