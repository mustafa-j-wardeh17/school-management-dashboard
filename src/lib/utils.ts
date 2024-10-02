import { auth } from "@clerk/nextjs/server"
import { title } from "process"

const { userId, sessionClaims } = auth()
export const role = (sessionClaims?.metadata as { role?: string })?.role
export const currentUserId = userId


// for big calender comp to fetch the week schedule

const currentWorkWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay()

    const startOfWeek = new Date(today)

    if (dayOfWeek === 0) {
        startOfWeek.setDate(today.getDate() + 1)
    }

    if (dayOfWeek === 6) {
        startOfWeek.setDate(today.getDate() + 2)
    } else {
        startOfWeek.setDate(today.getDate() - (dayOfWeek - 1))
    }

    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 4);
    endOfWeek.setHours(23, 59, 59, 999)


    return { startOfWeek, endOfWeek }
}

export const adjustScheduleToCurrentWeek = (lessons: { title: string, start: Date, end: Date }[]) => {
    const { startOfWeek, endOfWeek } = currentWorkWeek()

    return lessons.map(lesson => {
        const lessonDayOfWeek = lesson.start.getDay();

        const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1

        const adjustStartDate = new Date(startOfWeek);

        adjustStartDate.setDate(startOfWeek.getDate() + daysFromMonday)


        const adjustEndDate = new Date(startOfWeek);
        adjustEndDate.setHours(
            lesson.end.getHours(),
            lesson.end.getMinutes(),
            lesson.end.getSeconds(),
        )

        return {
            title: lesson.title,
            start: adjustStartDate,
            end: adjustEndDate
        }

    })

}