'use client'

import dynamic from 'next/dynamic'
import { DataCardSkeleton } from './data-card-skeleton'
import { ChartSkeleton } from './charts-skeleton'

// --- Dynamically import the components within a Client Component ---
const DataCard = dynamic(() => import('./data-card').then((mod) => mod.DataCard), {
  loading: () => <DataCardSkeleton />,
  ssr: false,
})

const Chart = dynamic(() => import('./chart').then((mod) => mod.Chart), {
  loading: () => <ChartSkeleton />,
  ssr: false,
})

interface AnalyticsClientProps {
  data: { name: string; total: number }[]
  totalUsers: number
  totalSales: number
  totalCourses: number
}

export const AnalyticsClient = ({ data, totalUsers, totalSales, totalCourses }: AnalyticsClientProps) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <DataCard label="Total Users" value={totalUsers} />
        <DataCard label="Total Enrollments" value={totalSales} />
        <DataCard label="Total Courses" value={totalCourses} />
      </div>
      <Chart data={data} />
    </div>
  )
}
