import Announcements from '@/components/Announcements'
import BigCalendarContainer from '@/components/BigCalendarContainer'
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import React from 'react'

const ParentPage = async () => {
  const { userId } = auth();
  const currentUserId = userId;

  const students = await prisma.student.findMany({
    where: {
      parentId: currentUserId!
    }
  })
  return (
    <div className="flex-1 flex xl:flex-row flex-col p-4 gap-4">
      <div>
        {students.map((student) => (
          <div className="w-full xl:w-2/3" key={student.id}>
            <div className="h-full bg-white p-4 rounded-md">
              <h1 className="text-xl font-semibold">
                Schedule ({student.name + " " + student.surname})
              </h1>
              <BigCalendarContainer type="classId" id={student.classId} />
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex h-full flex-col gap-8">
        <Announcements />
      </div>
    </div>
  )
}

export default ParentPage