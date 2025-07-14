import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { getAnalytics } from '@/actions/get-analytics'
import { isTeacher } from '@/lib/teacher'
import { AnalyticsClient } from './_components/analytics-client' // Import the new client component

const AnalyticsPage = async () => {
  const { userId } = await auth()

  if (!userId || !isTeacher(userId)) {
    return redirect('/')
  }

  const { data, totalSales, totalUsers, totalCourses } = await getAnalytics(userId)

  return <AnalyticsClient data={data} totalSales={totalSales} totalUsers={totalUsers} totalCourses={totalCourses} />
}

export default AnalyticsPage
