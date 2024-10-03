"use server"

import { revalidatePath } from "next/cache"
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
        revalidatePath("/list/subjects")
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