import { db } from '@/lib/db'
import { Course, Purchase } from '@prisma/client'
import { clerkClient } from '@clerk/nextjs/server'

type PurchaseWithCourse = Purchase & {
  course: Course
}

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {}

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0
    }
    // Instead of summing the price, we now count the number of enrollments.
    grouped[courseTitle] += 1
  })

  return grouped
}

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      include: {
        course: true,
      },
    })

    const groupedData = groupByCourse(purchases)
    const data = Object.entries(groupedData).map(([courseTitle, total]) => ({
      name: courseTitle,
      total: total,
    }))

    // --- START OF NEW METRICS ---
    const totalSales = purchases.length
    const clerk = await clerkClient()
    const totalUsers = await clerk.users.getCount()
    const totalCourses = await db.course.count({
      where: { isPublished: true },
    })
    // --- END OF NEW METRICS ---

    return {
      data,
      totalSales,
      totalUsers,
      totalCourses,
    }
  } catch (error) {
    console.log('[GET_ANALYTICS]', error)
    return {
      data: [],
      totalSales: 0,
      totalUsers: 0,
      totalCourses: 0,
    }
  }
}
