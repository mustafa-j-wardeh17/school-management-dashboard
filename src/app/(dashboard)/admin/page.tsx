import Announcements from "@/components/Announcements"
import AttendanceChartCountainer from "@/components/AttendanceChartCountainer"
import CountContainer from "@/components/CountContainer"
import EventCalendarContainer from "@/components/EventCalendarContainer"
import FinanceChart from "@/components/FinanceChart"
import UserCard from "@/components/UserCard"

const AdminPage = ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  return (
    <div className="flex md:flex-row flex-col p-4 gap-4">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARD */}
        <div className="flex flex-row justify-between gap-4 flex-wrap">
          <UserCard type="admin" />
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
        </div>
        {/* MIDDLE CHART */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="lg:w-1/3 w-full h-[450px]">
            <CountContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="lg:w-2/3 w-full h-[450px]">
            <AttendanceChartCountainer />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div
          className="w-full h-[500px]"
        >
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  )
}

export default AdminPage