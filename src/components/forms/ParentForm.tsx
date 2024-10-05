'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { toast } from 'react-toastify';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createParent, updateParent } from '@/lib/actions';
import { parentSchema, ParentSchema } from '@/lib/formValidationSchema';

const ParentForm = ({
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
    // const [students, setStudents] = useState<any[]>(data?.students || []); // Array of student IDs
    // const [newStudent, setNewStudent] = useState<string>(''); // Single new student ID

    // Function to handle adding a new student
    // const addStudent = () => {
    //     if (newStudent.trim()) { // Check if input is not empty
    //         setStudents([...students, newStudent]); // Add the new student
    //         setNewStudent(''); // Clear the input after adding
    //     }
    // };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ParentSchema>({
        resolver: zodResolver(parentSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createParent : updateParent,
        {
            success: false,
            error: false,
        }
    );

    const onSubmit = handleSubmit((data) => {
        // Directly pass the students array without parsing
        const parsedData = {
            ...data,
        };
        console.log("================>Parent Page <==================")
        console.log(parsedData);
        formAction(parsedData);
    });

    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen]);


    const { students } = relatedData
    return (
        <form
            onSubmit={onSubmit}
            className='flex flex-col gap-8'
        >
            <h1 className='text-xl font-semibold'>{type === 'create' ? 'Create a new parent' : 'Update the parent'}</h1>
            <span className='text-xs text-gray-400 font-medium'> Authentication Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Username"
                    name="username"
                    defaultValue={data?.username}
                    register={register}
                    error={errors?.username}
                />
                <InputField
                    label="Email"
                    name="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors?.email}
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    defaultValue={data?.password}
                    register={register}
                    error={errors?.password}
                />
            </div>

            <span className='text-xs text-gray-400 font-medium'> Personal Information</span>
            <div className='flex flex-wrap gap-4 justify-between'>
                <InputField
                    label='First Name'
                    name="name"
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

            <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
};

export default ParentForm;
