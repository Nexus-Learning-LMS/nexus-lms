import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'

import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'

const CoursesPage = async () => {
  const { userId } = await auth()

  if (!userId) {
    return redirect('/')
  }

  // ---  Prisma Query ---
  // This query now fetches courses based on the new logic.
  // It uses an 'OR' operator to combine two conditions:
  // 1. Fetch all courses that are published.
  // 2. Fetch all courses that are drafts AND created by the current user.
  const courses = await db.course.findMany({
    where: {
      OR: [
        {
          isPublished: true,
        },
        {
          userId: userId,
          isPublished: false,
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  // --- END OF CHANGE ---

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  )
}
export default CoursesPage
