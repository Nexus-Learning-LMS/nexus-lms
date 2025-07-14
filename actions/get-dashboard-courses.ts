import { Category, Chapter, Course } from '@prisma/client'
import { db } from '@/lib/db'
import { getProgress } from '@/actions/get-progress'

type CourseWithProgressWithCategory = Course & {
  category: Category
  chapters: Chapter[]
  progress: number | null
}

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[]
  coursesInProgress: CourseWithProgressWithCategory[]
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    })

    // 1. Remove the incorrect type assertion. Let TypeScript infer the type from Prisma.
    const courses = purchasedCourses.map((purchase) => purchase.course) as (Course & {
      category: Category | null
      chapters: Chapter[]
    })[]

    // 2. Create a new array to hold the final, correctly typed objects.
    const coursesWithProgress: CourseWithProgressWithCategory[] = []

    // 3. Iterate and build the new array with the `progress` property included.
    for (let course of courses) {
      if (course.category) {
        const progress = await getProgress(userId, course.id)
        coursesWithProgress.push({
          ...course,
          category: course.category,
          progress: progress,
        })
      }
    }

    const completedCourses = coursesWithProgress.filter((course) => course.progress === 100)
    const coursesInProgress = coursesWithProgress.filter((course) => (course.progress ?? 0) < 100)

    return {
      completedCourses,
      coursesInProgress,
    }
  } catch (error) {
    console.log('[GET_DASHBOARD_COURSES]', error)
    return {
      completedCourses: [],
      coursesInProgress: [],
    }
  }
}
