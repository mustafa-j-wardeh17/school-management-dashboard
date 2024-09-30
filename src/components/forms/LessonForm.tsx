'use client'
import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import InputField from '../InputField';
import Image from 'next/image';

const schema = z.object({
    username: z
        .string()
        .min(3, { message: 'Username must be at least 3 characters long!' })
        .max(20, { message: 'Username must be at most 20 characters long!' }),
    email: z
        .string()
        .email({ message: "Invalid email address!" }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long!' }),
    firstName: z
        .string()
        .min(1, { message: 'First name is required!' }),
    lastName: z
        .string()
        .min(1, { message: 'Last name is required!' }),
    phone: z
        .string()
        .min(1, { message: 'Phoene is required!' }),
    address: z
        .string()
        .min(8, { message: 'Address is required!' }),
    bloodType: z
        .string()
        .min(8, { message: 'Blood Type is required!' }),

    birthday: z
        .date({ message: 'Birthday is required!' }),
    sex: z
        .enum(['male', 'female'], { message: 'Sex is required!' }),
    image: z
        .instanceof(File, { message: 'Image is required!' }),

});

type Inputs = z.infer<typeof schema>;

const LessonForm = ({ type, data }: { type: 'create' | 'update'; data?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data)
    })
    return (
        <form
            onSubmit={onSubmit}
            className='flex flex-col gap-8'
        >
            <h1 className='text-xl font-semibold'>Create a new teacher</h1>
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
                    name='firstName'
                    defaultValue={data?.firstName}
                    register={register}
                    error={errors.firstName}
                />
                <InputField
                    label='Last Name'
                    name='lastName'
                    defaultValue={data?.lastName}
                    register={register}
                    error={errors.lastName}
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
                <div className='flex flex-col justify-center items-center gap-2 w-full md:w-1/4'>
                    <label
                        className='text-xs cursor-pointer text-gray-500 flex items-center gap-2 '
                        htmlFor='img'
                    >
                        <Image
                            src={'/upload.png'}
                            alt='upload image'
                            width={28}
                            height={28}
                        />
                        <span>Upload a photo</span>
                    </label>
                    <input
                        id='img'
                        type="file"
                        {...register("image")}
                        className='hidden'
                    />

                    {
                        errors.sex?.message &&
                        <p className='text-red-400 text-xs'>
                            {errors.sex?.message.toString()}
                        </p>
                    }
                </div>
            </div>

            <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default LessonForm