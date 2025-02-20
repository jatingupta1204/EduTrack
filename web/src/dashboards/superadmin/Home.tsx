import React, { useState, useEffect } from "react"
import Scholarcap from "@/assets/Scholarcap.png";
import Backpack from "@/assets/Backpack.png";
import CollegeStudent from "@/assets/CollegeStudent.png";
import { useNavigate } from "react-router-dom";

interface Stats {
  schools: number
  departments: number
  courses: number
  students: number
}

interface Notice {
  id: string
  title: string
  description: string
}

interface User {
  first_name?: string
  last_name?: string
  username?: string
}

interface OverviewCardProps {
  amount: number
  label: string
  icon: string
}

const OverviewCard: React.FC<OverviewCardProps> = ({ amount, label, icon }) => {
  return (
    <div className="h-48 w-full p-6 rounded-xl shadow-md flex flex-col justify-center items-center bg-white transition-all duration-300 hover:border-4 hover:border-[#925fe2]">
      <div className="w-20 h-20 bg-[#e5d5fd] text-[#925fe2] flex items-center justify-center text-6xl rounded-lg">
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mt-3">{amount.toLocaleString()}</h3>
      <p className="text-lg text-gray-500">{label}</p>
    </div>
  )
}


interface ManageCardProps {
  title: string
  icon: string
  link: string
}

const ManageCard: React.FC<ManageCardProps> = ({ title, icon, link }) => {
  const navigate = useNavigate();
  return (
    <div className="p-6 rounded-xl bg-[#e5d5fd] shadow-sm border border-gray-200 transition-all duration-300 hover:border-4 hover:border-[#925fe2] flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-lg text-[#6a3dbf] mb-4">{title}</h3>
        <button onClick={() => navigate(link)} className="px-4 py-2 bg-[#925fe2] text-white rounded-lg text-sm font-medium">Manage</button>
      </div>
      <div className="text-6xl text-[#925fe2]">{icon}</div>
    </div>
  )
}

interface NoticeCardProps {
  title: string
  description: string
}

const NoticeCard: React.FC<NoticeCardProps> = ({ title, description }) => {
  return (
    <div className="p-4 rounded-xl bg-gray-50">
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
      <button className="text-[#925fe2] text-sm font-medium mt-2">See more</button>
    </div>
  )
}

export default function SuperAdminContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState<Stats>({
    schools: 0,
    departments: 0,
    courses: 0,
    students: 0,
  })
  const [notices, setNotices] = useState<Notice[]>([])
  const [user, setUser] = useState<User>({})

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const userRes = await fetch("/api/v1/users/getSingleUser")
        if (!userRes.ok) throw new Error("Failed to fetch user data")
        const userData = await userRes.json()

        const statsRes = await fetch("/api/v1/dashboard/stats")
        if (!statsRes.ok) throw new Error("Failed to fetch statistics")
        const statsData = await statsRes.json()

        const noticeRes = await fetch("/api/v1/notices/getAllNotice")
        if (!noticeRes.ok) throw new Error("Failed to fetch notices")
        const noticeData = await noticeRes.json()

        setUser(userData.data)
        setStats(statsData.data)
        setNotices(noticeData.data.notices || [])
        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Error fetching dashboard data")
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white">Loading Dashboard...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-red-500">{error}</div>
  }

  const displayName = user.first_name ? `${user.first_name} ${user.last_name || ""}` : user.username || "Super Admin"

  return (
    <main className="p-6 min-h-screen">
      <div className="bg-[#925fe2] rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10 p-7">
          <div className="text-white">
            <p className="text-sm mb-2">{currentDate}</p>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {displayName}!</h1>
            <p className="text-[#e2d4f7] text-lg">Manage and monitor all institutions, users, and more.</p>
          </div>
        </div>
        <div className="absolute top-0 right-[155px] w-auto h-auto z-0">
          <img src={Scholarcap} alt="Scholar Cap" className="w-96 opacity-90" />
        </div>
        <div className="absolute top-0 right-16 w-60 h-auto z-10">
          <img src={CollegeStudent} alt="College Student" className="w-full" />
        </div>
        <div className="absolute top-12 right-0 w-auto h-auto z-0">
          <img src={Backpack} alt="Backpack" className="w-44 opacity-90" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <OverviewCard amount={stats.schools} label="Total Schools" icon="🏫" />
            <OverviewCard amount={stats.departments} label="Departments" icon="📚" />
            <OverviewCard amount={stats.courses} label="Courses" icon="📖" />
          </div>
          <h2 className="text-xl font-semibold mt-8 mb-4">Manage Institutions</h2>
          <div className="grid grid-cols-2 gap-4">
            <ManageCard title="Manage Admin" icon="👔" link="/dashboard/superadmin/manage-admin" />
            <ManageCard title="Manage Students" icon="👨‍🎓" link="/dashboard/superadmin/manage-student" />
          </div>
        </div>

        <div className="col-span-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Daily Notices</h2>
              <button className="text-[#925fe2] text-sm font-medium">See all</button>
            </div>
            <div className="space-y-4">
              {notices.length > 0 ? (
                notices.slice(0, 2).map((notice) => (
                  <NoticeCard key={notice.id} title={notice.title} description={notice.description} />
                ))
              ) : (
                <>
                  <NoticeCard
                    title="System Update"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  />
                  <NoticeCard
                    title="New Admin Tools"
                    description="Norem ipsum dolor sit amet, consectetur adipiscing elit."
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}