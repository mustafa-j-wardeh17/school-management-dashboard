import Announcements from '@/components/Announcements'
import BigCalendarContainer from '@/components/BigCalendarContainer'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const TeacherPage = () => {
  const { userId } = auth()


  return (
    <div className="flex-1 flex xl:flex-row flex-col p-4 gap-4">
      <div className="w-full xl:w-2/3 flex flex-col gap-8">
        <div className='h-full bg-white p-4 rounded-md'>
          <h1 className='text-xl font-semibold'>Schedule</h1>
          <BigCalendarContainer
            type='teacherId'
            id={userId!}
          />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex h-full flex-col gap-8">
        <Announcements />
      </div>
    </div>
  )
}

export default TeacherPage