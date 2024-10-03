import Announcements from '@/components/Announcements'
import BigCalendarContainer from '@/components/BigCalendarContainer'
import FormContainer from '@/components/FormContainer'
import Performance from '@/components/Performance'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { Teacher } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const TeacherPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const teacher:
    | (Teacher & {
      _count: { subjects: number; lessons: number; classes: number };
    })
    | null = await prisma.teacher.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            subjects: true,
            lessons: true,
            classes: true,
          },
        },
      },
    });

  if (!teacher) {
    return notFound();
  }
  return (
    <div className='flex flex-col xl:flex-row gap-4 p-4'>
      {/* LEFT */}
      <div className='xl:w-2/3 w-full'>
        {/* TOP */}
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* TEACHER INFO CARD */}
          <div className="bg-mSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={teacher.img || "/noAvatar.png"}
                alt="Teacher Image"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className='flex items-center gap-4'>
                <h1 className='text-xl font-semibold'>{teacher.name}</h1>
                {role === "admin" && <FormContainer
                  table="teacher"
                  type="update"
                  data={teacher}
                />}
              </div>
              <p className='text-sm text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image
                    src="/blood.png"
                    alt='teacher blood image'
                    width={14}
                    height={14}
                  />
                  <span>{teacher.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image
                    src="/date.png"
                    alt='teacher date image'
                    width={14}
                    height={14}
                  />
                  {new Intl.DateTimeFormat("en-US").format(teacher.birthday)}
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image
                    src="/mail.png"
                    alt='teacher mail image'
                    width={14}
                    height={14}
                  />
                  <span>{teacher.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image
                    src="/phone.png"
                    alt='teacher blood image'
                    width={14}
                    height={14}
                  />
                  <span>{teacher.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className='flex-1 flex gap-4 justify-between flex-wrap' >
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:w-[45%] 2xl:w-[47%]">
              <Image
                src="/singleAttendance.png"
                alt="Teacher Attendance Image"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className='flex flex-col'>
                <h1 className='text-xl font-semibold'>90%</h1>
                <span className='text-sm text-gray-400'>Attendance</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:w-[45%] 2xl:w-[47%]">
              <Image
                src="/singleBranch.png"
                alt="Teacher Branch Image"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className='flex flex-col'>
                <h1 className='text-xl font-semibold'>{teacher._count.subjects}</h1>
                <span className='text-sm text-gray-400'>Branches</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:w-[45%] 2xl:w-[47%]">
              <Image
                src="/singleLesson.png"
                alt="Teacher Lesson Image"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className='flex flex-col'>
                <h1 className='text-xl font-semibold'>{teacher._count.lessons}</h1>
                <span className='text-sm text-gray-400'>Lessons</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:w-[45%] 2xl:w-[47%]">
              <Image
                src="/singleClass.png"
                alt="Teacher Attendance Image"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className='flex flex-col'>
                <h1 className='text-xl font-semibold'>{teacher._count.classes}</h1>
                <span className='text-sm text-gray-400'>Class</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className='mt-4 bg-white rounded-md p-4 h-[800px]'>
          {/* TEACHER SCHEDULE */}
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendarContainer type="teacherId" id={teacher.id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className='xl:w-1/3 w-full flex flex-col gap-4'>
        <div className='bg-white rounded-md p-4'>
          <h1 className='text-xl font-semibold'>Shortcuts</h1>
          <div className='mt-4 flex gap-4 flex-wrap text-xs text-gray-500'>
            <Link
              href={`/list/classes?supervisorId=${'teacher12'}`}
              className='p-3 rounded-md bg-mSkyLight'>
              Teacher&apos;s Classes
            </Link>
            <Link
              href={`/list/students?teacherId=${'teacher12'}`}
              className='p-3 rounded-md bg-mPurpleLight'>
              Teacher&apos;s Students
            </Link>
            <Link
              href={`/list/lessons?teacherId=${'teacher12'}`}
              className='p-3 rounded-md bg-mYellowLight'>
              Teacher&apos;s Lessons
            </Link>
            <Link
              href={`/list/exams?classId=${'2'}`}
              className='p-3 rounded-md bg-pink-50'>
              Teacher&apos;s Exams
            </Link>
            <Link
              href={`/list/assignments?teacherId=${'teacher12'}`}
              className='p-3 rounded-md bg-mSkyLight'>
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  )
}

export default TeacherPage