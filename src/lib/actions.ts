"use server"

import { subjectSchema } from "./formValidationSchema"
import prisma from "./prisma"

export const createSubject = async (
    curentState: { success: boolean, error: boolean },
    data: subjectSchema
) => {
    try {
        await prisma.subject.create({
            data: {
                name: data.name
            }
        })
        return {
            success: true,
            error: false
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: true
        }
    }
}
export const updateSubject = async (
    curentState: { success: boolean, error: boolean },
    data: subjectSchema
) => {
    try {
        await prisma.subject.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name
            }
        })
        return {
            success: true,
            error: false
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: true
        }
    }
}
export const deleteSubject = async (
    curentState: { success: boolean, error: boolean },
    data: FormData
) => {
    const id = data.get('id') as string
    try {
        await prisma.subject.delete({
            where: {
                id: parseInt(id)
            },
        })
        return {
            success: true,
            error: false
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: true
        }
    }
}