'use client'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import InputField from '../InputField';
import Image from 'next/image';
import { eventSchema, EventSchema } from '@/lib/formValidationSchema';
import { useFormState } from 'react-dom';
import { createEvent, updateEvent } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';



const EventForm = ({
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
    } = useForm<EventSchema>({
        resolver: zodResolver(eventSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createEvent : updateEvent,
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
            toast(`Event has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen]);

    const { classes } = relatedData;
    return (
        <form
            onSubmit={onSubmit}
            className='flex flex-col gap-8'
        >
            <h1 className='text-xl font-semibold'>{type === 'create' ? 'Create a new event' : 'Update the event'}</h1>
            <div className='flex flex-wrap gap-4 justify-between'>

                <InputField
                    label='Event Title'
                    name='title'
                    defaultValue={data?.title}
                    register={register}
                    error={errors.title}
                />
                <InputField
                    label='Description'
                    name='description'
                    defaultValue={data?.description}
                    register={register}
                    error={errors.description}
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
                    <label className='text-xs text-gray-500'>Class</label>
                    <select
                        defaultValue={data?.classId}
                        {...register('classId')}
                        className='ring-[1.5px] ring-gray-100 p-2 rounded-md text-sm w-full'
                    >
                        {
                            classes.map((classItem: { id: number, name: string }) => (
                                <option
                                    key={classItem.id}
                                    value={classItem.id}
                                >
                                    {classItem.name}
                                </option>
                            ))
                        }
                    </select>
                    {
                        errors.classId?.message &&
                        <p className='text-red-400 text-xs'>
                            {errors.classId?.message.toString()}
                        </p>
                    }
                </div>
                <InputField
                    label='Start Time'
                    name='startTime'
                    defaultValue={data?.startTime.toISOString().split("T")[0]}
                    register={register}
                    error={errors.startTime}
                    type='date'
                />
                <InputField
                    label='End Time'
                    name='endTime'
                    defaultValue={data?.endTime.toISOString().split("T")[0]}
                    register={register}
                    error={errors.endTime}
                    type='date'
                />
            </div>



            <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default EventForm