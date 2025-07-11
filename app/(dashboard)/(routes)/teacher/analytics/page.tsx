import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { getAnalytics } from '@/actions/get-analytics'
import { isTeacher } from '@/lib/teacher'

import { DataCard } from './_components/data-card'
import { Chart } from './_components/chart'

const AnalyticsPage = async () => {
  const { userId } = await auth()

  if (!userId || !isTeacher(userId)) {
    return redirect('/')
  }

  const { data, totalSales, totalUsers, totalCourses } = await getAnalytics(userId)

  return (
    <div className="p-6">
      {/* --- START OF CHANGE: Added page title --- */}
      <h1 className="text-2xl font-bold mb-4">Analytics Page</h1>
      {/* --- END OF CHANGE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <DataCard label="Total Users" value={totalUsers} />
        <DataCard label="Total Enrollments" value={totalSales} />
        <DataCard label="Total Courses" value={totalCourses} />
      </div>
      <Chart data={data} />
    </div>
  )
}

export default AnalyticsPage
