import Announcements from '@/components/Announcements'
import BigCalendarContainer from '@/components/BigCalendarContainer'
import EventCalendar from '@/components/EventCalendar'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const StudentPage = async () => {
  const { userId } = auth()

  const classItem = await prisma.class.findMany({
    where: {
      students: {
        some: {
          id: userId!
        }
      }
    }
  })

  return (
    <div className="flex-1 flex xl:flex-row flex-col p-4 gap-4">
      <div className="w-full xl:w-2/3 flex flex-col gap-8">
        <div className='h-full bg-white p-4 rounded-md'>
          <h1 className='text-xl font-semibold'>Schedule (4A)</h1>
          <BigCalendarContainer
            type='classId'
            id={classItem[0].id}
          />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  )
}

export default StudentPage