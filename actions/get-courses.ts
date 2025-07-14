import { Category, Course, Purchase } from '@prisma/client'
import { db } from '@/lib/db'

import { getProgress } from '@/actions/get-progress'
import { unstable_cache as cache } from 'next/cache'

type CourseWithProgressWithCategory = Course & {
  category: Category | null
  chapters: { id: string }[]
  progress: number | null
  purchases: Purchase[]
}

type GetCourses = {
  userId: string
  title?: string
  categoryId?: string
}

// By wrapping this function, Next.js will automatically cache the result.
// The first user to load the search page will trigger the database query.
// For the next 60 seconds, any other user who visits will get the
// result instantly from the cache, without hitting the database.
export const getCourses = cache(
  async ({ userId, title, categoryId }: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
      const courses = await db.course.findMany({
        where: {
          isPublished: true,
          title: {
            contains: title,
            mode: 'insensitive',
          },
          categoryId,
        },
        include: {
          category: true,
          chapters: {
            where: {
              isPublished: true,
            },
            select: {
              id: true,
            },
          },
          purchases: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            }
          }

          const progressPercentage = await getProgress(userId, course.id)

          return {
            ...course,
            progress: progressPercentage,
          }
        }),
      )

      return coursesWithProgress
    } catch (error) {
      console.log('[GET_COURSES]', error)
      return []
    }
  },
  ['get-courses'],
  { revalidate: 60 },
)
